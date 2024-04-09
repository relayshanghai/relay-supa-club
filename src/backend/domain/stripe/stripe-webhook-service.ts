import { StripeWebhookType, type StripeWebhookRequest } from 'pages/api/v2/stripe-webhook/request';
import BillingEventRepository from 'src/backend/database/billing-event/billing-event-repository';
import CompanyRepository from 'src/backend/database/company/company-repository';
import { type ProfileEntity } from 'src/backend/database/profile/profile-entity';
import { ProfileRepository } from 'src/backend/database/profile/profile-repository';
import SubscriptionRepository from 'src/backend/database/subcription/subscription-repository';
import SlackService from 'src/backend/integration/slack/slack-service';
import StripeService from 'src/backend/integration/stripe/stripe-service';
import type Stripe from 'stripe';
import dayjs from 'dayjs';
import { logger } from 'src/backend/integration/logger';
import awaitToError from 'src/utils/await-to-error';
import { type CompanyEntity } from 'src/backend/database/company/company-entity';
import SubscriptionV2Service from '../subscription/subscription-v2-service';
import { RequestContext } from 'src/utils/request-context/request-context';

// regex for exclude email with support+cus, QA, Test, relay.club, boostbot.ai
const regexExcludeEmailDomain = /^(.*?)@(?:([^.]+)\.boostbot\.ai|boostbot\.ai|relay\.club)\b/;
const regexExcludeEmailUsername = /\b[\w.+]*(?:test|qa)[\w.+]*@\w+\.\w+\b/;

export class StripeWebhookService {
    public static readonly service: StripeWebhookService = new StripeWebhookService();
    public static readonly allowedToSend = process.env.STRIPE_WEBHOOK_ALLOWED_TO_SEND_TO_SLACK ?? 'false';

    static getService(): StripeWebhookService {
        return StripeWebhookService.service;
    }

    allowedToSendToSlack(email: string) {
        if (StripeWebhookService.allowedToSend === 'true') {
            return !regexExcludeEmailDomain.test(email) && !regexExcludeEmailUsername.test(email);
        }
    }

    async handler(request: StripeWebhookRequest) {
        let err = null,
            company = null;
        [err, company] = await awaitToError(
            CompanyRepository.getRepository().findOne({
                where: {
                    cusId: request.data?.object.customer as string,
                },
            }),
        );
        if (err) logger.error('stripe webhook get company error', err);
        if (!company) return { message: 'Webhook received with no company' };
        if (company) RequestContext.setContext({ companyId: company.id });

        [err] = await awaitToError(
            BillingEventRepository.getRepository().save({
                company: company as CompanyEntity,
                data: request.data?.object,
                provider: 'stripe',
                type: request.type,
                createdAt: new Date(),
                updatedAt: new Date(),
            }),
        );
        if (err) logger.error('stripe webhook save to billing event error', err);

        [err] = await awaitToError(
            SubscriptionRepository.getRepository().update(
                {
                    company: company as CompanyEntity,
                },
                {
                    providerLastEvent: new Date(request.created * 1000).toString(),
                },
            ),
        );
        if (err) logger.error('stripe webhook update subscription error', err);

        [err] = await awaitToError(this.handlingWebhookTypes(request));
        if (err) logger.error('stripe webhook error', err);

        return { message: 'Webhook received' };
    }

    private async handlingWebhookTypes(request: StripeWebhookRequest) {
        switch (request.type) {
            case StripeWebhookType.CHARGE_SUCCEEDED:
            case StripeWebhookType.INVOICE_PAID:
                return this.chargeSucceededHandler(request.data as StripeWebhookRequest<Stripe.Invoice>['data']);
            case StripeWebhookType.CHARGE_FAILED:
            case StripeWebhookType.INVOICE_PAYMENT_FAILED:
                return this.chargeFailedHandler(
                    request.data as StripeWebhookRequest<Stripe.Charge | Stripe.Invoice>['data'],
                    request.type,
                );
            case StripeWebhookType.CUSTOMER_SUBSCRIPTION_CREATED:
                return this.customerSubscriptionCreatedHandler(
                    request.data as StripeWebhookRequest<Stripe.Subscription>['data'],
                );
            case StripeWebhookType.CUSTOMER_SUBSCRIPTION_UPDATED:
                return this.customerSubscriptionUpdatedHandler(
                    request.data as StripeWebhookRequest<Stripe.Subscription & { plan: Stripe.Plan }>['data'],
                );
            case StripeWebhookType.CUSTOMER_SUBSCRIPTION_TRIAL_WILL_END:
                return this.customerSubscriptionTrialWillEndHandler(
                    request.data as StripeWebhookRequest<Stripe.Subscription>['data'],
                );
        }
    }

    private async chargeSucceededHandler(data: StripeWebhookRequest<Stripe.Invoice>['data']) {
        const subscription = await SubscriptionRepository.getRepository().findOne({
            where: {
                company: {
                    cusId: data?.object.customer as string,
                },
            },
        });
        if (subscription) {
            const stripeSubscription = await StripeService.getService().retrieveSubscription(
                subscription.providerSubscriptionId,
            );
            if (!stripeSubscription) {
                throw new Error('Stripe subscription not found');
            }
            subscription.pausedAt = new Date(stripeSubscription.current_period_end * 1000);
            subscription.cancelledAt = null;
            await SubscriptionRepository.getRepository().save(subscription);
            return;
        }
        const { companyId } = RequestContext.getContext();
        if (!companyId) throw new Error('Company not found');
        if (!subscription) throw new Error('Subscription not found');
        await SubscriptionV2Service.getService().storeSubscription({
            companyId,
            cusId: data?.object.customer as string,
            request: {
                subscriptionId: data?.object.subscription as string,
            },
        });
    }

    private async chargeFailedHandler(
        data: StripeWebhookRequest<Stripe.Charge | Stripe.Invoice>['data'],
        type?: StripeWebhookType,
    ) {
        const subscription = await SubscriptionRepository.getRepository().findOne({
            where: {
                company: {
                    cusId: data?.object.customer as string,
                },
            },
        });
        if (!subscription) {
            throw new Error('Subscription not found');
        }
        subscription.cancelledAt = new Date();
        await SubscriptionRepository.getRepository().save(subscription);

        if (type === StripeWebhookType.INVOICE_PAYMENT_FAILED) {
            const company = subscription.company;
            const profile = await ProfileRepository.getRepository().isCompanyOwner(company.profiles as ProfileEntity[]);
            if (!this.allowedToSendToSlack(profile.email as string)) return;
            await SlackService.getService().sendFailedRecurringMessage({
                company,
                profile,
                paymentIntent: (data.object as Stripe.Invoice).payment_intent as string,
            });
        }
    }

    private async customerSubscriptionCreatedHandler(data: StripeWebhookRequest<Stripe.Subscription>['data']) {
        const company = await CompanyRepository.getRepository().findOne({
            where: {
                cusId: data?.object.customer as string,
            },
            relations: {
                profiles: true,
            },
        });
        if (!company) {
            throw new Error('Company not found');
        }
        const profile = await ProfileRepository.getRepository().isCompanyOwner(company.profiles as ProfileEntity[]);
        if (!this.allowedToSendToSlack(profile.email as string)) return;
        await SlackService.getService().sendSignupMessage({ company, profile });
    }

    private async customerSubscriptionUpdatedHandler(
        data: StripeWebhookRequest<Stripe.Subscription & { plan: Stripe.Plan }>['data'],
    ) {
        const previousAttributes = data.previous_attributes;
        const previousSubscription = { items: previousAttributes?.items } as Stripe.Subscription;
        if (!previousSubscription) {
            throw new Error('Previous subscription not found');
        }
        const company = await CompanyRepository.getRepository().findOne({
            where: {
                cusId: data?.object.customer as string,
            },
            relations: {
                profiles: true,
            },
        });
        if (!company) {
            throw new Error('Company not found');
        }
        const profile = await ProfileRepository.getRepository().isCompanyOwner(company.profiles as ProfileEntity[]);
        const currentPlanId = data?.object.plan.id;
        const previousPlanId = data?.previous_attributes?.plan ? data?.previous_attributes.plan.id : undefined;
        if (!this.allowedToSendToSlack(profile.email as string)) return;
        if (previousAttributes?.status === 'incomplete') return;

        // get the difference in days between the current period end and the previous period end
        let diffInDays = null;
        if (previousAttributes?.current_period_end) {
            diffInDays = dayjs(dayjs.unix(data.object.current_period_end)).diff(
                dayjs.unix(previousAttributes?.current_period_end as number),
                'day',
            );
        }

        if (previousSubscription && previousSubscription.items && previousPlanId && currentPlanId !== previousPlanId) {
            await SlackService.getService().sendChangePlanMessage({
                company,
                profile,
                newSubscription: data.object,
                oldSubscription: previousSubscription,
            });
        } else if (
            diffInDays &&
            diffInDays >= 30 &&
            previousAttributes?.latest_invoice &&
            data.object.status === 'active'
        ) {
            await SlackService.getService().sendRenewSubscriptionMessage({
                company,
                profile,
                subscription: data.object,
            });
        } else if (data.object.cancel_at !== null && data.object.status === 'active') {
            await SlackService.getService().sendCancelSubscriptionMessage({
                company,
                profile,
                subscription: data.object,
            });
        } else if (data.object.cancel_at === null && data.object.status === 'active') {
            await SlackService.getService().sendResumeSubscriptionMessage({
                company,
                profile,
                subscription: data.object,
            });
        }
    }

    private async customerSubscriptionTrialWillEndHandler(data: StripeWebhookRequest<Stripe.Subscription>['data']) {
        const company = await CompanyRepository.getRepository().findOne({
            where: {
                cusId: data?.object.customer as string,
            },
            relations: {
                profiles: true,
            },
        });
        if (!company) {
            throw new Error('Company not found');
        }
        const profile = await ProfileRepository.getRepository().isCompanyOwner(company.profiles as ProfileEntity[]);
        const date = dayjs.unix(data.object.trial_end as number);
        const diffInDays = dayjs().diff(date, 'day');
        if (!this.allowedToSendToSlack(profile.email as string)) return;
        await SlackService.getService().sendTrialEndingMessage({
            company,
            profile,
            trialDayExpiring: Math.abs(diffInDays),
        });
    }
}

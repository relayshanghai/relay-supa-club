import { UseLogger } from 'src/backend/integration/logger/decorator';
import { CompanyIdRequired } from '../decorators/company-id';
import type {
    CreatePaymentMethodRequest,
    CreateSubscriptionRequest,
    PostConfirmationRequest,
} from 'pages/api/v2/subscriptions/request';
import { UseTransaction } from 'src/backend/database/provider/transaction-decorator';
import { RequestContext } from 'src/utils/request-context/request-context';
import SubscriptionRepository from 'src/backend/database/subcription/subscription-repository';
import { BadRequestError, NotFoundError, UnprocessableEntityError } from 'src/utils/error/http-error';
import { SubscriptionEntity } from 'src/backend/database/subcription/subscription-entity';
import type { StripeSubscription } from 'src/backend/integration/stripe/type';
import StripeService from 'src/backend/integration/stripe/stripe-service';
import type Stripe from 'stripe';
import CompanyRepository from 'src/backend/database/company/company-repository';
import awaitToError from 'src/utils/await-to-error';
import { type CompanyEntity } from 'src/backend/database/company/company-entity';
import { type UpdateSubscriptionRequest as UpdateSubscriptionCouponRequest } from 'pages/api/v2/subscriptions/[subscriptionId]/request';
import { type ChangeSubscriptionRequest } from 'pages/api/v2/subscriptions/request';

export default class SubscriptionV2Service {
    static service: SubscriptionV2Service;
    static getService(): SubscriptionV2Service {
        if (!SubscriptionV2Service.service) {
            SubscriptionV2Service.service = new SubscriptionV2Service();
        }
        return SubscriptionV2Service.service;
    }

    @CompanyIdRequired()
    async updateCustomer(data: Stripe.CustomerUpdateParams) {
        const companyId = RequestContext.getContext().companyId as string;
        const [err, { cusId }] = await awaitToError(CompanyRepository.getRepository().getCompanyById(companyId));
        if (err || !cusId) {
            throw new NotFoundError('Company not found', err);
        }
        return await StripeService.getService().updateCustomer(cusId, data);
    }

    @CompanyIdRequired()
    async addPaymentMethod(request: CreatePaymentMethodRequest, ipAddress: string) {
        const companyId = RequestContext.getContext().companyId as string;
        const [err, { cusId }] = await awaitToError(CompanyRepository.getRepository().getCompanyById(companyId));
        if (err || !cusId) {
            throw new NotFoundError('Company not found', err);
        }
        const [setupError, setupIntent] = await awaitToError(
            StripeService.getService().createConfirmedSetupIntent({
                cusId,
                paymentMethodType: request.paymentMethodType,
                paymentMethodId: request.paymentMethodId,
                currency: request.currency,
                userAgent: request.userAgent,
                ipAddress,
            }),
        );
        if (setupError) {
            throw new UnprocessableEntityError('entity is unprocessable', setupError);
        }
        await StripeService.getService().attachPaymentMethod(cusId, request.paymentMethodId);

        return setupIntent;
    }

    @CompanyIdRequired()
    async getCustomerPaymentMethods() {
        const companyId = RequestContext.getContext().companyId as string;
        const [err, { cusId }] = await awaitToError(CompanyRepository.getRepository().getCompanyById(companyId));
        if (err || !cusId) {
            throw new NotFoundError('Company not found', err);
        }
        return await StripeService.getService().getCustomerPaymentMethods(cusId);
    }

    @CompanyIdRequired()
    async getDefaultPaymentMethod() {
        const companyId = RequestContext.getContext().companyId as string;
        const [err, { cusId }] = await awaitToError(CompanyRepository.getRepository().getCompanyById(companyId));
        if (err || !cusId) {
            throw new NotFoundError('Company not found', err);
        }
        return await StripeService.getService().getDefaultPaymentMethod(cusId);
    }

    @CompanyIdRequired()
    async getCustomer() {
        const companyId = RequestContext.getContext().companyId as string;
        const [err, { cusId }] = await awaitToError(CompanyRepository.getRepository().getCompanyById(companyId));
        if (err || !cusId) {
            throw new NotFoundError('Company not found', err);
        }
        return await StripeService.getService().getCustomer(cusId);
    }

    @CompanyIdRequired()
    async updateDefaultPaymentMethod(paymentMethodId: string) {
        const companyId = RequestContext.getContext().companyId as string;
        const [err, { cusId }] = await awaitToError(CompanyRepository.getRepository().getCompanyById(companyId));
        if (err || !cusId) {
            throw new NotFoundError('Company not found', err);
        }
        return await StripeService.getService().updateDefaultPaymentMethod(cusId, paymentMethodId);
    }

    async removePaymentMethod(paymentMethodId: string) {
        return await StripeService.getService().removePaymentMethod(paymentMethodId);
    }

    @CompanyIdRequired()
    @UseLogger()
    @UseTransaction()
    async createSubscription(request: CreateSubscriptionRequest) {
        const companyId = RequestContext.getContext().companyId as string;
        const cusId = RequestContext.getContext().customerId as string;
        const existedSubscription = await SubscriptionRepository.getRepository().findOne({
            where: {
                company: {
                    id: companyId,
                },
            },
        });
        if (existedSubscription) {
            const stripeSubscriptionEntity =
                SubscriptionEntity.getSubscriptionEntity<StripeSubscription>(existedSubscription);
            if (
                stripeSubscriptionEntity.subscriptionData.items.data.find((item) => item.price.id === request.priceId)
            ) {
                throw new BadRequestError('You are already subscribed to this plan');
            }
        }
        const subscription = await StripeService.getService().createSubscription(
            cusId,
            request.priceId,
            request.quantity,
        );
        return {
            providerSubscriptionId: subscription.id,
            clientSecret: subscription.clientSecret,
        };
    }

    @UseTransaction()
    @UseLogger()
    async syncStripeSubscriptionWithDb(
        companyId: string,
        cusId: string,
        subscriptionData: Stripe.Subscription,
        limits: {
            profilesLimit: string;
            searchesLimit: string;
            trialProfilesLimit?: string;
            trialSearchesLimit?: string;
        },
    ) {
        if (subscriptionData.status === 'trialing') {
        }
        await CompanyRepository.getRepository().update(
            {
                id: companyId,
            },
            {
                profilesLimit: limits.profilesLimit,
                searchesLimit: limits.searchesLimit,
                trialProfilesLimit: limits.trialProfilesLimit,
                trialSearchesLimit: limits.trialSearchesLimit,
            },
        );
        return await SubscriptionRepository.getRepository().save({
            company: {
                id: companyId,
            },
            provider: 'stripe',
            providerSubscriptionId: subscriptionData.id,
            paymentMethod:
                subscriptionData.payment_settings?.payment_method_types?.[0] ||
                subscriptionData.default_payment_method?.toString() ||
                'card',
            quantity: subscriptionData.items.data[0].quantity,
            price: subscriptionData.items.data[0].price.unit_amount?.valueOf() || 0,
            total:
                (subscriptionData.items.data[0].price.unit_amount?.valueOf() || 0) *
                (subscriptionData?.items?.data?.[0].quantity ?? 0),
            subscriptionData: subscriptionData,
            discount: subscriptionData.discount?.coupon?.amount_off?.valueOf() || 0,
            coupon: subscriptionData.discount?.coupon?.id,
            activeAt: subscriptionData.current_period_start
                ? new Date(subscriptionData.current_period_start * 1000)
                : undefined,
            pausedAt: subscriptionData.pause_collection?.behavior === 'void' ? new Date() : undefined,
            cancelledAt: subscriptionData.cancel_at ? new Date(subscriptionData.cancel_at * 1000) : undefined,
        });
    }

    @CompanyIdRequired()
    @UseLogger()
    async getSubscription() {
        const companyId = RequestContext.getContext().companyId as string;
        const cusId = RequestContext.getContext().customerId as string;
        let subscription = await SubscriptionRepository.getRepository().findOne({
            where: {
                company: {
                    id: companyId,
                },
            },
        });
        if (!subscription) {
            let lastSubscription = await StripeService.getService().getLastSubscription(cusId);

            if (!lastSubscription) {
                lastSubscription = await StripeService.getService().getCanceledSubscription(cusId);
            }

            if (!lastSubscription || lastSubscription.items.data.length === 0) {
                throw new NotFoundError('No subscription found');
            }

            if (lastSubscription.status === 'trialing') {
                const trialSubscription = {
                    company: {
                        id: companyId,
                    },
                    provider: 'stripe',
                    providerSubscriptionId: lastSubscription.id,
                    paymentMethod: null,
                    quantity: lastSubscription.items.data[0].quantity,
                    price: lastSubscription.items.data[0].price.unit_amount?.valueOf() || 0,
                    total:
                        (lastSubscription.items.data[0].price.unit_amount?.valueOf() || 0) *
                        (lastSubscription?.items?.data?.[0].quantity ?? 0),
                    subscriptionData: lastSubscription,
                    discount: lastSubscription.discount?.coupon?.amount_off?.valueOf() || 0,
                    coupon: lastSubscription.discount?.coupon?.id,
                    activeAt: null,
                    pausedAt: null,
                    cancelledAt: lastSubscription.trial_end ? new Date(lastSubscription.trial_end * 1000) : undefined,
                };
                return trialSubscription;
            } else if (lastSubscription.status === 'canceled') {
                const trialSubscription = {
                    company: {
                        id: companyId,
                    },
                    provider: 'stripe',
                    providerSubscriptionId: lastSubscription.id,
                    paymentMethod: null,
                    quantity: lastSubscription.items.data[0].quantity,
                    price: lastSubscription.items.data[0].price.unit_amount?.valueOf() || 0,
                    total:
                        (lastSubscription.items.data[0].price.unit_amount?.valueOf() || 0) *
                        (lastSubscription?.items?.data?.[0].quantity ?? 0),
                    subscriptionData: lastSubscription,
                    discount: lastSubscription.discount?.coupon?.amount_off?.valueOf() || 0,
                    coupon: lastSubscription.discount?.coupon?.id,
                    activeAt: null,
                    pausedAt: null,
                    cancelledAt: lastSubscription.canceled_at ? new Date(lastSubscription.canceled_at * 1000) : null,
                };
                return trialSubscription;
            }

            const price = await StripeService.getService().getPrice(lastSubscription.items.data[0].price.id as string);
            const product = await StripeService.getService().getProduct(price.product.toString());

            const { trial_profiles, trial_searches, profiles, searches } = product.metadata;

            if (!profiles || !searches) {
                throw new NotFoundError('Missing product metadata');
            }

            subscription = await this.syncStripeSubscriptionWithDb(companyId, cusId, lastSubscription, {
                profilesLimit: profiles,
                searchesLimit: searches,
                trialProfilesLimit: trial_profiles,
                trialSearchesLimit: trial_searches,
            });
        }
        return subscription;
    }

    async getProduct(productId: string) {
        const product = await StripeService.getService().getProduct(productId);
        return product;
    }

    @CompanyIdRequired()
    @UseLogger()
    @UseTransaction()
    async postConfirmation(request: PostConfirmationRequest) {
        const companyId = RequestContext.getContext().companyId as string;
        const cusId = RequestContext.getContext().customerId as string;
        if (request.redirectStatus != 'succeeded' && request.redirectStatus != 'pending') {
            await StripeService.getService().cancelSubscription(cusId);
            throw new UnprocessableEntityError('entity is unprocessable');
        } else if (request.redirectStatus === 'pending') {
            const subs = await StripeService.getService().getSubscription(cusId);
            const subscription = subs.data.length ? subs.data[0] : undefined;
            if (subscription && subscription.status !== 'active') {
                return;
            }
        }

        const paymentIntent = await StripeService.getService().getPaymentIntent(request.paymentIntentId);
        await StripeService.getService().updateSubscription(request.subscriptionId, {
            default_payment_method: paymentIntent.payment_method as string,
        });
        await this.storeSubscription({
            companyId,
            cusId,
            request,
        });
    }

    async storeSubscription({
        companyId,
        cusId,
        request,
    }: {
        companyId: string;
        cusId: string;
        request: Pick<PostConfirmationRequest, 'subscriptionId'>;
    }) {
        const subscription = await StripeService.getService().retrieveSubscription(request.subscriptionId);
        const productMetadata = await StripeService.getService().getProductMetadata(request.subscriptionId);

        const company = await CompanyRepository.getRepository().findOne({
            where: {
                id: companyId,
            },
        });

        await SubscriptionRepository.getRepository().upsert(
            {
                company: company as CompanyEntity,
                provider: 'stripe',
                providerSubscriptionId: subscription.id,
                paymentMethod:
                    subscription.payment_settings?.payment_method_types?.[0] ||
                    subscription.default_payment_method?.toString() ||
                    'card',
                quantity: subscription.items.data[0].quantity,
                price: subscription.items.data[0].price.unit_amount?.valueOf() || 0,
                total:
                    (subscription.items.data[0].price.unit_amount?.valueOf() || 0) *
                    (subscription?.items?.data?.[0].quantity ?? 0),
                subscriptionData: subscription,
                discount: subscription.discount?.coupon?.amount_off?.valueOf() || 0,
                coupon: subscription.discount?.coupon?.id,
                activeAt: new Date(subscription.current_period_start * 1000),
                pausedAt: new Date(subscription.current_period_end * 1000),
                cancelledAt: null,
            },
            {
                conflictPaths: ['company'],
            },
        );

        await CompanyRepository.getRepository().update(
            {
                id: companyId,
            },
            {
                subscriptionStatus: subscription.status as string,
                profilesLimit: productMetadata.profiles,
                searchesLimit: productMetadata.searches,
                trialProfilesLimit: productMetadata.trial_profiles,
                trialSearchesLimit: productMetadata.trial_searches,
                subscriptionPlan: productMetadata.name,
            },
        );

        const [, trialSubscription] = await awaitToError(StripeService.getService().getTrialSubscription(cusId));
        if (trialSubscription) {
            await StripeService.getService().deleteSubscription(trialSubscription.id);
        }
    }

    @CompanyIdRequired()
    @UseLogger()
    async cancelSubscription() {
        const companyId = RequestContext.getContext().companyId as string;
        const subscription = await SubscriptionRepository.getRepository().findOne({
            where: {
                company: {
                    id: companyId,
                },
            },
        });
        if (!subscription) {
            throw new NotFoundError('No subscription found');
        }
        const stripeSubscription = await StripeService.getService().retrieveSubscription(
            subscription.providerSubscriptionId,
        );
        const updatedSubscription = await StripeService.getService().updateSubscription(
            subscription.providerSubscriptionId,
            {
                cancel_at_period_end: true,
            },
        );
        await SubscriptionRepository.getRepository().update(
            {
                id: subscription.id,
            },
            {
                subscriptionData: updatedSubscription,
                cancelledAt: new Date(stripeSubscription.current_period_end * 1000),
            },
        );
    }

    @CompanyIdRequired()
    @UseLogger()
    async applyPromo(subscriptionId: string, request: UpdateSubscriptionCouponRequest) {
        const { data } = await StripeService.getService().getAvailablePromo();
        const foundCoupon = data.find((promo) => promo.code === request.coupon);
        if (!foundCoupon) {
            throw new UnprocessableEntityError('Invalid promo code');
        }
        await StripeService.getService().updateSubscription(subscriptionId, {
            coupon: foundCoupon.coupon.id,
        });
        return foundCoupon.coupon;
    }

    @CompanyIdRequired()
    @UseLogger()
    async resumeSubscription() {
        const companyId = RequestContext.getContext().companyId as string;
        const subscription = await SubscriptionRepository.getRepository().findOne({
            where: {
                company: {
                    id: companyId,
                },
            },
        });
        if (!subscription) {
            throw new NotFoundError('No subscription found');
        }
        const updatedSubscription = await StripeService.getService().updateSubscription(
            subscription.providerSubscriptionId,
            {
                cancel_at_period_end: false,
            },
        );
        await SubscriptionRepository.getRepository().update(
            {
                id: subscription.id,
            },
            {
                subscriptionData: updatedSubscription,
                cancelledAt: null,
            },
        );
    }

    @CompanyIdRequired()
    @UseLogger()
    async changeSubscription(request: ChangeSubscriptionRequest) {
        const companyId = RequestContext.getContext().companyId as string;
        const subscription = await SubscriptionRepository.getRepository().findOne({
            where: {
                company: {
                    id: companyId,
                },
            },
        });
        if (!subscription) {
            throw new NotFoundError('No subscription found');
        }
        const stripeSubscription = await StripeService.getService().changeSubscription(
            subscription.providerSubscriptionId,
            {
                priceId: request.priceId,
                quantity: request.quantity ? request.quantity : 1,
            },
        );
        const productMetadata = await StripeService.getService().getProductMetadata(stripeSubscription.id);
        await SubscriptionRepository.getRepository().update(
            {
                id: subscription.id,
            },
            {
                quantity: stripeSubscription.items.data[0].quantity,
                price: stripeSubscription.items.data[0].price.unit_amount?.valueOf() || 0,
                total:
                    (stripeSubscription.items.data[0].price.unit_amount?.valueOf() || 0) *
                    (stripeSubscription.items.data[0].quantity ?? 0),
                subscriptionData: stripeSubscription,
                activeAt: new Date(stripeSubscription.current_period_start * 1000),
                pausedAt: new Date(stripeSubscription.current_period_end * 1000),
            },
        );
        await CompanyRepository.getRepository().update(
            {
                id: companyId,
            },
            {
                subscriptionStatus: stripeSubscription.status as string,
                profilesLimit: productMetadata.profiles,
                searchesLimit: productMetadata.searches,
                trialProfilesLimit: productMetadata.trial_profiles,
                trialSearchesLimit: productMetadata.trial_searches,
                subscriptionPlan: productMetadata.name,
            },
        );
        return {
            providerSubscriptionId: stripeSubscription.id,
        };
    }
}

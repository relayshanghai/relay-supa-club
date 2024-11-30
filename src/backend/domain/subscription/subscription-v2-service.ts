import { UseLogger } from 'src/backend/integration/logger/decorator';
import { CompanyIdRequired } from '../decorators/company-id';
import type {
    CreatePaymentMethodRequest,
    CreateSubscriptionRequest,
    PostConfirmationRequest,
    ChangeSubscriptionRequest,
} from 'pages/api/v2/subscriptions/request';
import { UseTransaction } from 'src/backend/database/provider/transaction-decorator';
import { RequestContext } from 'src/utils/request-context/request-context';
import SubscriptionRepository from 'src/backend/database/subcription/subscription-repository';
import { BadRequestError, NotFoundError, UnprocessableEntityError } from 'src/utils/error/http-error';
import { SubscriptionEntity, SubscriptionStatus } from 'src/backend/database/subcription/subscription-entity';
import type { StripeSubscription } from 'src/backend/integration/stripe/type';
import StripeService from 'src/backend/integration/stripe/stripe-service';
import type Stripe from 'stripe';
import CompanyRepository from 'src/backend/database/company/company-repository';
import awaitToError from 'src/utils/await-to-error';
import { type CompanyEntity } from 'src/backend/database/company/company-entity';
import { type UpdateSubscriptionRequest as UpdateSubscriptionCouponRequest } from 'pages/api/v2/subscriptions/[subscriptionId]/request';
import type { Nullable } from 'types/nullable';
import SequenceInfluencerRepository from 'src/backend/database/sequence/sequence-influencer-repository';
import PriceRepository from 'src/backend/database/price/price-repository';
import { type PriceEntity, type SubscriptionType } from 'src/backend/database/price/price-entity';
import type { RelayPlanWithAnnual } from 'types';
import BalanceRepository from 'src/backend/database/balance/balance-repository';
import { BalanceType } from 'src/backend/database/balance/balance-entity';
import { formatStripePrice } from 'src/utils/utils';
import { SequenceInfluencerScheduleStatus } from 'types/v2/sequence-influencer';
import type {
    GetSubscriptionMigrationRequest,
    SubscriptionMigrationRequest,
} from 'pages/api/internal/subscriptions/request';
import type { SyncBalanceRequest } from 'pages/api/internal/balance/request';
import BalanceService from '../balance/balance-service';
import { EXPORT_CREDIT_MAX_TOTAL } from 'src/constants/credits';
const REWARDFUL_COUPON_CODE = process.env.REWARDFUL_COUPON_CODE;
// will be on unix timestamp from 27-06-2024 on 12:00:00 AM UTC
const PRICE_UPDATE_DATE = process.env.PRICE_UPDATE_DATE ?? '1719446760';

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
        const [attachPaymentMethodErr] = await awaitToError(
            StripeService.getService().attachPaymentMethod(cusId, request.paymentMethodId),
        );
        if (attachPaymentMethodErr) {
            throw new UnprocessableEntityError('entity is unprocessable', attachPaymentMethodErr);
        }
        if (request.isDefault) {
            const [setDefaultPaymentMethodErr] = await awaitToError(
                StripeService.getService().updateDefaultPaymentMethod(cusId, request.paymentMethodId),
            );
            if (setDefaultPaymentMethodErr) {
                throw new UnprocessableEntityError('entity is unprocessable', setDefaultPaymentMethodErr);
            }
        }

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
        return StripeService.getService().getDefaultPaymentMethod(cusId);
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
        if (existedSubscription && existedSubscription.status === 'ACTIVE') {
            const stripeSubscriptionEntity =
                SubscriptionEntity.getSubscriptionEntity<StripeSubscription>(existedSubscription);
            if (
                stripeSubscriptionEntity.subscriptionData.items.data.find((item) => item.price.id === request.priceId)
            ) {
                throw new BadRequestError('You are already subscribed to this plan');
            }
        }
        const stripeCustomer = await StripeService.getService().getCustomer(cusId);
        let coupon: Nullable<string> = null;
        if (stripeCustomer?.metadata?.referral) {
            coupon = REWARDFUL_COUPON_CODE;
        }
        const subscription = await StripeService.getService().createSubscription(
            cusId,
            request.priceId,
            request.quantity,
            request.coupon,
        );
        return {
            providerSubscriptionId: subscription.id,
            clientSecret: subscription.clientSecret,
            coupon,
        };
    }

    @UseTransaction()
    @UseLogger()
    async syncStripeSubscriptionWithDb(
        companyId: string,
        cusId: string,
        subscriptionData: SubscriptionEntity,
        limits: {
            profilesLimit: string;
            searchesLimit: string;
            trialProfilesLimit?: string;
            trialSearchesLimit?: string;
        },
    ) {
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
        await SubscriptionRepository.getRepository().save(subscriptionData);
        const newSubs = await SubscriptionRepository.getRepository().findOne({
            where: {
                company: {
                    id: companyId,
                },
            },
        });
        return newSubs;
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

            let newSubscription = {
                companyId,
                provider: 'stripe',
                providerSubscriptionId: lastSubscription.id,
                paymentMethod:
                    lastSubscription.payment_settings?.payment_method_types?.[0] ??
                    lastSubscription.default_payment_method?.toString() ??
                    'card',
                quantity: lastSubscription.items.data[0].quantity as number,
                price: lastSubscription.items.data[0].price.unit_amount?.valueOf() ?? 0,
                total:
                    (lastSubscription.items.data[0].price.unit_amount?.valueOf() ?? 0) *
                    (lastSubscription?.items?.data?.[0].quantity ?? 0),
                subscriptionData: lastSubscription,
                interval: StripeService.getService().getSubscriptionInterval(
                    lastSubscription.items.data[0].plan.interval,
                ),
                discount: lastSubscription.discount?.coupon?.amount_off?.valueOf() ?? 0,
                coupon: lastSubscription.discount?.coupon?.id,
                activeAt: lastSubscription.current_period_start
                    ? new Date(lastSubscription.current_period_start * 1000)
                    : undefined,
                pausedAt: lastSubscription.current_period_end
                    ? new Date(lastSubscription.current_period_end * 1000)
                    : undefined,
                cancelledAt: lastSubscription.cancel_at ? new Date(lastSubscription.cancel_at * 1000) : undefined,
            } as SubscriptionEntity;

            if (lastSubscription.status === 'trialing') {
                newSubscription = {
                    companyId,
                    provider: 'stripe',
                    providerSubscriptionId: lastSubscription.id,
                    paymentMethod: '',
                    quantity: lastSubscription.items.data[0].quantity as number,
                    price: lastSubscription.items.data[0].price.unit_amount?.valueOf() || 0,
                    total:
                        (lastSubscription.items.data[0].price.unit_amount?.valueOf() || 0) *
                        (lastSubscription?.items?.data?.[0].quantity ?? 0),
                    subscriptionData: lastSubscription,
                    interval: StripeService.getService().getSubscriptionInterval(
                        lastSubscription.items.data[0].plan.interval,
                    ),
                    discount: lastSubscription.discount?.coupon?.amount_off?.valueOf() || 0,
                    coupon: lastSubscription.discount?.coupon?.id,
                    activeAt: null,
                    pausedAt: null,
                    cancelledAt: lastSubscription.trial_end ? new Date(lastSubscription.trial_end * 1000) : undefined,
                    status: SubscriptionStatus.TRIAL,
                } as SubscriptionEntity;
            } else if (lastSubscription.status === 'canceled') {
                newSubscription = {
                    companyId,
                    provider: 'stripe',
                    providerSubscriptionId: lastSubscription.id,
                    paymentMethod: '',
                    quantity: lastSubscription.items.data[0].quantity as number,
                    price: lastSubscription.items.data[0].price.unit_amount?.valueOf() || 0,
                    total:
                        (lastSubscription.items.data[0].price.unit_amount?.valueOf() || 0) *
                        (lastSubscription?.items?.data?.[0].quantity ?? 0),
                    subscriptionData: lastSubscription,
                    interval: StripeService.getService().getSubscriptionInterval(
                        lastSubscription.items.data[0].plan.interval,
                    ),
                    discount: lastSubscription.discount?.coupon?.amount_off?.valueOf() || 0,
                    coupon: lastSubscription.discount?.coupon?.id,
                    activeAt: new Date(lastSubscription.current_period_start * 1000),
                    pausedAt: null,
                    cancelledAt: lastSubscription.canceled_at ? new Date(lastSubscription.canceled_at * 1000) : null,
                    status: SubscriptionStatus.CANCELLED,
                } as SubscriptionEntity;
            }

            const price = await StripeService.getService().getPrice(lastSubscription.items.data[0].price.id);
            const product = await StripeService.getService().getProduct(price.product.toString());

            const { trial_profiles, trial_searches, profiles, searches } = product.metadata;

            if (!profiles || !searches) {
                throw new NotFoundError('Missing product metadata');
            }
            subscription = await this.syncStripeSubscriptionWithDb(companyId, cusId, newSubscription, {
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
        resetBalance = true,
        useCusId = false,
    }: {
        companyId: string;
        cusId: string;
        request: Pick<PostConfirmationRequest, 'subscriptionId'>;
        resetBalance?: boolean;
        useCusId?: boolean;
    }) {
        let customerData:
                | (Stripe.Customer & { subscriptions: Stripe.ApiList<Stripe.Subscription & { plan?: Stripe.Plan }> })
                | null = null,
            subscriptionData: (Stripe.Subscription & { plan?: Stripe.Plan }) | null = null;

        if (useCusId) {
            customerData = (await StripeService.getService().getCustomer(cusId, {
                expand: ['subscriptions.data'],
            })) as Stripe.Customer & { subscriptions: Stripe.ApiList<Stripe.Subscription> };
        } else {
            subscriptionData = await StripeService.getService().retrieveSubscription(request.subscriptionId);
        }
        const subscription = customerData ? customerData.subscriptions.data[0] : subscriptionData;
        const plan = subscription?.plan;
        const subscriptionId = useCusId ? (subscription?.id as string) : request.subscriptionId;
        const internalProductMetadata = await PriceRepository.getRepository().findOne({
            where: [
                {
                    priceId: plan?.id,
                },
                { priceIdsForExistingUser: plan?.id },
            ],
        });
        const stripeProductMetadata = await StripeService.getService().getProductMetadata(subscriptionId);
        const productMetadata = {
            profiles: internalProductMetadata ? internalProductMetadata.profiles + '' : stripeProductMetadata.profiles,
            searches: internalProductMetadata ? internalProductMetadata.searches + '' : stripeProductMetadata.searches,
            trial_profiles: stripeProductMetadata.trial_profiles,
            trial_searches: stripeProductMetadata.trial_searches,
            name: stripeProductMetadata.name,
        };

        const company = await CompanyRepository.getRepository().findOne({
            where: {
                id: companyId,
            },
        });
        const interval = StripeService.getService().getSubscriptionInterval(
            subscription?.items.data[0].plan.interval as string,
        );
        const nextMonth = new Date();
        nextMonth.setMonth(new Date().getMonth() + 1);
        const promises = [
            SubscriptionRepository.getRepository().upsert(
                {
                    company: company as CompanyEntity,
                    provider: 'stripe',
                    providerSubscriptionId: subscription?.id,
                    paymentMethod:
                        subscription?.payment_settings?.payment_method_types?.[0] ||
                        subscription?.default_payment_method?.toString() ||
                        'card',
                    quantity: subscription?.items.data[0].quantity,
                    price: +formatStripePrice(subscription?.items.data[0].price.unit_amount?.valueOf() || 0),
                    total: +formatStripePrice(
                        (subscription?.items.data[0].price.unit_amount?.valueOf() || 0) *
                            (subscription?.items?.data?.[0].quantity ?? 0),
                    ),
                    subscriptionData: subscription ? subscription : undefined,
                    interval,
                    discount: subscription?.discount?.coupon?.amount_off?.valueOf() || 0,
                    coupon: subscription?.discount?.coupon?.id,
                    activeAt: subscription?.current_period_start
                        ? new Date(subscription?.current_period_start * 1000)
                        : null,
                    pausedAt: subscription?.current_period_end
                        ? new Date(subscription?.current_period_end * 1000)
                        : null,
                    cancelledAt: null,
                },
                {
                    conflictPaths: ['company'],
                },
            ),
            CompanyRepository.getRepository().update(
                {
                    id: companyId,
                },
                {
                    subscriptionStatus: subscription?.status as string,
                    profilesLimit: productMetadata.profiles,
                    searchesLimit: productMetadata.searches,
                    trialProfilesLimit: productMetadata.trial_profiles,
                    trialSearchesLimit: productMetadata.trial_searches,
                    subscriptionPlan: productMetadata.name,
                },
            ),
        ];
        if (resetBalance) {
            promises.push(
                BalanceRepository.getRepository().resetBalance(
                    companyId,
                    BalanceType.PROFILE,
                    parseInt(productMetadata.profiles),
                    interval === 'annually' ? nextMonth : null,
                ) as Promise<any>,
            );
            promises.push(
                BalanceRepository.getRepository().resetBalance(
                    companyId,
                    BalanceType.SEARCH,
                    parseInt(productMetadata.searches),
                    interval === 'annually' ? nextMonth : null,
                ) as Promise<any>,
            );
            promises.push(
                BalanceRepository.getRepository().resetBalance(
                    companyId,
                    BalanceType.EXPORT,
                    EXPORT_CREDIT_MAX_TOTAL,
                    interval === 'annually' ? nextMonth : null,
                ) as Promise<any>,
            );
        }
        await Promise.all(promises);

        const [, trialSubscription] = await awaitToError(StripeService.getService().getTrialSubscription(cusId));
        if (trialSubscription) {
            await StripeService.getService().removeExistingInvoiceBySubscription(request.subscriptionId);
            await StripeService.getService().removeExistingInvoiceBySubscription(trialSubscription.id);
            await StripeService.getService().deleteSubscription(trialSubscription.id);
        }
        await awaitToError(this.cancelOtherSubscription(cusId, request.subscriptionId));
        await SequenceInfluencerRepository.getRepository().update(
            {
                company: { id: companyId },
                scheduleStatus: SequenceInfluencerScheduleStatus.INSUFICIENT_BALANCE,
            },
            {
                scheduleStatus: SequenceInfluencerScheduleStatus.PENDING,
            },
        );
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
        /**
         * only to make the trialing status to be active if it is want to be cancelled
         *
         * @note this logic refers to docs/paywall.md
         */
        let activeAt = subscription.activeAt;
        if (stripeSubscription.status === 'trialing' && !subscription.activeAt) {
            activeAt = new Date((stripeSubscription?.trial_start || 0) * 1000);
        }
        await SubscriptionRepository.getRepository().update(
            {
                id: subscription.id,
            },
            {
                subscriptionData: updatedSubscription,
                cancelledAt: new Date(stripeSubscription.current_period_end * 1000),
                activeAt,
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
        const subscription: Stripe.Response<Stripe.Subscription & { plan: Stripe.Plan }> =
            (await StripeService.getService().retrieveSubscription(subscriptionId)) as Stripe.Response<
                Stripe.Subscription & { plan: Stripe.Plan }
            >;

        const newSubscription = await this.createSubscription({
            priceId: subscription.items.data[0].price.id,
            quantity: subscription.items.data[0].quantity,
            coupon: foundCoupon.coupon.id,
        });
        await StripeService.getService().deleteSubscription(subscription.id);
        return { ...newSubscription, coupon: foundCoupon.coupon };
    }

    @CompanyIdRequired()
    @UseLogger()
    async resumeSubscription() {
        const companyId = RequestContext.getContext().companyId as string;
        const subscription = await SubscriptionRepository.getRepository().findOne({
            relations: ['company'],
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

        /**
         * @note this logic refers to docs/paywall.md
         */
        let activeAt = subscription.activeAt;
        let cancelledAt = subscription.cancelledAt;
        if (subscription.status === SubscriptionStatus.TRIAL_CANCELLED) {
            activeAt = null;
        } else {
            cancelledAt = null;
        }

        await Promise.all([
            SubscriptionRepository.getRepository().update(
                {
                    id: subscription.id,
                },
                {
                    subscriptionData: updatedSubscription,
                    cancelledAt,
                    activeAt,
                },
            ),
            SequenceInfluencerRepository.getRepository().update(
                {
                    company: { id: subscription.company.id },
                    scheduleStatus: SequenceInfluencerScheduleStatus.INSUFICIENT_BALANCE,
                },
                {
                    scheduleStatus: SequenceInfluencerScheduleStatus.PENDING,
                },
            ),
        ]);
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
                interval: StripeService.getService().getSubscriptionInterval(
                    stripeSubscription.items.data[0].plan.interval,
                ),
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
        await StripeService.getService().removeExistingInvoiceBySubscription(subscription.providerSubscriptionId);
        return {
            providerSubscriptionId: stripeSubscription.id,
        };
    }

    async getPrices() {
        const companyId = RequestContext.getContext().companyId as string;
        // check if company is loyal or we can say they are using old prices
        let loyalCompany = false;
        if (companyId) {
            [, loyalCompany] = await awaitToError(this.getLoyalCompany(companyId));
        }
        const prices = {
            discovery: [] as RelayPlanWithAnnual[],
            outreach: [] as RelayPlanWithAnnual[],
        };
        for (const key in prices) {
            const pricesData = await PriceRepository.getRepository().find({
                where: {
                    subscriptionType: key as SubscriptionType,
                    isActive: true,
                },
            });

            const grouped = pricesData.reduce((acc: any, item: PriceEntity) => {
                const {
                    currency,
                    profiles,
                    searches,
                    billingPeriod,
                    price,
                    originalPrice,
                    priceId,
                    forExistingUser,
                    priceIdsForExistingUser,
                } = item;
                if (!acc[currency]) {
                    acc[currency] = {
                        currency,
                        prices: { annually: null, monthly: null },
                        originalPrices: { annually: null, monthly: null },
                        profiles: profiles.toString(),
                        searches: searches.toString(),
                        priceIds: { annually: null, monthly: null },
                    };
                }
                acc[currency].prices[billingPeriod.toLowerCase()] = price;
                acc[currency].originalPrices[billingPeriod.toLowerCase()] = originalPrice;
                acc[currency].priceIds[billingPeriod.toLowerCase()] = priceId;
                if (loyalCompany) {
                    acc[currency].priceIdsForExistingUser = {
                        ...(acc[currency].priceIdsForExistingUser ?? {}),
                        [billingPeriod.toLowerCase()]: priceIdsForExistingUser,
                    };
                    acc[currency].forExistingUser = {
                        ...(acc[currency].forExistingUser ?? {}),
                        [billingPeriod.toLowerCase()]: forExistingUser,
                    };
                }
                return acc;
            }, {});
            // check if grouped prices are empty
            if (Object.keys(grouped).length === 0) {
                delete prices[key as keyof typeof prices];
                continue;
            }
            prices[key as keyof typeof prices] = grouped;
        }

        return prices;
    }

    @CompanyIdRequired()
    @UseLogger()
    async syncSubscription() {
        const companyId = RequestContext.getContext().companyId as string;
        const cusId = RequestContext.getContext().customerId as string;
        return this.syncSubscriptionProcess({ companyId, cusId });
    }

    async syncAllSubscriptions() {
        let companies = await CompanyRepository.getRepository().find({
            relations: { subscription: true },
        });
        const stripeSubscriptions = await StripeService.getService().getAllSubscriptions();
        companies = companies.filter((company) =>
            [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIAL].includes(
                company.subscription?.status as SubscriptionStatus,
            ),
        );
        const synced = [],
            notSynced = [];
        for (const company of companies) {
            if (
                stripeSubscriptions
                    .map((sub) => sub.id)
                    .includes(company.subscription?.providerSubscriptionId as string)
            ) {
                synced.push({ [company.cusId as string]: {} });
                continue;
            }
            notSynced.push({ [company.cusId as string]: {} });
            const [err] = await awaitToError(
                this.syncSubscriptionProcess({
                    companyId: company.id,
                    cusId: company.cusId as string,
                    useCusId: true,
                }),
            );
            if (!err) synced.push({ [company.cusId as string]: {} });
            else notSynced.push({ [company.cusId as string]: err });
        }
        return { synced, notSynced, syncedTotal: synced.length, notSyncedTotal: notSynced.length };
    }

    async getListOfAllSubscriptions(request: GetSubscriptionMigrationRequest) {
        const targetPriceId = request.targetPriceId?.split(',');
        let companies = await CompanyRepository.getRepository().find({
            relations: { subscription: true },
        });
        companies = companies.filter((company) =>
            [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIAL].includes(
                company.subscription?.status as SubscriptionStatus,
            ),
        );
        const stripeSubscriptions = await StripeService.getService().getAllSubscriptions();
        const unsynchedData: Record<string, any> = {},
            synchedData: Record<string, any> = {},
            unprocessedData: Record<string, any> = {};
        for (const company of companies) {
            if (
                !stripeSubscriptions
                    .map((sub) => sub.id)
                    .includes(company.subscription?.providerSubscriptionId as string)
            ) {
                const [, cus] = await awaitToError(
                    StripeService.getService().getCustomer(company.cusId as string, {
                        expand: ['subscriptions.data', 'subscriptions.data.plan'],
                    }) as Promise<Stripe.Customer & { subscriptions: Stripe.ApiList<Stripe.Subscription> }>,
                );
                if (cus && cus.subscriptions.data.length !== 0) {
                    stripeSubscriptions.push(cus.subscriptions.data[0]);
                } else {
                    // the company subscription is not synced
                    unprocessedData[company.cusId as string] = {};
                    continue;
                }
            }
            const subscription = stripeSubscriptions.find(
                (sub) => sub.id === company.subscription?.providerSubscriptionId,
            );
            if (targetPriceId?.includes(subscription?.items.data[0].price.id as string)) {
                synchedData[company.cusId as string] = {
                    priceId: subscription?.items.data[0].price.id,
                    priceAmount: (subscription?.items.data[0].price.unit_amount ?? 0) / 100,
                    currency: subscription?.currency,
                    interval: subscription?.items.data[0].plan.interval,
                    subscriptionId: subscription?.id,
                };
            } else {
                unsynchedData[company.cusId as string] = {
                    priceId: subscription?.items.data[0].price.id,
                    priceAmount: (subscription?.items.data[0].price.unit_amount ?? 0) / 100,
                    currency: subscription?.currency,
                    interval: subscription?.items.data[0].plan.interval,
                    subscriptionId: subscription?.id,
                };
            }
        }
        return {
            unsynchedData,
            totalUnsynched: Object.keys(unsynchedData).length,
            synchedData,
            totalSynched: Object.keys(synchedData).length,
            unprocessedData,
            totalUnprocessed: Object.keys(unprocessedData).length,
        };
    }

    async syncAllBalances(request: SyncBalanceRequest) {
        let companies = await CompanyRepository.getRepository().find({
            relations: { subscription: true },
        });
        companies = companies.filter((company) =>
            [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIAL].includes(
                company.subscription?.status as SubscriptionStatus,
            ),
        );
        const p = [];
        for (const company of companies) {
            p.push(
                this.fixBalance({
                    companyId: company.id,
                    priceId: request.targetPriceIds.cnyPriceId ?? request.targetPriceIds.usdPriceId,
                }),
            );
        }
        await Promise.all(p);
    }

    async migrateSubscription(request: SubscriptionMigrationRequest) {
        return; // this is dangerous and should be used carefully
        const isDryRun = request.isDryRun ?? true;

        // 0 - get all subscriptions
        const targetPriceIds = [request.targetPriceIds.cnyPriceId, request.targetPriceIds.usdPriceId];
        const customerSubscriptions = await this.getListOfAllSubscriptions({
            targetPriceId: targetPriceIds.join(','),
        });
        const customerSubscription = customerSubscriptions.unsynchedData[request.customerId as string];
        const customerCurrency = customerSubscription?.currency;
        const subscriptionId = customerSubscription.subscriptionId;

        if (targetPriceIds.includes(customerSubscription)) {
            return { message: 'customer already synced' };
        }

        // Step 1: Retrieve the current subscription
        const subscription = (await StripeService.client.subscriptions.retrieve(subscriptionId, {
            expand: ['plan', 'latest_invoice'],
        })) as Stripe.Subscription & { plan?: Stripe.Plan; latest_invoice?: Stripe.Invoice };

        const newPriceId =
            customerCurrency === 'cny' ? request.targetPriceIds.cnyPriceId : request.targetPriceIds.usdPriceId;

        // Step 2: Calculate the upcoming invoice with the new plan
        const upcomingInvoice = await StripeService.client.invoices.retrieveUpcoming({
            customer: request.customerId,
            subscription: customerSubscription.subscriptionId,
            subscription_cancel_now: true,
        });

        // Prorated refund amount is based on the difference in the upcoming invoice's total and the amount already paid
        const mustRefundAmount = Math.abs((upcomingInvoice.total ?? 0) / 100);
        const proratedAmount =
            subscription.current_period_end > Date.now() / 1000
                ? (subscription.plan?.amount ?? 0) / 100 - mustRefundAmount
                : 0;

        if (isDryRun) {
            return {
                message: 'Refunded successfully',
                mustRefundAmount: +(mustRefundAmount * 100).toFixed(),
                proratedAmount: +(proratedAmount * 100).toFixed(),
                newPriceId,
                currency: customerCurrency,
            };
        }

        // Step 3: Update the subscription to the cheaper plan
        return StripeService.getService().updateSubscription(subscriptionId, {
            items: [
                {
                    id: subscription.items.data[0].id,
                    price: newPriceId,
                },
            ],
            proration_behavior: 'always_invoice',
            expand: ['latest_invoice.payment_intent'],
            off_session: true,
        });

        return {
            message: 'Refunded successfully',
            mustRefundAmount: +(mustRefundAmount * 100).toFixed(),
            proratedAmount: +(proratedAmount * 100).toFixed(),
            newPriceId,
            currency: customerCurrency,
        };
    }

    private async getLoyalCompany(companyId: string) {
        let loyalCompany = false;
        const [, existingCompany] = await awaitToError(CompanyRepository.getRepository().getCompanyById(companyId));
        if (existingCompany?.createdAt.getTime() < parseInt(PRICE_UPDATE_DATE + '000')) {
            loyalCompany = true;
        }
        return loyalCompany;
    }

    private async cancelOtherSubscription(cusId: string, subscriptionId: string) {
        const subs = await StripeService.getService().getSubscriptionsByStatus(cusId);
        const nonActiveSubs = subs.filter((sub) => sub.id !== subscriptionId);
        for (const sub of nonActiveSubs) {
            await awaitToError(StripeService.getService().cancelSubscriptionBySubsId(sub.id));
        }
    }

    private async fixBalance({ companyId, priceId }: { priceId: string; companyId: string }) {
        const price = await PriceRepository.getRepository().findOne({
            where: {
                priceId,
            },
        });

        await Promise.all([
            BalanceRepository.getRepository().delete({
                company: {
                    id: companyId,
                },
            }),
            CompanyRepository.getRepository().update(
                {
                    id: companyId,
                },
                {
                    profilesLimit: price?.profiles + '',
                    searchesLimit: price?.searches + '',
                },
            ),
        ]);
        await BalanceService.getService().initBalance({ companyId });
    }

    private async syncSubscriptionProcess({
        companyId,
        cusId,
        useCusId,
    }: {
        companyId: string;
        cusId: string;
        useCusId?: boolean;
    }) {
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
        return this.storeSubscription({
            companyId,
            cusId,
            request: { subscriptionId: subscription.providerSubscriptionId },
            resetBalance: false,
            useCusId,
        });
    }
}

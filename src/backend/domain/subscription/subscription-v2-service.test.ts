import SubscriptionRepository from 'src/backend/database/subcription/subscription-repository';
import StripeService from 'src/backend/integration/stripe/stripe-service';
import awaitToError from 'src/utils/await-to-error';
import { RequestContext } from 'src/utils/request-context/request-context';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import SubscriptionV2Service from './subscription-v2-service';
import CompanyRepository from 'src/backend/database/company/company-repository';
import { UnprocessableEntityError } from 'src/utils/error/http-error';
import { NotFoundError } from 'src/utils/error/http-error';
import { type SubscriptionEntity } from 'src/backend/database/subcription/subscription-entity';
import type Stripe from 'stripe';
import SequenceInfluencerRepository from 'src/backend/database/sequence/sequence-influencer-repository';
import PriceRepository from 'src/backend/database/price/price-repository';
import type { PriceEntity } from 'src/backend/database/price/price-entity';
import BalanceRepository from 'src/backend/database/balance/balance-repository';
import { type CompanyEntity } from 'src/backend/database/company/company-entity';
vi.mock('src/backend/database/provider/transaction-decorator', () => ({
    UseTransaction: (): MethodDecorator => (_target, _key, _descriptor: PropertyDescriptor) => {
        // do nothing
    },
}));
describe(`src/backend/domain/subscription/subscription-v2-service.test.ts`, async () => {
    const StripeCreateSubscriptionMock = vi.fn();
    const SubscriptionRepositoryFindOneMock = vi.fn();
    const StripeGetPaymentIntentMock = vi.fn();
    const StripeRetrieveSubscriptionMock = vi.fn();
    const StripeGetTrialSubscriptionMock = vi.fn();
    const StripeGetIncompleteSubscriptionMock = vi.fn();
    const StripeGetProductMock = vi.fn();
    const StripeGetLastSubscriptionMock = vi.fn();
    const StripeGetPriceMock = vi.fn();
    const StripeUpdateSubscriptionMock = vi.fn();
    const StripeDeleteSubscriptionMock = vi.fn();
    const StripeGetProductMetadataMock = vi.fn();
    const StripeGetAvailablePromoMock = vi.fn();
    const StripeRemoveExistingInvoiceBySubscriptionMock = vi.fn();
    const SubscriptionRepositoryUpsertMock = vi.fn();
    const SubscriptionRepositoryDeleteMock = vi.fn();
    const CancelSubscriptionMock = vi.fn();
    const CompanyRepositoryUpdateMock = vi.fn();
    const CompanyRepositoryGetOneMock = vi.fn();
    const SequenceInfluencerRepositoryUpdateMock = vi.fn();
    const PriceRepositoryFindOneMock = vi.fn();
    const BalanceRepositoryResetBalance = vi.fn().mockResolvedValueOnce({});
    BalanceRepository.prototype.resetBalance = BalanceRepositoryResetBalance;

    SubscriptionRepository.prototype.findOne = SubscriptionRepositoryFindOneMock;
    StripeService.client.subscriptions.create = StripeCreateSubscriptionMock;
    StripeService.getService().getPaymentIntent = StripeGetPaymentIntentMock;
    StripeService.getService().retrieveSubscription = StripeRetrieveSubscriptionMock;
    StripeService.getService().getTrialSubscription = StripeGetTrialSubscriptionMock;
    StripeService.getService().getIncompleteSubscription = StripeGetIncompleteSubscriptionMock;
    StripeService.getService().getProduct = StripeGetProductMock;
    StripeService.getService().updateSubscription = StripeUpdateSubscriptionMock;
    StripeService.getService().deleteSubscription = StripeDeleteSubscriptionMock;
    StripeService.getService().cancelSubscription = CancelSubscriptionMock;
    StripeService.getService().retrieveSubscription = StripeGetLastSubscriptionMock;
    StripeService.getService().getPrice = StripeGetPriceMock;
    StripeService.getService().getProductMetadata = StripeGetProductMetadataMock;
    StripeService.getService().getAvailablePromo = StripeGetAvailablePromoMock;
    StripeService.getService().getCustomer = vi.fn().mockResolvedValue({
        metadata: {},
    });
    StripeService.getService().removeExistingInvoiceBySubscription = StripeRemoveExistingInvoiceBySubscriptionMock;
    SubscriptionRepository.getRepository().upsert = SubscriptionRepositoryUpsertMock;
    SubscriptionRepository.getRepository().delete = SubscriptionRepositoryDeleteMock;
    CompanyRepository.getRepository().update = CompanyRepositoryUpdateMock;
    CompanyRepository.getRepository().findOne = CompanyRepositoryGetOneMock;
    SequenceInfluencerRepository.getRepository().update = SequenceInfluencerRepositoryUpdateMock;
    PriceRepository.getRepository().findOne = PriceRepositoryFindOneMock;
    describe(`SubscriptionV2Service`, () => {
        beforeEach(() => {
            vi.resetAllMocks();
            const getContextMock = vi.fn();
            RequestContext.getContext = getContextMock;
            RequestContext.setContext = vi.fn().mockReturnValue(undefined);
            getContextMock.mockReturnValue({
                customerId: 'cus_1',
                companyId: 'company_1',
                request: {
                    headers: {
                        ['x-forwarded-for']: 'https://app.example.com',
                        ['user-agent']: 'someAgent',
                    },
                },
            });
            SequenceInfluencerRepositoryUpdateMock.mockResolvedValue({});
        });

        describe(`createSubscription`, () => {
            beforeEach(() => {
                StripeCreateSubscriptionMock.mockReturnValue({
                    id: 'sub_1',
                    latest_invoice: {
                        payment_intent: {
                            client_secret: 'some-secret',
                        },
                    },
                });
                SubscriptionRepositoryFindOneMock.mockReturnValue(null);
            });
            it(`should throw bad request error when price id is already subscribed`, async () => {
                SubscriptionRepositoryFindOneMock.mockResolvedValue({
                    subscriptionData: {
                        items: {
                            data: [{ price: { id: 'price_1' } }],
                        },
                    },
                    status: 'ACTIVE',
                });
                const [err] = await awaitToError(
                    SubscriptionV2Service.getService().createSubscription({
                        priceId: 'price_1',
                        quantity: 1,
                    }),
                );
                expect(err).not.toBeNull();
                expect(err.message).toBe('You are already subscribed to this plan');
                expect(StripeCreateSubscriptionMock).not.toHaveBeenCalled();
                expect(SubscriptionRepositoryFindOneMock).toHaveBeenCalledTimes(1);
            });
            it(`should success when request is valid`, async () => {
                SubscriptionRepositoryFindOneMock.mockResolvedValue({
                    subscriptionData: {
                        items: {
                            data: [{ price: { id: 'price_2' } }],
                        },
                    },
                });
                const result = await SubscriptionV2Service.getService().createSubscription({
                    priceId: 'price_1',
                    quantity: 1,
                });
                expect(StripeCreateSubscriptionMock).toBeCalledTimes(1);
                expect(SubscriptionRepositoryFindOneMock).toHaveBeenCalledTimes(1);
                expect(result.clientSecret).toBe('some-secret');
                expect(result.providerSubscriptionId).toBe('sub_1');
            });
        });

        describe(`postConfirmation`, () => {
            beforeEach(() => {
                StripeGetPaymentIntentMock.mockResolvedValue({
                    payment_method: 'pm_1',
                });
                StripeGetTrialSubscriptionMock.mockResolvedValue({
                    id: 'trial_sub_1',
                    items: {
                        data: [
                            {
                                quantity: 1,
                                price: {
                                    unit_amount: 100,
                                    product: 'prod_1',
                                },
                            },
                        ],
                    },
                });
                StripeRetrieveSubscriptionMock.mockResolvedValue({
                    id: 'new_sub_1',
                    items: {
                        data: [
                            {
                                quantity: 1,
                                price: {
                                    unit_amount: 100,
                                    product: 'prod_1',
                                },
                                plan: {
                                    id: 'plan_1',
                                },
                            },
                        ],
                    },
                    status: 'active',
                });
                StripeGetProductMock.mockResolvedValue({
                    name: 'some-product',
                    metadata: {
                        searches: '100000000',
                        profiles: '100000000',
                        ai_emails: '100000000',
                    },
                });
                StripeGetLastSubscriptionMock.mockResolvedValue({
                    id: 'new_sub_1',
                    items: {
                        data: [
                            {
                                price: {
                                    id: 'price_1',
                                    unit_amount: 100,
                                },
                                quantity: 1,
                                plan: {
                                    id: 'plan_1',
                                    interval: 'month',
                                },
                            },
                        ],
                    },
                    discount: {
                        coupon: {
                            id: 'mock-coupon-id',
                            amount_off: 200,
                        },
                    },
                    payment_settings: {
                        payment_method_types: ['card'],
                    },
                    default_payment_method: 'card',
                    current_period_start: 1710133391,
                    current_period_end: 1712811791,
                    status: 'active',
                });
                StripeGetProductMetadataMock.mockResolvedValue({
                    name: 'Outreach',
                    searches: '100000000',
                    profiles: '100000000',
                    ai_emails: '100000000',
                    trial_searches: '100000000',
                    trial_profiles: '100000000',
                    trial_ai_emails: '100000000',
                });
                StripeGetPriceMock.mockResolvedValue({
                    product: 'prod_1',
                });
                CancelSubscriptionMock.mockResolvedValue(undefined);
                CompanyRepositoryGetOneMock.mockResolvedValue({
                    id: 'company_1',
                });
                PriceRepositoryFindOneMock.mockResolvedValue({
                    id: 'price_1',
                    subscriptionType: 'discovery',
                    currency: 'usd',
                    billingPeriod: 'MONTHLY',
                    price: '100',
                    originalPrice: null,
                    profiles: 200,
                    searches: 900,
                    priceId: 'price_1',
                    createdAt: '2024-06-05T01:07:09.207Z',
                    updatedAt: '2024-06-05T01:07:09.207Z',
                });
            });

            it(`should update subscription and company, and insert new subscription when redirectStatus is success`, async () => {
                await SubscriptionV2Service.getService().postConfirmation({
                    redirectStatus: 'succeeded',
                    paymentIntentId: 'pi_1',
                    paymentIntentSecret: 'some-secret',
                    subscriptionId: 'trial_sub_1',
                });
                expect(StripeService.getService().updateSubscription).toHaveBeenCalledWith('trial_sub_1', {
                    default_payment_method: 'pm_1',
                });
                expect(SubscriptionRepository.getRepository().upsert).toHaveBeenCalledWith(
                    {
                        company: {
                            id: 'company_1',
                        },
                        provider: 'stripe',
                        providerSubscriptionId: 'new_sub_1',
                        paymentMethod: 'card',
                        quantity: 1,
                        price: 1,
                        total: 1,
                        subscriptionData: {
                            id: 'new_sub_1',
                            default_payment_method: 'card',
                            discount: {
                                coupon: {
                                    amount_off: 200,
                                    id: 'mock-coupon-id',
                                },
                            },
                            items: {
                                data: [
                                    {
                                        quantity: 1,
                                        price: {
                                            unit_amount: 100,
                                            id: 'price_1',
                                        },
                                        plan: {
                                            id: 'plan_1',
                                            interval: 'month',
                                        },
                                    },
                                ],
                            },
                            payment_settings: {
                                payment_method_types: ['card'],
                            },
                            status: 'active',
                            current_period_end: 1712811791,
                            current_period_start: 1710133391,
                        },
                        interval: 'monthly',
                        discount: 200,
                        coupon: 'mock-coupon-id',
                        activeAt: new Date(1710133391 * 1000),
                        pausedAt: new Date(1712811791 * 1000),
                        cancelledAt: null,
                    },
                    {
                        conflictPaths: ['company'],
                    },
                );
                expect(CompanyRepository.getRepository().update).toHaveBeenCalledWith(
                    {
                        id: 'company_1',
                    },
                    {
                        subscriptionStatus: 'active',
                        profilesLimit: '200',
                        searchesLimit: '900',
                        subscriptionPlan: 'Outreach',
                        trialProfilesLimit: '100000000',
                        trialSearchesLimit: '100000000',
                    },
                );
            });

            it(`should cancel subscription and throw UnprocessableEntityError when redirectStatus is not success`, async () => {
                const [err] = await awaitToError(
                    SubscriptionV2Service.getService().postConfirmation({
                        redirectStatus: 'failure',
                        paymentIntentId: 'pi_1',
                        paymentIntentSecret: 'some-secret',
                        subscriptionId: 'trial_sub_1',
                    }),
                );
                expect(err).not.toBeNull();
                expect(err).toBeInstanceOf(UnprocessableEntityError);
                expect(StripeService.getService().cancelSubscription).toHaveBeenCalledWith('cus_1');
            });
        });

        describe(`getSubscription`, () => {
            it(`should return subscription from stripe`, async () => {
                const stripeSubscription = {
                    subscriptionData: {
                        items: {
                            data: [
                                {
                                    status: 'active',
                                },
                            ],
                        },
                    },
                    status: 'ACTIVE',
                };
                SubscriptionRepositoryFindOneMock.mockResolvedValue(stripeSubscription);
                StripeService.client.subscriptions.list = vi.fn().mockResolvedValue(stripeSubscription);

                const result = await SubscriptionV2Service.getService().getSubscription();
                expect((result as any).subscriptionData).toBe(stripeSubscription.subscriptionData);
                expect((result as any).status).toBe('ACTIVE');
            });
            it(`should return subscription from database`, async () => {
                const subscriptionData = {
                    subscriptionData: {
                        items: {
                            data: [{ price: { id: 'price_1' } }],
                        },
                    },
                    status: 'ACTIVE',
                };
                SubscriptionRepositoryFindOneMock.mockResolvedValue(subscriptionData);
                const result = await SubscriptionV2Service.getService().getSubscription();
                expect((result as any).subscriptionData).toBe(subscriptionData.subscriptionData);
                expect((result as any).status).toBe('ACTIVE');
            });
        });

        describe(`cancelSubscription`, () => {
            it(`should update the stripe subscription to cancel at the end of period`, async () => {
                const findOneMock = vi.spyOn(SubscriptionRepository.getRepository(), 'findOne');
                findOneMock.mockResolvedValue({
                    id: 'sub_1',
                    company: {
                        id: 'company_1',
                    },
                    providerSubscriptionId: 'sub_1',
                } as SubscriptionEntity);

                const retrieveSubscriptionMock = vi.spyOn(StripeService.getService(), 'retrieveSubscription');
                retrieveSubscriptionMock.mockResolvedValue({
                    lastResponse: {
                        statusCode: 200,
                        headers: {},
                        requestId: 'req_1',
                    },
                    id: 'sub_1',
                    customer: 'cus_1',
                    current_period_end: 1712811791,
                } as Stripe.Response<Stripe.Subscription>);

                const updateMock = vi.spyOn(SubscriptionRepository.getRepository(), 'update');
                updateMock.mockResolvedValue({
                    raw: [],
                    affected: 1,
                    generatedMaps: [],
                });

                const update = vi.spyOn(StripeService.getService(), 'updateSubscription');
                update.mockResolvedValue({
                    lastResponse: {
                        statusCode: 200,
                        headers: {},
                        requestId: 'req_1',
                    },
                    id: 'sub_1',
                } as Stripe.Response<Stripe.Subscription>);

                await SubscriptionV2Service.getService().cancelSubscription();
                expect(findOneMock).toHaveBeenCalledWith({
                    where: {
                        company: {
                            id: 'company_1',
                        },
                    },
                });
                expect(retrieveSubscriptionMock).toHaveBeenCalledWith('sub_1');
                expect(updateMock).toHaveBeenCalledWith(
                    {
                        id: 'sub_1',
                    },
                    {
                        subscriptionData: {
                            lastResponse: {
                                statusCode: 200,
                                headers: {},
                                requestId: 'req_1',
                            },
                            id: 'sub_1',
                        },
                        cancelledAt: new Date(1712811791 * 1000),
                    },
                );
                expect(update).toHaveBeenCalledWith('sub_1', {
                    cancel_at_period_end: true,
                });
            });
            it(`should throw NotFoundError when no subscription found`, async () => {
                const findOneMock = vi.spyOn(SubscriptionRepository.getRepository(), 'findOne');
                findOneMock.mockResolvedValue(null);
                const [err] = await awaitToError(SubscriptionV2Service.getService().cancelSubscription());
                expect(err).not.toBeNull();
                expect(err).toBeInstanceOf(NotFoundError);
                expect(err.message).toBe('No subscription found');
            });
        });

        describe(`resumeSubscription`, () => {
            it(`should update the stripe subscription not to cancel at the end of period`, async () => {
                SequenceInfluencerRepositoryUpdateMock.mockResolvedValue({});
                const findOneMock = vi.spyOn(SubscriptionRepository.getRepository(), 'findOne');
                findOneMock.mockResolvedValue({
                    id: 'sub_1',
                    company: {
                        id: 'company_1',
                    },
                    providerSubscriptionId: 'sub_1',
                } as SubscriptionEntity);

                const updateMock = vi.spyOn(SubscriptionRepository.getRepository(), 'update');
                updateMock.mockResolvedValue({
                    raw: [],
                    affected: 1,
                    generatedMaps: [],
                });

                const update = vi.spyOn(StripeService.getService(), 'updateSubscription');
                update.mockResolvedValue({
                    lastResponse: {
                        statusCode: 200,
                        headers: {},
                        requestId: 'req_1',
                    },
                    id: 'sub_1',
                } as Stripe.Response<Stripe.Subscription>);

                await SubscriptionV2Service.getService().resumeSubscription();
                expect(findOneMock).toHaveBeenCalledWith({
                    relations: ['company'],
                    where: {
                        company: {
                            id: 'company_1',
                        },
                    },
                });
                expect(updateMock).toHaveBeenCalledWith(
                    {
                        id: 'sub_1',
                    },
                    {
                        subscriptionData: {
                            lastResponse: {
                                statusCode: 200,
                                headers: {},
                                requestId: 'req_1',
                            },
                            id: 'sub_1',
                        },
                        cancelledAt: null,
                    },
                );
                expect(update).toHaveBeenCalledWith('sub_1', {
                    cancel_at_period_end: false,
                });
            });
            it(`should throw NotFoundError when no subscription found`, async () => {
                const findOneMock = vi.spyOn(SubscriptionRepository.getRepository(), 'findOne');
                findOneMock.mockResolvedValue(null);
                const [err] = await awaitToError(SubscriptionV2Service.getService().cancelSubscription());
                expect(err).not.toBeNull();
                expect(err).toBeInstanceOf(NotFoundError);
                expect(err.message).toBe('No subscription found');
            });
        });

        describe(`applyPromo`, () => {
            it(`should return coupon data`, async () => {
                const getAvailablePromo = vi.spyOn(StripeService.getService(), 'getAvailablePromo');
                getAvailablePromo.mockResolvedValue({
                    data: [
                        {
                            code: '123',
                            coupon: {
                                id: 'coupon_1',
                            },
                        },
                        {
                            code: '456',
                            coupon: {
                                id: 'coupon_2',
                            },
                        },
                    ],
                } as Stripe.Response<Stripe.ApiList<Stripe.PromotionCode>>);
                const retrieveSubscription = vi.spyOn(StripeService.getService(), 'retrieveSubscription');
                retrieveSubscription.mockResolvedValue({
                    lastResponse: {
                        statusCode: 200,
                        headers: {},
                        requestId: 'req_1',
                    },
                    id: 'sub_1',
                    customer: 'cus_1',
                    current_period_end: 1712811791,
                    items: {
                        data: [
                            {
                                price: {
                                    id: 'price_1',
                                    unit_amount: 100,
                                },
                                quantity: 1,
                            },
                        ],
                    },
                } as Stripe.Response<Stripe.Subscription>);

                const createSubscription = vi.spyOn(SubscriptionV2Service.getService(), 'createSubscription');
                createSubscription.mockResolvedValue({
                    clientSecret: 'some secret',
                    providerSubscriptionId: 'sub_1',
                    coupon: null,
                });

                const deleteSubscription = vi.spyOn(StripeService.getService(), 'deleteSubscription');
                deleteSubscription.mockResolvedValue({
                    lastResponse: {
                        statusCode: 200,
                        headers: {},
                        requestId: 'req_1',
                    },
                    id: 'sub_1',
                    customer: 'cus_1',
                    current_period_end: 1712811791,
                } as Stripe.Response<Stripe.Subscription>);

                const result = await SubscriptionV2Service.getService().applyPromo('sub_1', {
                    coupon: '123',
                });
                expect(result.coupon.id).toBe('coupon_1');
            });
            it(`should return subsription not found`, async () => {
                const getAvailablePromo = vi.spyOn(StripeService.getService(), 'getAvailablePromo');
                getAvailablePromo.mockResolvedValue({
                    data: [
                        {
                            code: '123',
                            coupon: {
                                id: 'coupon_1',
                            },
                        },
                        {
                            code: '456',
                            coupon: {
                                id: 'coupon_2',
                            },
                        },
                    ],
                } as Stripe.Response<Stripe.ApiList<Stripe.PromotionCode>>);
                const retrieveSubscription = vi.spyOn(StripeService.getService(), 'retrieveSubscription');
                retrieveSubscription.mockRejectedValue(new NotFoundError('subscription not found'));

                const [err] = await awaitToError(
                    SubscriptionV2Service.getService().applyPromo('sub_xx', {
                        coupon: '123',
                    }),
                );
                expect(err).toBeInstanceOf(NotFoundError);
                expect(err.message).toBe('subscription not found');
            });
            it(`should return invalid promo code`, async () => {
                const getAvailablePromo = vi.spyOn(StripeService.getService(), 'getAvailablePromo');
                getAvailablePromo.mockResolvedValue({
                    data: [
                        {
                            code: '123',
                            coupon: {
                                id: 'coupon_1',
                            },
                        },
                        {
                            code: '456',
                            coupon: {
                                id: 'coupon_2',
                            },
                        },
                    ],
                } as Stripe.Response<Stripe.ApiList<Stripe.PromotionCode>>);
                const updateSubscription = vi.spyOn(StripeService.getService(), 'updateSubscription');
                updateSubscription.mockResolvedValue({} as Stripe.Response<Stripe.Subscription>);

                const [err] = await awaitToError(
                    SubscriptionV2Service.getService().applyPromo('sub_xx', {
                        coupon: '789',
                    }),
                );
                expect(err).toBeInstanceOf(UnprocessableEntityError);
                expect(err.message).toBe('Invalid promo code');
            });
        });

        describe(`changeSubscription`, () => {
            it(`should success if request is valid`, async () => {
                const findOneMock = vi.spyOn(SubscriptionRepository.getRepository(), 'findOne');
                findOneMock.mockResolvedValue({
                    id: 'sub_1',
                    company: {
                        id: 'company_1',
                    },
                    providerSubscriptionId: 'sub_1',
                } as SubscriptionEntity);

                const retrieveSubscriptionMock = vi.spyOn(StripeService.getService(), 'retrieveSubscription');
                retrieveSubscriptionMock.mockResolvedValue({
                    lastResponse: {
                        statusCode: 200,
                        headers: {},
                        requestId: 'req_1',
                    },
                    id: 'sub_1',
                    customer: 'cus_1',
                    current_period_end: 1712811791,
                } as Stripe.Response<Stripe.Subscription>);

                const changeSubscriptionMock = vi.spyOn(StripeService.getService(), 'changeSubscription');
                changeSubscriptionMock.mockResolvedValue({
                    id: 'sub_1',
                    items: {
                        data: [
                            {
                                price: {
                                    id: 'price_1',
                                    unit_amount: 100,
                                },
                                plan: {
                                    id: 'plan_1',
                                    interval: 'month',
                                },
                                quantity: 1,
                            },
                        ],
                    },
                    current_period_start: 1710133391,
                    current_period_end: 1712811791,
                    latest_invoice: {
                        payment_intent: {},
                    },
                } as Stripe.Response<Stripe.Subscription>);

                StripeGetProductMetadataMock.mockResolvedValue({
                    name: 'Outreach',
                    searches: '100000000',
                    profiles: '100000000',
                    ai_emails: '100000000',
                    trial_searches: '100000000',
                    trial_profiles: '100000000',
                    trial_ai_emails: '100000000',
                });

                const updateMock = vi.spyOn(SubscriptionRepository.getRepository(), 'update');
                updateMock.mockResolvedValue({
                    raw: [],
                    affected: 1,
                    generatedMaps: [],
                });

                const result = await SubscriptionV2Service.getService().changeSubscription({
                    priceId: 'price_1',
                    quantity: 1,
                });
                expect(result.providerSubscriptionId).toBe('sub_1');
                expect(findOneMock).toHaveBeenCalledWith({
                    where: {
                        company: {
                            id: 'company_1',
                        },
                    },
                });
                expect(updateMock).toHaveBeenCalledWith(
                    {
                        id: 'sub_1',
                    },
                    {
                        quantity: 1,
                        price: 100,
                        total: 100,
                        subscriptionData: {
                            id: 'sub_1',
                            items: {
                                data: [
                                    {
                                        price: { id: 'price_1', unit_amount: 100 },
                                        plan: { id: 'plan_1', interval: 'month' },
                                        quantity: 1,
                                    },
                                ],
                            },
                            current_period_start: 1710133391,
                            current_period_end: 1712811791,
                            latest_invoice: { payment_intent: {} },
                        },
                        interval: 'monthly',
                        activeAt: new Date(1710133391 * 1000),
                        pausedAt: new Date(1712811791 * 1000),
                    },
                );
                expect(changeSubscriptionMock).toHaveBeenCalledWith('sub_1', {
                    priceId: 'price_1',
                    quantity: 1,
                });
            });
            it(`should throw NotFoundError when no subscription found`, async () => {
                const findOneMock = vi.spyOn(SubscriptionRepository.getRepository(), 'findOne');
                findOneMock.mockResolvedValue(null);
                const [err] = await awaitToError(SubscriptionV2Service.getService().cancelSubscription());
                expect(err).not.toBeNull();
                expect(err).toBeInstanceOf(NotFoundError);
                expect(err.message).toBe('No subscription found');
            });
        });

        describe('getPrices', () => {
            it('should return prices grouped by subscription type and billing period', async () => {
                // Arrange
                const pricesData = [
                    {
                        id: '4b160650-9aaa-417e-8adc-54733af3e1ff',
                        subscriptionType: 'discovery',
                        currency: 'cny',
                        billingPeriod: 'ANNUALLY',
                        price: '9536.00',
                        originalPrice: '11220.00',
                        profiles: 200,
                        searches: 900,
                        priceId: 'price_1PNV3qF5PN4woVWoY0u5MOi8',
                        createdAt: '2024-06-05T01:07:09.203Z',
                        updatedAt: '2024-06-05T01:07:09.203Z',
                    },
                    {
                        id: 'd4fc4ba4-30a7-4852-941f-dd0a877f0fab',
                        subscriptionType: 'discovery',
                        currency: 'cny',
                        billingPeriod: 'MONTHLY',
                        price: '935.00',
                        originalPrice: null,
                        profiles: 200,
                        searches: 900,
                        priceId: 'price_1PNV3SF5PN4woVWo02EnOZiX',
                        createdAt: '2024-06-05T01:07:09.207Z',
                        updatedAt: '2024-06-05T01:07:09.207Z',
                    },
                    {
                        id: '9e1e8649-e0b7-4510-bd0d-9621fb6de325',
                        subscriptionType: 'discovery',
                        currency: 'usd',
                        billingPeriod: 'ANNUALLY',
                        price: '1316.00',
                        originalPrice: '1548.00',
                        profiles: 200,
                        searches: 900,
                        priceId: 'price_1PNUz3F5PN4woVWog9Ds2Xi8',
                        createdAt: '2024-06-05T01:07:09.209Z',
                        updatedAt: '2024-06-05T01:07:09.209Z',
                    },
                    {
                        id: '4d6d7672-4b28-423e-ad22-7006e3f13302',
                        subscriptionType: 'discovery',
                        currency: 'usd',
                        billingPeriod: 'MONTHLY',
                        price: '129.00',
                        originalPrice: null,
                        profiles: 200,
                        searches: 900,
                        priceId: 'price_1PNUyXF5PN4woVWoC8VMxxqE',
                        createdAt: '2024-06-05T01:07:09.212Z',
                        updatedAt: '2024-06-05T01:07:09.212Z',
                    },
                ];
                const expectedPrices = {
                    discovery: {
                        cny: {
                            currency: 'cny',
                            prices: { annually: '9536.00', monthly: '935.00' },
                            originalPrices: { annually: '11220.00', monthly: null },
                            profiles: '200',
                            searches: '900',
                            priceIds: {
                                annually: 'price_1PNV3qF5PN4woVWoY0u5MOi8',
                                monthly: 'price_1PNV3SF5PN4woVWo02EnOZiX',
                            },
                        },
                        usd: {
                            currency: 'usd',
                            prices: { annually: '1316.00', monthly: '129.00' },
                            originalPrices: { annually: '1548.00', monthly: null },
                            profiles: '200',
                            searches: '900',
                            priceIds: {
                                annually: 'price_1PNUz3F5PN4woVWog9Ds2Xi8',
                                monthly: 'price_1PNUyXF5PN4woVWoC8VMxxqE',
                            },
                        },
                    },
                    outreach: {
                        cny: {
                            currency: 'cny',
                            prices: { annually: '9536.00', monthly: '935.00' },
                            originalPrices: { annually: '11220.00', monthly: null },
                            profiles: '200',
                            searches: '900',
                            priceIds: {
                                annually: 'price_1PNV3qF5PN4woVWoY0u5MOi8',
                                monthly: 'price_1PNV3SF5PN4woVWo02EnOZiX',
                            },
                        },
                        usd: {
                            currency: 'usd',
                            prices: { annually: '1316.00', monthly: '129.00' },
                            originalPrices: { annually: '1548.00', monthly: null },
                            profiles: '200',
                            searches: '900',
                            priceIds: {
                                annually: 'price_1PNUz3F5PN4woVWog9Ds2Xi8',
                                monthly: 'price_1PNUyXF5PN4woVWoC8VMxxqE',
                            },
                        },
                    },
                };

                const getCompanyByIdMock = vi.spyOn(CompanyRepository.getRepository(), 'getCompanyById');
                getCompanyByIdMock.mockRejectedValue(new NotFoundError('Company not found'));

                const findPriceMock = vi.spyOn(PriceRepository.getRepository(), 'find');
                findPriceMock.mockResolvedValue(pricesData as unknown as PriceEntity[]);

                // Act
                const result = await SubscriptionV2Service.getService().getPrices();

                // Assert
                expect(result).toStrictEqual(expectedPrices);
            });
            it('should return prices grouped by subscription type and billing period for existing user', async () => {
                // Arrange
                const pricesData = [
                    {
                        id: '4b160650-9aaa-417e-8adc-54733af3e1ff',
                        subscriptionType: 'discovery',
                        currency: 'cny',
                        billingPeriod: 'ANNUALLY',
                        price: '9536.00',
                        originalPrice: '11220.00',
                        profiles: 200,
                        searches: 900,
                        priceId: 'price_1PNV3qF5PN4woVWoY0u5MOi8',
                        forExistingUser: '9000.00',
                        priceIdsForExistingUser: 'price_1PNV3qF5PN4woVWoY0u5MOi8_user',
                        createdAt: '2024-06-05T01:07:09.203Z',
                        updatedAt: '2024-06-05T01:07:09.203Z',
                    },
                    {
                        id: 'd4fc4ba4-30a7-4852-941f-dd0a877f0fab',
                        subscriptionType: 'discovery',
                        currency: 'cny',
                        billingPeriod: 'MONTHLY',
                        price: '935.00',
                        originalPrice: null,
                        profiles: 200,
                        searches: 900,
                        priceId: 'price_1PNV3SF5PN4woVWo02EnOZiX',
                        forExistingUser: '900.00',
                        priceIdsForExistingUser: 'price_1PNV3SF5PN4woVWo02EnOZiX_user',
                        createdAt: '2024-06-05T01:07:09.207Z',
                        updatedAt: '2024-06-05T01:07:09.207Z',
                    },
                    {
                        id: '9e1e8649-e0b7-4510-bd0d-9621fb6de325',
                        subscriptionType: 'discovery',
                        currency: 'usd',
                        billingPeriod: 'ANNUALLY',
                        price: '1316.00',
                        originalPrice: '1548.00',
                        profiles: 200,
                        searches: 900,
                        priceId: 'price_1PNUz3F5PN4woVWog9Ds2Xi8',
                        forExistingUser: '1300.00',
                        priceIdsForExistingUser: 'price_1PNUz3F5PN4woVWog9Ds2Xi8_user',
                        createdAt: '2024-06-05T01:07:09.209Z',
                        updatedAt: '2024-06-05T01:07:09.209Z',
                    },
                    {
                        id: '4d6d7672-4b28-423e-ad22-7006e3f13302',
                        subscriptionType: 'discovery',
                        currency: 'usd',
                        billingPeriod: 'MONTHLY',
                        price: '129.00',
                        originalPrice: null,
                        profiles: 200,
                        searches: 900,
                        priceId: 'price_1PNUyXF5PN4woVWoC8VMxxqE',
                        forExistingUser: '120.00',
                        priceIdsForExistingUser: 'price_1PNUyXF5PN4woVWoC8VMxxqE_user',
                        createdAt: '2024-06-05T01:07:09.212Z',
                        updatedAt: '2024-06-05T01:07:09.212Z',
                    },
                ];
                const expectedPrices = {
                    discovery: {
                        cny: {
                            currency: 'cny',
                            prices: { annually: '9536.00', monthly: '935.00' },
                            originalPrices: { annually: '11220.00', monthly: null },
                            profiles: '200',
                            searches: '900',
                            priceIds: {
                                annually: 'price_1PNV3qF5PN4woVWoY0u5MOi8',
                                monthly: 'price_1PNV3SF5PN4woVWo02EnOZiX',
                            },
                            priceIdsForExistingUser: {
                                annually: 'price_1PNV3qF5PN4woVWoY0u5MOi8_user',
                                monthly: 'price_1PNV3SF5PN4woVWo02EnOZiX_user',
                            },
                            forExistingUser: { annually: '9000.00', monthly: '900.00' },
                        },
                        usd: {
                            currency: 'usd',
                            prices: { annually: '1316.00', monthly: '129.00' },
                            originalPrices: { annually: '1548.00', monthly: null },
                            profiles: '200',
                            searches: '900',
                            priceIds: {
                                annually: 'price_1PNUz3F5PN4woVWog9Ds2Xi8',
                                monthly: 'price_1PNUyXF5PN4woVWoC8VMxxqE',
                            },
                            priceIdsForExistingUser: {
                                annually: 'price_1PNUz3F5PN4woVWog9Ds2Xi8_user',
                                monthly: 'price_1PNUyXF5PN4woVWoC8VMxxqE_user',
                            },
                            forExistingUser: { annually: '1300.00', monthly: '120.00' },
                        },
                    },
                    outreach: {
                        cny: {
                            currency: 'cny',
                            prices: { annually: '9536.00', monthly: '935.00' },
                            originalPrices: { annually: '11220.00', monthly: null },
                            profiles: '200',
                            searches: '900',
                            priceIds: {
                                annually: 'price_1PNV3qF5PN4woVWoY0u5MOi8',
                                monthly: 'price_1PNV3SF5PN4woVWo02EnOZiX',
                            },
                            priceIdsForExistingUser: {
                                annually: 'price_1PNV3qF5PN4woVWoY0u5MOi8_user',
                                monthly: 'price_1PNV3SF5PN4woVWo02EnOZiX_user',
                            },
                            forExistingUser: { annually: '9000.00', monthly: '900.00' },
                        },
                        usd: {
                            currency: 'usd',
                            prices: { annually: '1316.00', monthly: '129.00' },
                            originalPrices: { annually: '1548.00', monthly: null },
                            profiles: '200',
                            searches: '900',
                            priceIds: {
                                annually: 'price_1PNUz3F5PN4woVWog9Ds2Xi8',
                                monthly: 'price_1PNUyXF5PN4woVWoC8VMxxqE',
                            },
                            priceIdsForExistingUser: {
                                annually: 'price_1PNUz3F5PN4woVWog9Ds2Xi8_user',
                                monthly: 'price_1PNUyXF5PN4woVWoC8VMxxqE_user',
                            },
                            forExistingUser: { annually: '1300.00', monthly: '120.00' },
                        },
                    },
                };

                const getCompanyByIdMock = vi.spyOn(CompanyRepository.getRepository(), 'getCompanyById');
                getCompanyByIdMock.mockResolvedValue({
                    createdAt: new Date('2024-06-01T01:07:09.203Z'),
                } as CompanyEntity);

                const findPriceMock = vi.spyOn(PriceRepository.getRepository(), 'find');
                findPriceMock.mockResolvedValue(pricesData as unknown as PriceEntity[]);

                // Act
                const result = await SubscriptionV2Service.getService().getPrices();

                // Assert
                expect(result).toStrictEqual(expectedPrices);
            });
        });
    });
});

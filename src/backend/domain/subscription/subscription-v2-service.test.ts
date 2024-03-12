import SubscriptionRepository from 'src/backend/database/subcription/subscription-repository';
import StripeService from 'src/backend/integration/stripe/stripe-service';
import awaitToError from 'src/utils/await-to-error';
import { RequestContext } from 'src/utils/request-context/request-context';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import SubscriptionV2Service from './subscription-v2-service';
import CompanyRepository from 'src/backend/database/company/company-repository';
import { UnprocessableEntityError } from 'src/utils/error/http-error';
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
    const SubscriptionRepositoryUpsertMock = vi.fn();
    const SubscriptionRepositoryDeleteMock = vi.fn();
    const CancelSubscriptionMock = vi.fn();
    const CompanyRepositoryUpdateMock = vi.fn();
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
    SubscriptionRepository.getRepository().upsert = SubscriptionRepositoryUpsertMock;
    SubscriptionRepository.getRepository().delete = SubscriptionRepositoryDeleteMock;
    CompanyRepository.getRepository().update = CompanyRepositoryUpdateMock;

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
            });

            it(`should update subscription and company, and insert new subscription when redirectStatus is success`, async () => {
                await SubscriptionV2Service.getService().postConfirmation({
                    redirectStatus: 'success',
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
                        price: 100,
                        total: 100,
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
                        discount: 200,
                        coupon: 'mock-coupon-id',
                        activeAt: 1710133391,
                        pausedAt: 1712811791,
                        cancelledAt: null,
                    },
                    {
                        conflictPaths: ['company.id'],
                    },
                );
                expect(CompanyRepository.getRepository().update).toHaveBeenCalledWith(
                    {
                        id: 'company_1',
                    },
                    {
                        subscriptionStatus: 'active',
                        searchesLimit: '100000000',
                        profilesLimit: '100000000',
                        subscriptionPlan: 'plan_1',
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
                };
                SubscriptionRepositoryFindOneMock.mockResolvedValue(stripeSubscription);
                StripeService.client.subscriptions.list = vi.fn().mockResolvedValue(stripeSubscription);

                const result = await SubscriptionV2Service.getService().getSubscription();
                expect(result).toBe(stripeSubscription);
            });
            it(`should return subscription from database`, async () => {
                const subscriptionData = {
                    subscriptionData: {
                        items: {
                            data: [{ price: { id: 'price_1' } }],
                        },
                    },
                };
                SubscriptionRepositoryFindOneMock.mockResolvedValue(subscriptionData);
                const result = await SubscriptionV2Service.getService().getSubscription();
                expect(result).toBe(subscriptionData);
            });
        });
    });
});

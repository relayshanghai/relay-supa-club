import SubscriptionRepository from 'src/backend/database/subcription/subscription-repository';
import StripeService from 'src/backend/integration/stripe/stripe-service';
import awaitToError from 'src/utils/await-to-error';
import { RequestContext } from 'src/utils/request-context/request-context';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import SubscriptionV2Service from './subscription-v2-service';
vi.mock('src/backend/database/provider/transaction-decorator', () => ({
    UseTransaction: (): MethodDecorator => (_target, _key, _descriptor: PropertyDescriptor) => {
        // do nothing
    },
}));
describe(`src/backend/domain/subscription/subscription-v2-service.test.ts`, async () => {
    const StripeCreateSubscriptionMock = vi.fn();
    const SubscriptionRepositoryFindOneMock = vi.fn();
    SubscriptionRepository.prototype.findOne = SubscriptionRepositoryFindOneMock;
    StripeService.client.subscriptions.create = StripeCreateSubscriptionMock;

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

    describe('getPrice', () => {
        it('should return price from stripe', async () => {
            const price = { id: 'price_1' };
            StripeService.client.prices.retrieve = vi.fn().mockResolvedValue(price);
            const result = await StripeService.getService().getPrice('price_1');
            expect(result).toBe(price);
        });
    });

    describe('getProduct', () => {
        it('should return product from stripe', async () => {
            const product = { id: 'product_1' };
            StripeService.client.products.retrieve = vi.fn().mockResolvedValue(product);
            const result = await StripeService.getService().getProduct('product_1');
            expect(result).toBe(product);
        });
    });
});

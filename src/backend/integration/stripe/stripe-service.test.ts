import StripeService from 'src/backend/integration/stripe/stripe-service';
import { RequestContext } from 'src/utils/request-context/request-context';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe(`src/backend/integration/stripe/stripe-service.test.ts`, async () => {
    describe(`StripeService`, () => {
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
});

import React from 'react';
import { render, fireEvent, waitFor, cleanup, act } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { PriceCard } from './price-card';
let createSubscriptionMock = vi.fn();
const refreshPaymentMethodInfoMock = vi.fn();
const pushMock = vi.fn();
describe('PriceCard Component', () => {
    afterEach(() => {
        cleanup();
    });
    beforeEach(() => {
        vi.resetAllMocks();
        vi.mock('src/hooks/v2/use-prices', () => ({
            usePricesV2: () => ({
                prices: {
                    discovery: {
                        currency: 'cny',
                        prices: { monthly: '299' },
                        originalPrices: { monthly: '399' },
                        profiles: '200',
                        searches: '900',
                        priceIds: { monthly: 'price_monthly_1' },
                    },
                    outreach: {
                        currency: 'cny',
                        prices: { monthly: '799' },
                        originalPrices: { monthly: '899' },
                        profiles: '600',
                        searches: '1200',
                        priceIds: { monthly: 'price_monthly_2' },
                    },
                },
                loading: false,
            }),
            priceDetails: {
                discovery: [
                    {
                        title: 'upTo_amount_Searches',
                        icon: 'check',
                        amount: 900,
                        subtitle: 'boostBotSearchAndNormalSearch',
                    },
                    { title: 'amount_InfluencerAudienceReports', icon: 'check', amount: 200 },
                    { title: 'fullCustomerService', icon: 'check' },
                ],
                outreach: [
                    {
                        title: 'upTo_amount_Searches',
                        icon: 'check',
                        amount: 1200,
                        subtitle: 'boostBotSearchAndNormalSearch',
                    },
                    { title: 'amount_InfluencerAudienceReports', icon: 'check', amount: 600 },
                    { title: 'personalEmailAccount', icon: 'check', amount: 1 },
                    { title: 'amount_EmailsPerMonth', icon: 'check', amount: 600 },
                    { title: 'fullCustomerService', icon: 'check' },
                ],
            },
            useLocalStorageSelectedPrice: () => [
                {},
                () => {
                    return null;
                },
            ],
        }));

        createSubscriptionMock = vi.fn().mockResolvedValue({
            clientSecret: 'test-client-secret',
            ipAddress: 'test-ip-address',
            plan: 'outreach',
            providerSubscriptionId: 'test-provider-subscription-id',
        });

        vi.mock('next/router', () => ({
            useRouter: () => ({
                push: pushMock,
            }),
        }));

        vi.mock('src/hooks/use-subscription', () => ({
            useSubscription: () => ({
                subscription: {
                    status: 'canceled',
                    name: 'test',
                    interval: 30,
                },
                upgradeSubscription: vi.fn(),
            }),
        }));

        vi.mock('src/hooks/v2/use-subscription', () => ({
            useSubscription: () => ({
                createSubscription: createSubscriptionMock,
                loading: false,
                subscription: {
                    subscriptionData: {
                        plan: {
                            interval: 'month',
                            interval_count: 1,
                        },
                    },
                    status: 'CANCELLED',
                },
                product: { name: 'Outreach' },
                refreshPaymentMethodInfo: refreshPaymentMethodInfoMock,
            }),
            STRIPE_SUBSCRIBE_RESPONSE: 'boostbot_stripe_secret_response',
            stripeSubscribeResponseInitialValue: {},
            useLocalStorageSubscribeResponse: () => [
                {},
                () => {
                    return null;
                },
            ],
        }));

        vi.mock('src/hooks/use-rudderstack', () => ({
            useRudderstack: () => ({
                trackEvent: vi.fn(),
            }),
        }));
    });

    test('should render component', () => {
        const { getByTestId } = render(<PriceCard landingPage={false} period="monthly" priceTier="outreach" />);
        expect(getByTestId('price-card-wrapper')).toBeDefined();
    });

    test('should not show button upgrade', () => {
        const { getByTestId } = render(<PriceCard landingPage={true} period="monthly" priceTier="outreach" />);
        let err = null;
        try {
            getByTestId('upgrade-button');
        } catch (error) {
            err = error;
        }
        expect(err).toBeDefined();
    });

    test('should show button upgrade', () => {
        const { getByTestId } = render(<PriceCard landingPage={false} period="monthly" priceTier="outreach" />);
        expect(getByTestId('upgrade-button')).toBeDefined();
    });

    test('should call createSubscription and redirect to payments page when shouldAddPayment is true', async () => {
        const { getByTestId } = render(<PriceCard landingPage={false} period="monthly" priceTier="outreach" />);
        const buttonTest = getByTestId('upgrade-button');
        act(() => {
            fireEvent.click(buttonTest);
        });

        await waitFor(() => {
            expect(createSubscriptionMock).toHaveBeenCalledWith({ priceId: 'price_monthly_2', quantity: 1 });
            expect(pushMock).toHaveBeenCalledWith('/subscriptions/test-provider-subscription-id/payments');
        });
    });
});

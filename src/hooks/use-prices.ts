/* eslint-disable react-hooks/exhaustive-deps */
import type { NewSubscriptionPricesGetResponse } from 'pages/api/subscriptions/prices';
import { useCallback, useEffect, useState } from 'react';
import { STRIPE_PRICE_ONE_OFF_ADD_PAYMENT } from 'src/utils/api/stripe/constants';
import { nextFetch } from 'src/utils/fetcher';
import { clientLogger } from 'src/utils/logger-client';
import type { NewRelayPlan, SubscriptionPeriod, SubscriptionTier } from 'types';
import { useLocalStorage } from './use-localstorage';

export type ActiveSubscriptionTier = Exclude<SubscriptionTier, 'VIP' | 'diy' | 'diyMax' | 'free'>;
export type ActiveSubscriptionPeriod = Exclude<SubscriptionPeriod, 'quarterly'>;

export type PriceDetails = {
    [key in ActiveSubscriptionTier]: {
        title: string;
        icon: string;
        info?: string;
        amount?: number;
        subtitle?: string;
        currency?: string;
    }[];
};
export type Price = {
    currency: string;
    prices: {
        [key in ActiveSubscriptionPeriod]: string;
    };
    profiles: string;
    searches: string;
    priceIds: {
        [key in ActiveSubscriptionPeriod]: string;
    };
};
export type Prices = {
    [key in ActiveSubscriptionTier]: NewRelayPlan;
};

export const priceDetails: PriceDetails = {
    discovery: [
        { title: 'upTo_amount_Searches', icon: 'check', amount: 900, subtitle: 'boostBotSearchAndNormalSearch' },
        { title: 'amount_InfluencerAudienceReports', icon: 'check', amount: 200 },
        { title: 'fullCustomerService', icon: 'check' },
    ],
    outreach: [
        { title: 'upTo_amount_Searches', icon: 'check', amount: 1200, subtitle: 'boostBotSearchAndNormalSearch' },
        { title: 'amount_InfluencerAudienceReports', icon: 'check', amount: 600 },
        { title: 'personalEmailAccount', icon: 'check', amount: 1 },
        { title: 'amount_EmailsPerMonth', icon: 'check', amount: 600 },
        { title: 'fullCustomerService', icon: 'check' },
    ],
    addPayment: [{ title: 'addPayment', icon: 'check' }],
};

export const useLocalStorageSelectedPrice = () =>
    useLocalStorage<NewRelayPlan>('selectedPrice', {
        currency: 'usd',
        prices: {
            monthly: '0',
            annually: '0',
        },
        profiles: '',
        searches: '',
        priceIds: {
            monthly: STRIPE_PRICE_ONE_OFF_ADD_PAYMENT,
            annually: STRIPE_PRICE_ONE_OFF_ADD_PAYMENT,
        },
    });

/**
 *
 * @deprecated use usePricesV2 instead
 */
export const usePrices = (currency: string) => {
    const [prices, setPrices] = useState<Prices>();
    const [loading, setLoading] = useState(false);
    const refreshPrices = useCallback(async () => {
        if (loading) return;
        setLoading(true);
        try {
            const data = await nextFetch<NewSubscriptionPricesGetResponse>('subscriptions/prices');
            // alipay only accepts cny subscription in our region, so return only cny prices for now. Stripe auto covert other payment with exchange rate.
            // If the charge currency differs from the customer's credit card currency, the customer may be charged a foreign exchange fee by their credit card company.
            const prices = {
                discovery: data.discovery.find((plan) => plan.currency === currency),
                outreach: data.outreach.find((plan) => plan.currency === currency),
                addPayment: {
                    currency: currency,
                    prices: { monthly: '0' },
                    profiles: '',
                    searches: '',
                    priceIds: { monthly: STRIPE_PRICE_ONE_OFF_ADD_PAYMENT },
                },
            } as Prices;
            setPrices(prices);
        } catch (error) {
            clientLogger(error, 'error');
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        refreshPrices();
    }, [refreshPrices]);

    return { prices, loading };
};

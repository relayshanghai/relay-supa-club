/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from 'react';
import { STRIPE_PRICE_ONE_OFF_ADD_PAYMENT } from 'src/utils/api/stripe/constants';
import { nextFetch } from 'src/utils/fetcher';
import { clientLogger } from 'src/utils/logger-client';
import type { RelayPlanWithAnnual, SubscriptionPeriod, SubscriptionTier } from 'types';
import { useLocalStorage } from '../use-localstorage';

export type ActiveSubscriptionTier = Exclude<SubscriptionTier, 'VIP' | 'diy' | 'diyMax' | 'free'>;
export type ActiveSubscriptionPeriod = Exclude<SubscriptionPeriod, 'quarterly' | 'annually'>;

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
    [key in ActiveSubscriptionTier]: RelayPlanWithAnnual;
};
export type AnnualPricesGetResponse = {
    [key in ActiveSubscriptionTier]: {
        [key: string]: RelayPlanWithAnnual;
    };
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
    useLocalStorage<RelayPlanWithAnnual>('selectedPrice', {
        currency: 'usd',
        prices: {
            monthly: '0',
            annually: '0',
        },
        originalPrices: {
            monthly: '0',
            annually: '0',
        },
        profiles: '',
        searches: '',
        priceIds: {
            monthly: '',
            annually: '',
        },
        forExistingUser: {
            monthly: '',
            annually: '',
        },
    });
export const usePricesV2 = (currency: string) => {
    const [prices, setPrices] = useState<Prices>();
    const [loading, setLoading] = useState(false);
    const refreshPrices = useCallback(async () => {
        if (loading) return;
        setLoading(true);
        try {
            const data = await nextFetch<AnnualPricesGetResponse>('/v2/subscriptions/prices');
            // alipay only accepts cny subscription in our region, so return only cny prices for now. Stripe auto covert other payment with exchange rate.
            // If the charge currency differs from the customer's credit card currency, the customer may be charged a foreign exchange fee by their credit card company.
            const plans = Object.keys(data);
            const pricesPlans = plans.reduce((acc, plan) => {
                acc[plan as keyof typeof prices] = data[plan as keyof typeof prices]?.[currency];
                return acc;
            }, {} as Prices);
            const prices = {
                ...pricesPlans,
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
    }, [currency]);

    useEffect(() => {
        refreshPrices();
    }, [refreshPrices, currency]);

    return { prices, loading };
};

/* eslint-disable react-hooks/exhaustive-deps */
import type { NewSubscriptionPricesGetResponse } from 'pages/api/subscriptions/prices';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    STRIPE_PRICE_MONTHLY_DISCOVERY,
    STRIPE_PRICE_MONTHLY_OUTREACH,
    STRIPE_PRICE_ONE_OFF_ADD_PAYMENT,
} from 'src/utils/api/stripe/constants';
import { nextFetch } from 'src/utils/fetcher';
import { clientLogger } from 'src/utils/logger-client';
import type { SubscriptionPeriod, SubscriptionTier } from 'types';

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

export type Prices = {
    [key in ActiveSubscriptionTier]: {
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
};

export const PRICE_IDS = {
    monthly: {
        discovery: STRIPE_PRICE_MONTHLY_DISCOVERY,
        outreach: STRIPE_PRICE_MONTHLY_OUTREACH,
    },
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

export const usePrices = () => {
    const { i18n } = useTranslation();
    const en = i18n.language?.toLowerCase().includes('en');
    const currency = en ? 'usd' : 'cny';
    const defaultPrices = useMemo(
        () => ({
            discovery: {
                currency: en ? 'usd' : 'cny',
                prices: { monthly: en ? '42' : '299' },
                profiles: '',
                searches: '',
                priceIds: { monthly: STRIPE_PRICE_MONTHLY_DISCOVERY },
            },
            outreach: {
                currency: en ? 'usd' : 'cny',
                prices: { monthly: en ? '115' : '799' },
                profiles: '',
                searches: '',
                priceIds: { monthly: STRIPE_PRICE_MONTHLY_OUTREACH },
            },
            addPayment: {
                currency: en ? 'usd' : 'cny',
                prices: { monthly: '0' },
                profiles: '',
                searches: '',
                priceIds: { monthly: STRIPE_PRICE_ONE_OFF_ADD_PAYMENT },
            },
        }),
        [en],
    );

    const [prices, setPrices] = useState<Prices>(defaultPrices);

    const refreshPrices = useCallback(async () => {
        try {
            const data = await nextFetch<NewSubscriptionPricesGetResponse>('subscriptions/prices');
            // alipay only accepts cny subscription in our region, so return only cny prices for now. Stripe auto covert other payment with exchange rate.
            // If the charge currency differs from the customer's credit card currency, the customer may be charged a foreign exchange fee by their credit card company.
            const prices = {
                discovery: data.discovery.find((plan) => plan.currency === currency) || defaultPrices.discovery,
                outreach: data.outreach.find((plan) => plan.currency === currency) || defaultPrices.outreach,
                addPayment: defaultPrices.addPayment,
            };

            setPrices(prices);
        } catch (error) {
            clientLogger(error, 'error');
        }
    }, [defaultPrices]);

    useEffect(() => {
        refreshPrices();
    }, [refreshPrices]);

    return { prices };
};

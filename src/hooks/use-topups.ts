import { useLocalStorage } from './use-localstorage';
import { usePlans } from './use-plans';
import { useEffect, useState } from 'react';

export type TopUpSizes =
    | 'small'
    | 'medium'
    | 'large'
    | '10 influencer page export'
    | '15 influencer page export'
    | '100 influencer page export';
export type CurrencyDetails = {
    price: number;
    priceId: string;
};
export type TopUpDetails = {
    title: string;
    icon: string;
    amount: number;
};
export type TopUpPrices = {
    usd: CurrencyDetails;
    cny: CurrencyDetails;
};
export type TopUpOptions = Record<TopUpSizes, TopUpPrices>;
export const topUpBundleDetails: Record<TopUpSizes, TopUpDetails[]> = {
    small: [
        { title: 'upTo_amount_Searches', icon: 'check', amount: 300 },
        { title: 'amount_InfluencerAudienceReports', icon: 'check', amount: 100 },
        { title: 'creditExpiryDate', icon: 'check', amount: 0 },
    ],
    medium: [
        { title: 'upTo_amount_Searches', icon: 'check', amount: 700 },
        { title: 'amount_InfluencerAudienceReports', icon: 'check', amount: 300 },
        { title: 'creditExpiryDate', icon: 'check', amount: 0 },
    ],
    large: [
        { title: 'upTo_amount_Searches', icon: 'check', amount: 1000 },
        { title: 'amount_InfluencerAudienceReports', icon: 'check', amount: 500 },
        { title: 'creditExpiryDate', icon: 'check', amount: 0 },
    ],
    '10 influencer page export': [
        { title: 'upToAmountExports', icon: 'check', amount: 10 },
        { title: 'creditExpiryDate', icon: 'check', amount: 0 },
    ],
    '15 influencer page export': [
        { title: 'upToAmountExports', icon: 'check', amount: 15 },
        { title: 'creditExpiryDate', icon: 'check', amount: 0 },
    ],
    '100 influencer page export': [
        { title: 'upToAmountExports', icon: 'check', amount: 100 },
        { title: 'creditExpiryDate', icon: 'check', amount: 0 },
    ],
};

export const STRIPE_SELECTED_TOPUP_BUNDLE = 'boostbot_stripe_bundle_response';
export const selectedTopupBundle: {
    topupPrice?: TopUpSizes;
    currencyDetails?: CurrencyDetails;
    clientSecret?: string;
    ipAddress?: string;
} = { topupPrice: undefined };

export const useLocalSelectedTopupBundle = () => useLocalStorage(STRIPE_SELECTED_TOPUP_BUNDLE, selectedTopupBundle);
export const useTopUpPlan = () => {
    const [topUpPrices, setTopUpPrices] = useState<TopUpOptions>();
    const { getPlans } = usePlans();

    useEffect(() => {
        getPlans().then((res) => {
            const p = res.reduce((acc: TopUpOptions, item) => {
                const { itemName, currency, price, priceId } = item;
                if (!acc[itemName as TopUpSizes]) {
                    acc[itemName as TopUpSizes] = {} as TopUpPrices;
                }
                acc[itemName as TopUpSizes][currency] = { price, priceId };

                return acc;
            }, {} as TopUpOptions);
            setTopUpPrices(p);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { topUpPrices };
};

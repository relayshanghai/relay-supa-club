import type { NewSubscriptionPricesGetResponse } from 'pages/api/subscriptions/new-prices';
import type { SubscriptionPricesGetResponse } from 'pages/api/subscriptions/prices';
import {
    STRIPE_PRICE_MONTHLY_DISCOVERY,
    STRIPE_PRICE_MONTHLY_DIY,
    STRIPE_PRICE_MONTHLY_DIY_MAX,
    STRIPE_PRICE_MONTHLY_OUTREACH,
    STRIPE_PRICE_QUARTERLY_DIY,
    STRIPE_PRICE_QUARTERLY_DIY_MAX,
} from 'src/utils/api/stripe/constants';
import { nextFetch } from 'src/utils/fetcher';
import { clientLogger } from 'src/utils/logger-client';
import useSWR from 'swr';
import type { SubscriptionPeriod, SubscriptionTier } from 'types';

export type ActiveSubscriptionTier = Exclude<SubscriptionTier, 'VIP'> | 'free';
export type ActiveSubscriptionPeriod = Exclude<SubscriptionPeriod, 'annually'>;
export type PriceTiers = {
    [key in ActiveSubscriptionTier]: string;
};
export type Prices = {
    [key in ActiveSubscriptionPeriod]: PriceTiers;
};

export const PRICE_IDS: Prices = {
    monthly: {
        diy: STRIPE_PRICE_MONTHLY_DIY,
        diyMax: STRIPE_PRICE_MONTHLY_DIY_MAX,
        free: '',
        discovery: STRIPE_PRICE_MONTHLY_DISCOVERY,
        outreach: STRIPE_PRICE_MONTHLY_OUTREACH,
    },
    quarterly: {
        diy: STRIPE_PRICE_QUARTERLY_DIY,
        diyMax: STRIPE_PRICE_QUARTERLY_DIY_MAX,
        free: '',
        discovery: '',
        outreach: '',
    },
};
export type PriceDetails = {
    [key in ActiveSubscriptionTier]: {
        title: string;
        icon: string;
        info?: string;
        amount?: number;
        subtitle?: string;
    }[];
};

export const priceDetails: PriceDetails = {
    free: [
        { title: 'upTo_amount_Searches', icon: 'check', amount: 1000 },
        { title: 'amount_InfluencerAudienceReports', icon: 'check', amount: 30 },
        { title: 'campaignManagementTool', icon: 'check' },
        { title: 'amount_AIGeneratedEmailTemplates', icon: 'check', amount: 50 },
    ],
    diyMax: [
        { title: 'upTo_amount_Searches', icon: 'check', amount: 50000 },
        { title: 'amount_InfluencerAudienceReports', icon: 'check', amount: 450 },
        { title: 'campaignManagementTool', icon: 'check' },
        { title: 'amount_AIGeneratedEmailTemplates', icon: 'check', amount: 2000 },
        { title: 'fullCustomerService', icon: 'check' },
    ],
    diy: [
        { title: 'upTo_amount_Searches', icon: 'check', amount: 25000 },
        { title: 'amount_InfluencerAudienceReports', icon: 'check', amount: 200 },
        { title: 'campaignManagementTool', icon: 'check' },
        { title: 'amount_AIGeneratedEmailTemplates', icon: 'check', amount: 1000 },
        { title: 'fullCustomerService', icon: 'check' },
    ],
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
};
/** Takes the total period price (say a full quarter) price and formats into a monthly average price */
export const formatPrice = (price: string, currency: string, period: 'monthly' | 'annually' | 'quarterly') => {
    const pricePerMonth =
        period === 'annually' ? Number(price) / 12 : period === 'quarterly' ? Number(price) / 3 : Number(price);
    /** I think rounding to the dollar is OK for now, but if need be we can add cents */
    const roundedPrice = Math.round(pricePerMonth);
    if (currency === 'usd')
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(roundedPrice);
    // not sure what other currencies we will handle and if we can pass them directly to Intl.NumberFormat so this is a placeholder until we know
    return `${roundedPrice} ${currency}`;
};
export const usePrices = () => {
    const pricesBlank: Prices = {
        monthly: { diy: '$--', diyMax: '$--', free: '$0', discovery: '299', outreach: '799' },
        quarterly: { diy: '$--', diyMax: '$--', free: '$0', discovery: '', outreach: '' },
    };
    const { data: prices } = useSWR('prices', async () => {
        try {
            const res = await nextFetch<SubscriptionPricesGetResponse>('subscriptions/prices');
            const { diy, diyMax } = res;
            const monthly = {
                diy: formatPrice(diy.prices.monthly, diy.currency, 'monthly'),
                diyMax: formatPrice(diyMax.prices.monthly, diyMax.currency, 'monthly'),
                free: '$0',
                discovery: '299',
                outreach: '799',
            };
            const quarterly = {
                diy: formatPrice(diy.prices.quarterly, diy.currency, 'quarterly'),
                diyMax: formatPrice(diyMax.prices.quarterly, diyMax.currency, 'quarterly'),
                free: '$0',
                discovery: '',
                outreach: '',
            };
            const result: Prices = {
                monthly,
                quarterly,
            };
            return result;
        } catch (error) {
            clientLogger(error, 'error', true); // send to sentry cause there's something wrong with the pricing endpoint
            return pricesBlank;
        }
    });
    return prices ? prices : pricesBlank;
};

//current create a new use hook for new prices as the old one are not found in the test mode of our Stripe account, they were in another Stripe account which was a legacy issue
export const useNewPrices = () => {
    const pricesBlank = {
        discovery: {
            currency: 'cny',
            prices: { monthly: '299' },
            profiles: '',
            searches: '',
            priceIds: { monthly: STRIPE_PRICE_MONTHLY_DISCOVERY },
        },
        outreach: {
            currency: 'cny',
            prices: { monthly: '799' },
            profiles: '',
            searches: '',
            priceIds: { monthly: STRIPE_PRICE_MONTHLY_OUTREACH },
        },
    };

    const { data: newPrices } = useSWR('new-prices', async () => {
        try {
            const newPrices = await nextFetch<NewSubscriptionPricesGetResponse>('subscriptions/new-prices');
            return newPrices;
        } catch (error) {
            clientLogger(error, 'error');
        }
    });
    return newPrices ? newPrices : pricesBlank;
};

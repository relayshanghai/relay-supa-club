import { t } from 'i18next';
import type { SubscriptionPricesGetResponse } from 'pages/api/subscriptions/prices';
import {
    STRIPE_PRICE_MONTHLY_DIY,
    STRIPE_PRICE_MONTHLY_DIY_MAX,
    STRIPE_PRICE_QUARTERLY_DIY,
    STRIPE_PRICE_QUARTERLY_DIY_MAX,
} from 'src/utils/api/stripe/constants';
import { nextFetch } from 'src/utils/fetcher';
import { clientLogger } from 'src/utils/logger-client';
import useSWR from 'swr';
import type { SubscriptionPeriod, SubscriptionTier } from 'types';
export type ActiveSubscriptionTier = SubscriptionTier | 'free';
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
        VIP: '',
        free: '',
    },
    quarterly: {
        diy: STRIPE_PRICE_QUARTERLY_DIY,
        diyMax: STRIPE_PRICE_QUARTERLY_DIY_MAX,
        VIP: '',
        free: '',
    },
};
export type PriceDetails = {
    [key in ActiveSubscriptionTier]: { title: string; icon: string; info?: string; amount?: number }[];
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
    VIP: [
        { title: 'moreInfluencerProfiles', icon: 'check' },
        { title: 'search264MillionInfluencers', icon: 'check' },
        { title: 'unlimitedCampaigns', icon: 'check' },
        { title: 'unlimitedUserAccountsPerCompany', icon: 'check' },
        { title: 'influencerOutreachExpertWorkingOnYourCampaigns', icon: 'check' },
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
        monthly: { diy: '$--', diyMax: '$--', VIP: t('pricing.contactUs'), free: '$0' },
        quarterly: { diy: '$--', diyMax: '$--', VIP: t('pricing.contactUs'), free: '$0' },
    };
    const { data: prices } = useSWR('prices', async () => {
        try {
            const res = await nextFetch<SubscriptionPricesGetResponse>('subscriptions/prices');
            const { diy, diyMax } = res;

            const monthly = {
                diy: formatPrice(diy.prices.monthly, diy.currency, 'monthly'),
                diyMax: formatPrice(diyMax.prices.monthly, diyMax.currency, 'monthly'),
                VIP: t('pricing.contactUs'),
                free: '$0',
            };
            const quarterly = {
                diy: formatPrice(diy.prices.quarterly, diy.currency, 'quarterly'),
                diyMax: formatPrice(diyMax.prices.quarterly, diyMax.currency, 'quarterly'),
                VIP: t('pricing.contactUs'),
                free: '$0',
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

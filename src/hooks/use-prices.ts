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
export type PriceTiers = {
    [key in SubscriptionTier]: string;
};
export type Prices = {
    [key in SubscriptionPeriod]: PriceTiers;
};

export const PRICE_IDS: Prices = {
    monthly: {
        diy: STRIPE_PRICE_MONTHLY_DIY,
        diyMax: STRIPE_PRICE_MONTHLY_DIY_MAX,
    },
    quarterly: {
        diy: STRIPE_PRICE_QUARTERLY_DIY,
        diyMax: STRIPE_PRICE_QUARTERLY_DIY_MAX,
    },
};
export type PriceDetails = {
    [key in SubscriptionTier]: { title: string; icon: string; info?: string }[];
};

export const priceDetails: PriceDetails = {
    diy: [
        { title: 'twoHundredNewInfluencerProfilesPerMonth', icon: 'check' },
        { title: 'search264MillionInfluencers', icon: 'check' },
        { title: 'unlimitedCampaigns', icon: 'check' },
        { title: 'unlimitedUserAccountsPerCompany', icon: 'check' },
        {
            title: 'clubbyStarterPack',
            icon: 'check',
            info: 'includesCustomEmailTemplates',
        },
        { title: 'influencerOutreachExpertWorkingOnYourCampaigns', icon: 'cross' },
    ],
    diyMax: [
        { title: 'fourHundredFiftyNewInfluencerProfilesPerMonth', icon: 'check' },
        { title: 'search264MillionInfluencers', icon: 'check' },
        { title: 'unlimitedCampaigns', icon: 'check' },
        { title: 'unlimitedUserAccountsPerCompany', icon: 'check' },
        {
            title: 'clubbyStarterPack',
            icon: 'check',
            info: 'includesCustomEmailTemplates',
        },
        { title: 'influencerOutreachExpertWorkingOnYourCampaigns', icon: 'cross' },
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
        }).format(roundedPrice);
    // not sure what other currencies we will handle and if we can pass them directly to Intl.NumberFormat so this is a placeholder until we know
    return `${roundedPrice} ${currency}`;
};
export const usePrices = () => {
    const pricesBlank: Prices = {
        monthly: { diy: '', diyMax: '' },
        quarterly: { diy: '', diyMax: '' },
    };
    const { data: prices } = useSWR('prices', async () => {
        try {
            const res = await nextFetch<SubscriptionPricesGetResponse>('subscriptions/prices');
            const { diy, diyMax } = res;

            const monthly = {
                diy: formatPrice(diy.prices.monthly, diy.currency, 'monthly'),
                diyMax: formatPrice(diyMax.prices.monthly, diyMax.currency, 'monthly'),
                VIP: t('pricing.contactUs'),
            };
            const quarterly = {
                diy: formatPrice(diy.prices.quarterly, diy.currency, 'quarterly'),
                diyMax: formatPrice(diyMax.prices.quarterly, diyMax.currency, 'quarterly'),
                VIP: t('pricing.contactUs'),
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

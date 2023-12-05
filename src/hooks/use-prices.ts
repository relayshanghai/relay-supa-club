import type { NewSubscriptionPricesGetResponse } from 'pages/api/subscriptions/prices';
import { useTranslation } from 'react-i18next';
import { STRIPE_PRICE_MONTHLY_DISCOVERY, STRIPE_PRICE_MONTHLY_OUTREACH } from 'src/utils/api/stripe/constants';
import { nextFetch } from 'src/utils/fetcher';
import { clientLogger } from 'src/utils/logger-client';
import useSWR from 'swr';
import type { SubscriptionPeriod, SubscriptionTier } from 'types';

export type ActiveSubscriptionTier = Exclude<SubscriptionTier, 'VIP' | 'diy' | 'diyMax' | 'free'>;
export type ActiveSubscriptionPeriod = Exclude<SubscriptionPeriod, 'annually' | 'quarterly'>;
export type PriceTiers = {
    [key in ActiveSubscriptionTier]: string;
};
export type Prices = {
    [key in ActiveSubscriptionPeriod]: PriceTiers;
};

export const PRICE_IDS: Prices = {
    monthly: {
        discovery: STRIPE_PRICE_MONTHLY_DISCOVERY,
        outreach: STRIPE_PRICE_MONTHLY_OUTREACH,
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

//current create a new use hook for new prices as the old one are not found in the test mode of our Stripe account, they were in another Stripe account which was a legacy issue
export const usePrices = () => {
    const { i18n } = useTranslation();
    const en = i18n.language.toLowerCase().includes('en');
    const pricesForUI = {
        discovery: {
            currency: en ? 'usd' : 'cny',
            prices: { monthly: en ? '41' : '299' },
            profiles: '',
            searches: '',
            priceIds: { monthly: STRIPE_PRICE_MONTHLY_DISCOVERY },
        },
        outreach: {
            currency: en ? 'usd' : 'cny',
            prices: { monthly: en ? '110' : '799' },
            profiles: '',
            searches: '',
            priceIds: { monthly: STRIPE_PRICE_MONTHLY_OUTREACH },
        },
    };

    const { data: prices } = useSWR(['prices'], async () => {
        try {
            const data = await nextFetch<NewSubscriptionPricesGetResponse>('subscriptions/prices');
            // alipay only accepts cny subscription in our region, so return only cny prices for now. Stripe auto covert other payment with exchange rate.
            // If the charge currency differs from the customer's credit card currency, the customer may be charged a foreign exchange fee by their credit card company.
            const prices = {
                discovery: data.discovery.find((plan) => plan.currency === 'cny') || pricesForUI.discovery,
                outreach: data.outreach.find((plan) => plan.currency === 'cny') || pricesForUI.outreach,
            };

            return prices;
        } catch (error) {
            clientLogger(error, 'error');
        }
    });
    return { pricesForUI, prices: prices ? prices : pricesForUI };
};

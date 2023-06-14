import { t } from 'i18next';
import type { SubscriptionPricesGetResponse } from 'pages/api/subscriptions/prices';
import { nextFetch } from 'src/utils/fetcher';
import { clientLogger } from 'src/utils/logger-client';
import useSWR from 'swr';
export type PriceTiers = {
    diy: string;
    diyMax: string;
    VIP: string;
};
export type Prices = {
    monthly: PriceTiers;
    quarterly: PriceTiers;
    annually: PriceTiers;
};

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
            const annually = {
                diy: formatPrice(diy.prices.annually, diy.currency, 'annually'),
                diyMax: formatPrice(diyMax.prices.annually, diyMax.currency, 'annually'),
                VIP: t('pricing.contactUs'),
            };
            const prices: Prices = { monthly, quarterly, annually };
            return { prices };
        } catch (error) {
            clientLogger(error, 'error', true); // send to sentry cause there's something wrong with the pricing endpoint
            return {
                prices: {
                    monthly: { diy: '', diyMax: '', VIP: '' },
                    quarterly: { diy: '', diyMax: '', VIP: '' },
                    annually: { diy: '', diyMax: '', VIP: '' },
                },
            };
        }
    });
    return { prices };
};

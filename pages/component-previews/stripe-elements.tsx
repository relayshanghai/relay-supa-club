// TODO: remove this preview page https://toil.kitemaker.co/0JhYl8-relayclub/8sxeDu-v2_project/items/454 V2-454ae

import { Modal } from 'src/components/modal';
import { useCompany } from 'src/hooks/use-company';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { nextFetch } from 'src/utils/fetcher';
import { clientLogger } from 'src/utils/logger-client';
import type { SubscriptionPricesGetResponse } from '../api/subscriptions/prices';

import { OnboardPaymentSection } from 'src/components/onboard-payment-section';
import { STRIPE_PRICE_MONTHLY_DIY } from 'src/utils/api/stripe/constants';

const formatPrice = (price: string, currency: string, period: 'monthly' | 'annually' | 'quarterly') => {
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

type PriceTiers = {
    diy: string;
    diyMax: string;
};
type Prices = {
    monthly: PriceTiers;
    quarterly: PriceTiers;
    // annually: PriceTiers;
};
const CheckoutForm = () => {
    const { company } = useCompany();
    const _customerId = company?.cus_id || '';
    const { t } = useTranslation();
    const [prices, setPrices] = useState<Prices>({
        monthly: {
            diy: '--',
            diyMax: '--',
            // VIP: t('pricing.contactUs'),
        },
        quarterly: {
            diy: '--',
            diyMax: '--',
            // VIP: t('pricing.contactUs'),
        },
        // annually: {
        //     diy: '--',
        //     diyMax: '--',
        // },
    });
    const [_priceIds, setPriceIds] = useState<{
        diy: { monthly: string; quarterly: string; annually: string };
        diyMax: { monthly: string; quarterly: string; annually: string };
    } | null>(null);

    useEffect(() => {
        const fetchPrices = async () => {
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
                // const annually = {
                //     diy: formatPrice(diy.prices.annually, diy.currency, 'annually'),
                //     diyMax: formatPrice(diyMax.prices.annually, diyMax.currency, 'annually'),
                //     VIP: t('pricing.contactUs'),
                // };

                setPrices({ monthly, quarterly });
                setPriceIds({ diy: diy.priceIds, diyMax: diyMax.priceIds });
            } catch (error) {
                clientLogger(error, 'error', true); // send to sentry cause there's something wrong with the pricing endpoint
            }
        };

        fetchPrices();
    }, [t]);

    return (
        <Modal maxWidth="lg" visible={true} onClose={() => null}>
            <div className="flex justify-around">
                <div>
                    DIY
                    <div>Monthly: {prices.monthly.diy}</div>
                    <div>Quarterly: {prices.quarterly.diy}</div>
                </div>
                <div>
                    DIY Max
                    <div>Monthly: {prices.monthly.diyMax}</div>
                    <div>Quarterly: {prices.quarterly.diyMax}</div>
                </div>
                <OnboardPaymentSection priceId={STRIPE_PRICE_MONTHLY_DIY} />
            </div>
        </Modal>
    );
};

export default CheckoutForm;

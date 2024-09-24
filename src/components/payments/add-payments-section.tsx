import { loadStripe } from '@stripe/stripe-js';
import type { StripeElementsOptions } from '@stripe/stripe-js';
import { Elements as StripeElementsProvider } from '@stripe/react-stripe-js';
import { useLocalStorageSelectedPrice } from 'src/hooks/use-prices';
import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { randomNumber } from 'src/utils/utils';
import { PromoCodeSectionV2 } from './promo-code-section-v2';
import CheckoutFormV2 from './checkout-form-v2';

const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY || '');

export const AddPaymentsSection = () => {
    const { i18n } = useTranslation();
    const [selectedPrice] = useLocalStorageSelectedPrice();
    const [couponId, setCouponId] = useState<string | undefined>(undefined);
    const batchId = useMemo(() => randomNumber(), []);
    const cardOptions: StripeElementsOptions = {
        mode: 'subscription',
        amount: parseInt(selectedPrice.prices.monthly) * 100, //amount in cents
        currency: selectedPrice.currency,
        appearance: {
            theme: 'stripe',
            variables: {
                colorPrimary: '#8B5CF6', //primary-500 see tailwind.config.js
            },
        },
        locale: i18n.language?.includes('en') ? 'en' : 'zh',
        paymentMethodTypes: ['card', 'alipay'],
    };

    return (
        <div className="w-80 lg:w-[28rem]">
            <PromoCodeSectionV2 setCouponId={setCouponId} />
            <div className="rounded shadow ">
                <StripeElementsProvider stripe={stripePromise} options={cardOptions}>
                    <CheckoutFormV2 selectedPrice={selectedPrice} batchId={batchId} couponId={couponId} />
                </StripeElementsProvider>
            </div>
        </div>
    );
};

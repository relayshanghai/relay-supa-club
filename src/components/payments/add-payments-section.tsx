import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import type { StripeElementsOptions } from '@stripe/stripe-js';
import { Elements as StripeElementsProvider } from '@stripe/react-stripe-js';
import CheckoutForm from './checkout-form';
import { nextFetch } from 'src/utils/fetcher';
import { useNewPrices } from 'src/hooks/use-prices';
import { clientLogger } from 'src/utils/logger-client';
import { useTranslation } from 'react-i18next';
import type { newActiveSubscriptionTier } from 'types';

const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY || '');

export type CreatePaymentIntentQueries = {
    amount: string;
    currency: string;
};
export type CreatePaymentIntentResponse = {
    clientSecret?: string;
};

export const AddPaymentsSection = ({ priceTier }: { priceTier: newActiveSubscriptionTier }) => {
    const { i18n } = useTranslation();
    const newPrices = useNewPrices();

    const [clientSecret, setClientSecret] = useState<string>('');
    const [_loading, setLoading] = useState<boolean>(false);

    const selectedPrice = newPrices[priceTier];

    const fetchPaymentIntent = async () => {
        if (!selectedPrice) {
            throw new Error('no price selected yet');
        }
        setLoading(true);
        try {
            const body = {
                amount: parseInt(selectedPrice.prices.monthly) * 100, //zeroDecimal see https://stripe.com/docs/currencies#zero-decimal
                currency: selectedPrice.currency,
            };
            const data = await nextFetch('subscriptions/create-payment-intent', { method: 'POST', body });
            setClientSecret(data.clientSecret);
        } catch (error) {
            clientLogger(error, 'error');
        }
    };

    // Create PaymentIntent as soon as the page loads and the priceTier is selected
    useEffect(() => {
        fetchPaymentIntent();
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const options: StripeElementsOptions = {
        clientSecret,
        appearance: {
            theme: 'stripe',
            variables: {
                colorPrimary: '#8B5CF6', //primary-500 see tailwind.config.js
            },
        },
        locale: i18n.language.includes('en') ? 'en' : 'zh',
    };

    return (
        <div className="w-80 rounded shadow lg:w-[28rem]">
            {clientSecret && (
                <StripeElementsProvider stripe={stripePromise} options={options}>
                    <CheckoutForm />
                </StripeElementsProvider>
            )}
        </div>
    );
};

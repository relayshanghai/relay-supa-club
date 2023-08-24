import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import type { StripeElementsOptions } from '@stripe/stripe-js';
import { Elements as StripeElementsProvider } from '@stripe/react-stripe-js';
import CheckoutForm from './checkout-form';
import { nextFetch } from 'src/utils/fetcher';
import { usePrices } from 'src/hooks/use-prices';
import { clientLogger } from 'src/utils/logger-client';
import { useTranslation } from 'react-i18next';

const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY || '');

export type CreatePaymentIntentQueries = {
    amount: string;
    currency: string;
};
export type CreatePaymentIntentResponse = {
    clientSecret?: string;
};

export const AddPaymentsSection = () => {
    const [clientSecret, setClientSecret] = useState<string>('');
    const [_loading, setLoading] = useState<boolean>(false);

    const { i18n } = useTranslation();
    const prices = usePrices();
    //TODO: pass in the priceTier to replace 'discovery', delete console.log
    const selectedPrice = prices.monthly.discovery;

    const fetchPaymentIntent = async () => {
        setLoading(true);
        try {
            const body = {
                amount: selectedPrice,
                currency: 'cny',
            };
            const data = await nextFetch('subscriptions/create-payment-intent', { method: 'POST', body });
            setClientSecret(data.clientSecret);
        } catch (error) {
            clientLogger(error, 'error');
        }
    };

    // Create PaymentIntent as soon as the page loads
    useEffect(() => {
        fetchPaymentIntent();
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const options: StripeElementsOptions = {
        clientSecret,
        appearance: { theme: 'stripe' },
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

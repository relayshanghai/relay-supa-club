import { useEffect, useState } from 'react';
// import { loadStripe } from '@stripe/stripe-js';
// import { Elements } from '@stripe/react-stripe-js';
// import type { StripeElementsOptionsClientSecret } from '@stripe/stripe-js';
// import CheckoutForm from './checkout-form';
import { nextFetch } from 'src/utils/fetcher';
import { usePrices } from 'src/hooks/use-prices';
import { clientLogger } from 'src/utils/logger-client';

// const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
// const stripePromise = loadStripe(STRIPE_PUBLIC_KEY || '');

export type CreatePaymentIntentQueries = {
    amount: string;
    currency: string;
};
export type CreatePaymentIntentResponse = {
    clientSecret?: string;
};

export const AddPaymentsSection = () => {
    const [clientSecret, setClientSecret] = useState<string>();
    const [_loading, setLoading] = useState<boolean>(false);

    const prices = usePrices();
    //TODO: pass in the priceTier to replace 'discovery', delete console.log
    const selectedPrice = prices.monthly.discovery;
    //eslint-disable-next-line
    console.log(selectedPrice);

    const fetchPaymentIntent = async () => {
        setLoading(true);
        try {
            const res = await nextFetch('subscriptions/create-payment-intent', { method: 'POST' });
            if (!res.ok) throw new Error('Network response was not ok');
            // console.log(res);
            setClientSecret(clientSecret);
        } catch (error) {
            clientLogger(error, 'error');
        }
    };

    useEffect(() => {
        // Create PaymentIntent as soon as the page loads
        fetchPaymentIntent();
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // const appearance = {
    //     theme: 'stripe',
    // };
    // const options = {
    //     clientSecret,
    //     appearance,
    // };

    return (
        <div>
            <h1>Add Payment Elements here</h1>
            {/* {clientSecret && (
                <Elements stripe={stripePromise}>
                    <CheckoutForm />
                </Elements>
            )} */}
        </div>
    );
};

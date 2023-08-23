import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './checkout-form';
import { nextFetchWithQueries } from 'src/utils/fetcher';
import { STRIPE_PRICE_MONTHLY_DISCOVERY } from 'src/utils/api/stripe/constants';

const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY || '');

export const AddPaymentsSection = () => {
    const [clientSecret, setClientSecret] = useState<string>();
    const [_loading, setLoading] = useState<boolean>(false);

    const fetchPaymentIntent = async () => {
        setLoading(true);
        // handle error
        nextFetchWithQueries('create-payment-intent', {
            method: 'POST',
            body: JSON.stringify({ priceId: STRIPE_PRICE_MONTHLY_DISCOVERY }), //TODO: replace with selected priceId
        })
            .then((res) => res.json())
            .then((data) => setClientSecret(data.clientSecret));
    };

    useEffect(() => {
        // Create PaymentIntent as soon as the page loads
        fetchPaymentIntent();
    }, []);

    return (
        <div>
            {clientSecret && (
                <Elements stripe={stripePromise}>
                    <CheckoutForm />
                </Elements>
            )}
        </div>
    );
};

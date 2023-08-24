import { useEffect, useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Spinner } from '../icons';
import { Button } from '../button';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { useCompany } from 'src/hooks/use-company';

export default function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();
    const { t } = useTranslation();
    const { company } = useCompany();

    const [message, setMessage] = useState<string | null>(null);
    const [success, _setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formReady, setFormReady] = useState(false);
    const [redirect, _setRedirect] = useState(false);

    useEffect(() => {
        let timer: any;
        if (redirect) {
            timer = setTimeout(() => {
                router.push('/account');
            }, 1500);
        }
        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [redirect, router]);

    useEffect(() => {
        if (!stripe) {
            return;
        }
        const clientSecret = new URLSearchParams(window.location.search).get('payment_intent_client_secret');
        if (!clientSecret) {
            return;
        }

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            if (!paymentIntent) {
                throw new Error('no payment intent found');
            }
            switch (paymentIntent.status) {
                case 'succeeded':
                    setMessage('Payment succeeded!');
                    break;
                case 'processing':
                    setMessage('Your payment is processing.');
                    break;
                case 'requires_payment_method':
                    setMessage('Your payment was not successful, please try again.');
                    break;
                default:
                    setMessage('Something went wrong.');
                    break;
            }
        });
    }, [stripe]);

    const handleSubmit = async () => {
        if (!stripe || !elements || !company?.cus_id || !company.id) return;
        setIsLoading(true);
        //TODO: update subscription when submit
    };

    return (
        <div className="p-6">
            <PaymentElement
                id="payment-element"
                onChange={(e) => {
                    setFormReady(e.complete);
                }}
            />
            <Button
                disabled={isLoading || !stripe || !elements || !formReady}
                id="submit"
                className={`mt-10 w-full ${success ? '!border-green-500 !bg-green-500' : ''}`}
                onClick={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
            >
                {success ? (
                    t('account.subscription.upgradeSuccess')
                ) : isLoading ? (
                    <Spinner className="m-auto h-5 w-5 fill-primary-600 text-white" />
                ) : (
                    t('account.subscription.upgrade')
                )}
            </Button>
            {/* Show any error or success messages */}
            {message && <p className="mt-2 text-primary-500">{message}</p>}
        </div>
    );
}

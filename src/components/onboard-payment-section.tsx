import { Elements as StripeElementsProvider, useElements, useStripe } from '@stripe/react-stripe-js';
import type { StripeElementsOptions } from '@stripe/stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentElement } from '@stripe/react-stripe-js';

import { useCompany } from 'src/hooks/use-company';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { nextFetch } from 'src/utils/fetcher';
import { Spinner } from 'src/components/icons';
import { Button } from 'src/components/button';
import { useRouter } from 'next/router';
import { useSubscription } from 'src/hooks/use-subscription';

const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY || '');
export interface OnboardPaymentSectionProps {
    priceId: string;
}
const OnboardPaymentSectionInner = ({ priceId }: OnboardPaymentSectionProps) => {
    const { t } = useTranslation();

    const router = useRouter();
    const { company } = useCompany();
    const { subscription, refreshSubscription } = useSubscription();
    const elements = useElements();
    const stripe = useStripe();

    const [errorMessage, setErrorMessage] = useState();
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formReady, setFormReady] = useState(false);

    const handleError = (error: any) => {
        setLoading(false);
        setErrorMessage(error?.message || t('login.oopsSomethingWentWrong'));
    };

    const handleSuccess = () => {
        setSuccess(true);
        setLoading(false);
        setTimeout(() => {
            router.push('/account');
        }, 1500);
    };

    const pollForSubscriptionStatusUpdate = () => {
        if (subscription?.status === 'trialing' || subscription?.status === 'active') {
            return handleSuccess();
        } else {
            setTimeout(() => {
                refreshSubscription();
                pollForSubscriptionStatusUpdate();
            }, 1000);
        }
    };

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        if (!stripe || !elements || !company?.cus_id) return;
        setLoading(true);
        try {
            // Trigger form validation and wallet collection
            const { error: submitError } = await elements.submit();
            if (submitError) {
                handleError(submitError);
                return;
            }

            // Create the Subscription
            const { clientSecret } = await nextFetch('subscriptions/create-trial', {
                method: 'POST',
                body: {
                    customerId: company?.cus_id,
                    priceId: priceId,
                },
            });

            const { error } = await stripe.confirmPayment({
                elements,
                clientSecret,
                confirmParams: {
                    return_url: '/account', // won't redirect unless the payment requires an extra step
                },
                redirect: 'if_required',
            });

            if (error) {
                throw new Error(error.message);
            }
            pollForSubscriptionStatusUpdate();
        } catch (error) {
            handleError(error);
        }
    };
    const buttonDisabled = loading || !formReady || !company?.cus_id || !priceId || !stripe || !elements;

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement
                onChange={(e) => {
                    setFormReady(e.complete);
                }}
            />
            <Button
                disabled={buttonDisabled}
                className={`mt-10 w-full ${success ? '!border-green-500 !bg-green-500' : ''}`}
            >
                {success ? (
                    t('login.activateSuccess')
                ) : loading ? (
                    <Spinner className="m-auto h-5 w-5 fill-primary-600 text-white" />
                ) : (
                    t('login.activateTrial')
                )}
            </Button>
            {errorMessage && <p className="mt-2 text-red-600">{errorMessage}</p>}
        </form>
    );
};

export const OnboardPaymentSection = (props: OnboardPaymentSectionProps) => {
    const { i18n } = useTranslation();
    const options: StripeElementsOptions = {
        mode: 'subscription',
        amount: 0,
        currency: 'usd',
        locale: i18n.language.includes('en') ? 'en' : 'zh',
    };

    return (
        <StripeElementsProvider stripe={stripePromise} options={options}>
            <OnboardPaymentSectionInner {...props} />
        </StripeElementsProvider>
    );
};

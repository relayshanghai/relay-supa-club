import { Elements as StripeElementsProvider, useElements, useStripe } from '@stripe/react-stripe-js';
import type { StripeElementsOptions } from '@stripe/stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentElement } from '@stripe/react-stripe-js';

import { useCompany } from 'src/hooks/use-company';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useState } from 'react';
import { nextFetch, nextFetchWithQueries } from 'src/utils/fetcher';
import { Spinner } from 'src/components/icons';
import { Button } from 'src/components/button';
import { useRouter } from 'next/router';
import { useSubscription } from 'src/hooks/use-subscription';
import type {
    GetSetupIntentQueries,
    GetSetupIntentResponse,
    SubscriptionCreateTrialPostBody,
    SubscriptionCreateTrialPostResponse,
} from 'pages/api/subscriptions/create-trial';
import { clientLogger } from 'src/utils/logger-client';
import { useRudderstack } from 'src/hooks/use-rudderstack';
import { SIGNUP_WIZARD } from 'src/utils/rudderstack/event-names';

const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY || '');
export interface OnboardPaymentSectionProps {
    priceId: string;
}
const OnboardPaymentSectionInner = ({ priceId }: OnboardPaymentSectionProps) => {
    const { t } = useTranslation();
    const { trackEvent } = useRudderstack();

    const router = useRouter();
    const { company } = useCompany();
    const { subscription } = useSubscription();
    const elements = useElements();
    const stripe = useStripe();

    const [errorMessage, setErrorMessage] = useState();
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formReady, setFormReady] = useState(false);
    const [redirect, setRedirect] = useState(false);

    const handleError = (error: any) => {
        setLoading(false);
        setErrorMessage(error?.message || t('login.oopsSomethingWentWrong'));
    };

    const handleSuccess = useCallback(() => {
        setSuccess(true);
        setLoading(false);
        setRedirect(true);
        // Set success, and then wait for a second before redirecting to account page.
        // This can allow some time for the button to show the success state.
    }, []);

    useEffect(() => {
        let timer: any;
        if (redirect) {
            timer = setTimeout(() => {
                router.push('/boostbot');
            }, 1500);
        }
        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [redirect, router]);

    useEffect(() => {
        if (subscription?.status === 'trial' || subscription?.status === 'active') {
            return handleSuccess();
        }
    }, [subscription?.status, handleSuccess]);

    const handleSubmit = async () => {
        if (!stripe || !elements || !company?.cus_id || !company.id) return;
        setLoading(true);
        try {
            const { error, setupIntent } = await stripe.confirmSetup({
                elements,
                confirmParams: {
                    return_url: window.location.href,
                },
                redirect: 'if_required',
                // TODO: set up the wizard to detect the return url params, and then set current step to this one, and trigger the `subscriptions/create-trial` POST call.
                // https://toil.kitemaker.co/0JhYl8-relayclub/8sxeDu-v2_project/items/501
                // Right now this shouldn't be a problem because we are just accepting cards, and cards should all just resolve in one step.
            });
            if (error) {
                return handleError(error);
            }
            if (!setupIntent || setupIntent.status !== 'succeeded') {
                clientLogger(setupIntent, 'error');
                return handleError('Something went wrong with the payment');
            }
            const body: SubscriptionCreateTrialPostBody = {
                customerId: company.cus_id,
                companyId: company.id,
                priceId: priceId,
                paymentMethodId:
                    typeof setupIntent?.payment_method === 'string'
                        ? setupIntent.payment_method
                        : setupIntent?.payment_method?.id,
            };
            const { subscription } = await nextFetch<SubscriptionCreateTrialPostResponse>(
                'subscriptions/create-trial',
                {
                    method: 'POST',
                    body,
                },
            );
            if (subscription?.status !== 'trialing') {
                return handleError('Something went wrong activating your subscription');
            }
            trackEvent(SIGNUP_WIZARD('step-5, start free trial'), {
                customerId: company.cus_id,
                companyId: company.id,
                status: subscription?.status,
                priceId: priceId,
            });
        } catch (error) {
            handleError(error);
        }
    };
    const buttonDisabled = loading || !formReady || !company?.cus_id || !priceId || !stripe || !elements;

    return (
        <div>
            <PaymentElement
                onChange={(e) => {
                    setFormReady(e.complete);
                }}
            />
            <Button
                disabled={buttonDisabled}
                className={`mt-10 w-full ${success ? '!border-green-500 !bg-green-500' : ''}`}
                onClick={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
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
        </div>
    );
};

export const OnboardPaymentSection = (props: OnboardPaymentSectionProps) => {
    const { company } = useCompany();
    const { i18n } = useTranslation();
    const [clientSecret, setClientSecret] = useState<string>();
    const [clientSecretError, setClientSecretError] = useState<string>();

    const options: StripeElementsOptions = {
        locale: i18n.language?.includes('en') ? 'en' : 'zh',
        clientSecret,
    };

    const fetchClientSecret = useCallback(async () => {
        setClientSecretError(undefined);
        const { clientSecret } = await nextFetchWithQueries<GetSetupIntentQueries, GetSetupIntentResponse>(
            'subscriptions/create-trial',
            {
                customerId: company?.cus_id || '',
            },
        );
        if (clientSecret) {
            setClientSecret(clientSecret);
            setClientSecretError(undefined);
        } else {
            setClientSecretError('Something went wrong fetching the client secret');
        }
    }, [company?.cus_id]);

    useEffect(() => {
        if (company?.cus_id) {
            fetchClientSecret();
        }
    }, [company?.cus_id, fetchClientSecret]);

    return clientSecret ? (
        <StripeElementsProvider stripe={stripePromise} options={options}>
            <OnboardPaymentSectionInner {...props} />
        </StripeElementsProvider>
    ) : (
        <div className="min-w-[15rem]">
            {clientSecretError ? (
                <p className="mt-2 text-red-600">{clientSecretError}</p>
            ) : (
                <Spinner className="m-auto h-5 w-5 fill-primary-600 text-white" />
            )}
        </div>
    );
};

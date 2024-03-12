import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Spinner } from '../icons';
import { Button } from '../button';
import { useTranslation } from 'react-i18next';
import { useCompany } from 'src/hooks/use-company';
import { clientLogger } from 'src/utils/logger-client';
import type { NewRelayPlan } from 'types';
import { useRudderstack, useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { PAYMENT_PAGE } from 'src/utils/rudderstack/event-names';
import {
    upgradeSubscriptionWithPaymentIntent,
    cancelSubscriptionWithSubscriptionId,
} from 'src/utils/api/stripe/handle-subscriptions';
import { InputPaymentInfo } from 'src/utils/analytics/events/onboarding/input-payment-info';
import { PayForUpgradedPlan } from 'src/utils/analytics/events';
import { useHostname } from 'src/utils/get-host';
import useLocalStorage from 'src/hooks/use-localstorage';
import { STRIPE_SECRET_RESPONSE } from 'src/hooks/use-subscription-v2';
import { useRouter } from 'next/router';
import { StripeCardCvcElement, StripeCardElement } from '@stripe/stripe-js';

const CheckoutFormV2 = ({
    selectedPrice,
    batchId,
    couponId,
}: {
    selectedPrice: NewRelayPlan;
    batchId: number;
    couponId?: string;
}) => {
    const {
        query: { subscriptionId },
    } = useRouter();
    const stripe = useStripe();
    const elements = useElements();
    const { t } = useTranslation();
    const { company } = useCompany();
    const { trackEvent } = useRudderstack();
    const { track } = useRudderstackTrack();
    const [isLoading, setIsLoading] = useState(false);
    const [formReady, setFormReady] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const [stripeSecretResponse] = useLocalStorage(STRIPE_SECRET_RESPONSE, { clientSecret: '', ipAddress: '' });

    const handleError = (error: any) => {
        setIsLoading(false);
        setErrorMessage(error.message);
    };

    const handleSubmit = async () => {
        trackEvent(PAYMENT_PAGE('Click on Upgrade'), { plan: selectedPrice });
        if (!stripe || !elements || !company?.cus_id || !company.id) return;
        setIsLoading(true);

        // Trigger form validation and wallet collection
        const { error: submitError } = await elements.submit();

        if (submitError) {
            handleError(submitError);
            return;
        }

        try {
            console.log('elements', elements);
            const { error, paymentIntent } = await stripe.confirmCardPayment(stripeSecretResponse.clientSecret, {
                return_url: `${window.location.origin}/subscriptions/${subscriptionId}/credit-card/callbacks`,
                payment_method: {
                    card: elements.getElement('card') as StripeCardElement,
                },
            });
            console.log('error', error);
            console.log('paymentIntent', paymentIntent);
        } catch (error) {
            console.log('asd', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form
            className="p-6"
            onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }}
        >
            <PaymentElement
                id="payment-element"
                onChange={({ complete, empty, value }) => {
                    console.log({ complete, empty, value });
                    track(InputPaymentInfo, {
                        complete,
                        empty,
                        type: value.type,
                        batch_id: batchId,
                    });
                    setFormReady(complete);
                }}
            />

            <Button disabled={isLoading || !stripe || !elements || !formReady} className="mt-10 w-full" type="submit">
                {isLoading ? (
                    <Spinner className="m-auto h-5 w-5 fill-primary-600 text-white" />
                ) : (
                    t('account.subscription.upgrade')
                )}
            </Button>
            {/* Show any error or success messages */}
            {errorMessage && <p className="mt-2 text-xs text-red-500">{errorMessage}</p>}
        </form>
    );
};

export default CheckoutFormV2;

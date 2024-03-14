import { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Spinner } from '../icons';
import { Button } from '../button';
import { useTranslation } from 'react-i18next';
import type { NewRelayPlan } from 'types';
import { useRudderstack, useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { PAYMENT_PAGE } from 'src/utils/rudderstack/event-names';
import { InputPaymentInfo } from 'src/utils/analytics/events/onboarding/input-payment-info';
import { useLocalStorage } from 'src/hooks/use-localstorage';
import { STRIPE_SUBSCRIBE_RESPONSE, stripeSubscribeResponseInitialValue } from 'src/hooks/use-subscription-v2';
import { useRouter } from 'next/router';
import { PayForUpgradedPlan } from 'src/utils/analytics/events';
import awaitToError from 'src/utils/await-to-error';

const CheckoutFormV2 = ({
    selectedPrice,
    batchId,
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
    const { trackEvent } = useRudderstack();
    const { track } = useRudderstackTrack();
    const [isLoading, setIsLoading] = useState(false);
    const [formReady, setFormReady] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const [stripeSubscribeResponse, setStripeSubscribeResponse] = useLocalStorage(
        STRIPE_SUBSCRIBE_RESPONSE,
        stripeSubscribeResponseInitialValue,
    );

    const handleError = (error: any) => {
        setIsLoading(false);
        setErrorMessage(error.message);
    };

    const handleCardPayment = async () => {
        if (!stripe || !elements) return;

        const { error, paymentIntent } = await stripe.confirmCardPayment(stripeSubscribeResponse.clientSecret, {
            payment_method: {
                card: elements.getElement('card') as any,
            },
        });

        if (error) throw error;
        setStripeSubscribeResponse(stripeSubscribeResponseInitialValue);
        const returnUrlParams = new URLSearchParams();
        returnUrlParams.append('payment_intent', paymentIntent.id);
        returnUrlParams.append('payment_intent_client_secret', paymentIntent.client_secret as string);
        returnUrlParams.append('redirect_status', 'succeeded');
        return `${window.location.origin}/subscriptions/${subscriptionId}/credit-card/callbacks?${returnUrlParams}`;
    };

    const handleSubmit = async () => {
        trackEvent(PAYMENT_PAGE('Click on Upgrade'), { plan: selectedPrice });
        if (!elements) return;

        setIsLoading(true);

        // Trigger form validation and wallet collection
        const { error: submitError } = await elements.submit();

        if (submitError) {
            handleError(submitError);
            return;
        }

        let err = null,
            returnUrl = null;
        [err, returnUrl] = await awaitToError(handleCardPayment());

        if (err) {
            track(PayForUpgradedPlan, {
                successful: false,
                batch_id: batchId,
                stripe_error_code: (err as any).code,
            });
            handleError(err);
            return;
        } else {
            track(PayForUpgradedPlan, {
                successful: true,
                batch_id: batchId,
            });
        }
        setIsLoading(false);
        window.location.href = returnUrl as string;
    };

    return (
        <form
            className="p-6"
            onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }}
        >
            <CardElement
                id="card-element"
                onChange={({ complete, empty }) => {
                    track(InputPaymentInfo, {
                        complete,
                        empty,
                        type: 'card',
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

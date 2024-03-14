import { Button } from '../button';
import { useState } from 'react';
import { Spinner } from '../icons';
import type { NewRelayPlan } from 'types';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useRudderstack, useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { useLocalStorage } from 'src/hooks/use-localstorage';
import { STRIPE_SUBSCRIBE_RESPONSE, stripeSubscribeResponseInitialValue } from 'src/hooks/use-subscription-v2';
import { InputPaymentInfo } from 'src/utils/analytics/events/onboarding/input-payment-info';
import { PAYMENT_PAGE } from 'src/utils/rudderstack/event-names';
import awaitToError from 'src/utils/await-to-error';
import { PayForUpgradedPlan } from 'src/utils/analytics/events';

export default function AlipayPortalV2({
    selectedPrice,
    batchId,
}: {
    selectedPrice: NewRelayPlan;
    batchId: number;
    couponId?: string;
}) {
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

    const handleAlipayPayment = async () => {
        if (!stripe) return;
        const { error } = await stripe.confirmAlipayPayment(stripeSubscribeResponse.clientSecret, {
            return_url: `${window.location.origin}/subscriptions/${subscriptionId}/alipay/callbacks`,
            mandate_data: {
                customer_acceptance: {
                    type: 'online',
                    online: {
                        ip_address: stripeSubscribeResponse.ipAddress,
                        user_agent: window.navigator.userAgent,
                    },
                },
            },
            save_payment_method: true,
        });
        if (error) throw error;
        setStripeSubscribeResponse(stripeSubscribeResponseInitialValue);
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

        let err = null;
        [err] = await awaitToError(handleAlipayPayment());

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
                onChange={({ complete, empty }) => {
                    track(InputPaymentInfo, {
                        complete,
                        empty,
                        type: 'alipay',
                        batch_id: batchId,
                    });
                    setFormReady(complete);
                }}
            />

            <Button disabled={isLoading || !stripe || !elements || !formReady} className="w-full" type="submit">
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
}

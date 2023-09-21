import { useState } from 'react';
import { useStripe, useElements, PaymentElement, CardElement } from '@stripe/react-stripe-js';
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
    updateSubscriptionStatusAndUsages,
} from 'src/utils/api/stripe/handle-subscriptions';
import { InputPaymentInfo } from 'src/utils/analytics/events/onboarding/input-payment-info';

export default function CheckoutForm({ selectedPrice }: { selectedPrice: NewRelayPlan }) {
    const stripe = useStripe();
    const elements = useElements();
    const { t } = useTranslation();
    const { company } = useCompany();
    const { trackEvent } = useRudderstack();
    const { track } = useRudderstackTrack();
    const [isLoading, setIsLoading] = useState(false);
    const [formReady, setFormReady] = useState(false);
    const [errorMessage, setErrorMessage] = useState();

    const handleError = (error: any) => {
        setIsLoading(false);
        setErrorMessage(error.message);
    };

    const handleSubmit = async () => {
        if (!stripe || !elements || !company?.cus_id || !company.id) return;
        setIsLoading(true);

        // Trigger form validation and wallet collection
        const { error: submitError } = await elements.submit();

        if (submitError) {
            handleError(submitError);
            return;
        }
        try {
            const priceId = selectedPrice.priceIds.monthly;

            const {
                clientSecret,
                subscriptionId: newSubscriptionId,
                oldSubscriptionId,
            } = await upgradeSubscriptionWithPaymentIntent(company.id, company.cus_id, priceId);
            console.log(
                'Upgrade and create new subscription ===============>',
                { newSubscriptionId },
                { oldSubscriptionId },
            );

            //confirm the payment intent form the created subscription
            const { error } = await stripe.confirmPayment({
                elements,
                clientSecret,
                confirmParams: {
                    return_url: 'http://localhost:3000/payments/success',
                    // return_url: 'https://app.relay.club/payments/success',
                },
            });
            //if has error, handle error, else cancel the old subscription and update the subscription status
            if (error) {
                handleError(error);
            } else {
                //if created successfully, cancel the currentSubscription
                console.log('Cancel previous Subscription ===============>');
                await cancelSubscriptionWithSubscriptionId(oldSubscriptionId);
                console.log('Update usages and status ===============>');
                //and update subscription status with new subscription id and usages
                await updateSubscriptionStatusAndUsages(company.id, newSubscriptionId, priceId);
            }

            trackEvent(PAYMENT_PAGE('Click on Upgrade'), { plan: selectedPrice });
        } catch (error) {
            clientLogger(error, 'error');
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
                    track(InputPaymentInfo, {
                        complete,
                        empty,
                        type: value.type,
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
}

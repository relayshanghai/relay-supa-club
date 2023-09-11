import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Spinner } from '../icons';
import { Button } from '../button';
import { useTranslation } from 'react-i18next';
import { useCompany } from 'src/hooks/use-company';
import { nextFetch } from 'src/utils/fetcher';
import type { SubscriptionUpgradePostResponse } from 'pages/api/subscriptions/upgrade';
import { clientLogger } from 'src/utils/logger-client';
import type { NewRelayPlan } from 'types';
import { useRudderstack } from 'src/hooks/use-rudderstack';
import { PAYMENT_PAGE } from 'src/utils/rudderstack/event-names';

export default function CheckoutForm({ selectedPrice }: { selectedPrice: NewRelayPlan }) {
    const stripe = useStripe();
    const elements = useElements();
    const { t } = useTranslation();
    const { company } = useCompany();
    const { trackEvent } = useRudderstack();

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

        // Create the subscription
        try {
            const body = {
                companyId: company.id,
                customer: company.cus_id,
                priceId: selectedPrice.priceIds.monthly,
            };

            const { clientSecret } = await nextFetch<SubscriptionUpgradePostResponse>('/subscriptions/upgrade', {
                method: 'POST',
                body,
            });

            // Confirm the Intent using the details collected by the Payment Element
            const { error } = await stripe.confirmPayment({
                elements,
                clientSecret,
                confirmParams: {
                    return_url: 'https://app.relay.club/payments/success',
                },
            });

            if (error) {
                handleError(error);
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
                onChange={(e) => {
                    setFormReady(e.complete);
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

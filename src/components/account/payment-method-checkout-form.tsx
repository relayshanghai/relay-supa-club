import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Spinner } from '../icons';
import { Button } from '../button';
import { useTranslation } from 'react-i18next';
import { type PaymentMethodResponse, useSubscriptionV2 } from 'src/hooks/use-subscription-v2';
import toast from 'react-hot-toast';

export default function CheckoutForm({ onCompletion }: { onCompletion: () => void }) {
    const stripe = useStripe();
    const elements = useElements();

    const [errorMessage, setErrorMessage] = useState();

    const { addPaymentMethod, refreshPaymentMethodInfo } = useSubscriptionV2();

    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [formReady, setFormReady] = useState(false);

    const handleError = (error: any) => {
        setIsLoading(false);
        setErrorMessage(error.message);
    };

    const handleSubmit = async (event: any) => {
        if (!stripe || !elements) {
            return;
        }
        event.preventDefault();

        setIsLoading(true);

        // Trigger form validation and wallet collection
        const { error: submitError } = await elements.submit();
        if (submitError) {
            handleError(submitError);
            return;
        }

        // Create the PaymentMethod using the details collected by the Payment Element
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            elements,
        });
        if (!paymentMethod) {
            handleError(error);
            return;
        }
        const paymentMethodSetupIntent = await addPaymentMethod({
            paymentMethodId: paymentMethod.id,
            paymentMethodType: paymentMethod?.type as 'card' | 'alipay',
        });

        if (!paymentMethodSetupIntent || !paymentMethodSetupIntent.client_secret) {
            setIsLoading(false);
            toast.error(t('account.subscription.error'));
            return;
        }
        if (paymentMethodSetupIntent.status === 'requires_action') {
            if (!stripe) return;
            const { error } = await stripe.handleNextAction({
                clientSecret: paymentMethodSetupIntent.client_secret,
            });
            if (error) {
                handleError(error);
                return;
            }
        }

        if (error) {
            // This point is only reached if there's an immediate error when
            // creating the PaymentMethod. Show the error to your customer (for example, payment details incomplete)
            handleError(error);
            return;
        }
        setIsLoading(false);
        refreshPaymentMethodInfo(
            (prev) =>
                ({
                    ...prev,
                    paymentMethods: prev?.paymentMethods ? [paymentMethod, ...prev.paymentMethods] : [paymentMethod],
                } as PaymentMethodResponse),
        );
        toast.success(t('account.subscription.success'));
        onCompletion();
    };

    return (
        <form className="p-6" onSubmit={handleSubmit}>
            <PaymentElement
                id="payment-element"
                onChange={({ complete }) => {
                    setFormReady(complete);
                }}
            />
            <Button disabled={isLoading || !stripe || !elements || !formReady} className="mt-10 w-full" type="submit">
                {isLoading ? <Spinner className="m-auto h-5 w-5 fill-primary-600 text-white" /> : 'Add Payment Method'}
            </Button>
            {/* Show any error or success messages */}
            {errorMessage && <p className="mt-2 text-xs text-red-500">{errorMessage}</p>}
        </form>
    );
}

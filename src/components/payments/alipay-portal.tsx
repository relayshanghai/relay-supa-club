import { createSetupIntentForAlipay } from 'src/utils/api/stripe/handle-subscriptions';
import { Button } from '../button';
import { useCompany } from 'src/hooks/use-company';
import { loadStripe } from '@stripe/stripe-js';
import { handleError } from 'src/utils/utils';
import type Stripe from 'stripe';

const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY || '');

export default function AlipayPortal() {
    const { company } = useCompany();

    //handle any next actions https://stripe.com/docs/payments/finalize-payments-on-the-server?platform=web&type=setup#next-actions
    const handleServerResponse = async (setupIntent: Stripe.SetupIntent) => {
        const stripe = await stripePromise;
        if (!stripe) return;
        if (!setupIntent || !setupIntent.client_secret) return;
        // redirect to Alipay website
        if (setupIntent.status === 'requires_action') {
            // Use Stripe.js to handle required next action
            const { error: errorConfirm, setupIntent: setUpIntentConfirm } = await stripe.handleNextAction({
                clientSecret: setupIntent.client_secret,
            });

            if (errorConfirm) {
                handleError(errorConfirm);
                return;
            } else {
                console.log('Success!!!!!!!');
                // Show a success message to your customer
                // handlePaymentIntent(paymentIntentConfirm);
            }
        }
    };

    const handleSubmit = async () => {
        // create a setup intent with payment method type alipay, and current customer id
        if (!company?.cus_id || !company.id) return;

        const stripe = await stripePromise;

        if (!stripe) return;

        try {
            const setupIntent = await createSetupIntentForAlipay(company.cus_id);

            handleServerResponse(setupIntent);
            //monitor webhooks

            // if setup_intent.succeeded, set the payment method to the customer default payment method

            // create a subscription with the setup intent id

            // if setup_intent.setup_failed webhook, redirect back to payment page with error message
        } catch (error) {
            console.log('error============>', error);

            // clientLogger(error, 'error');
        }
    };

    return (
        <>
            <div className="mb-2 p-6">
                <Button className="w-full" onClick={handleSubmit}>
                    Proceed to Alipay
                </Button>
            </div>
        </>
    );
}

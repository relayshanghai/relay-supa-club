import { createSetupIntentForAlipay } from 'src/utils/api/stripe/handle-subscriptions';
import { Button } from '../button';
import { useCompany } from 'src/hooks/use-company';
import { loadStripe } from '@stripe/stripe-js';
import { handleError } from 'src/utils/utils';
import type Stripe from 'stripe';
import { useState } from 'react';
import { Spinner } from '../icons';
import type { NewRelayPlan } from 'types';
import { clientLogger } from 'src/utils/logger-client';

const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY || '');

export default function AlipayPortal({ selectedPrice }: { selectedPrice: NewRelayPlan }) {
    const { company } = useCompany();
    const [isLoading, setIsLoading] = useState(false);
    console.log(selectedPrice);
    //handle any next actions https://stripe.com/docs/payments/finalize-payments-on-the-server?platform=web&type=setup#next-actions
    const handleServerResponse = async (setupIntent: Stripe.SetupIntent) => {
        const stripe = await stripePromise;
        if (!stripe) return;
        if (!setupIntent || !setupIntent.client_secret) return;
        // redirect to Alipay website
        if (setupIntent.status === 'requires_action') {
            // Use Stripe.js to handle required next action
            const { error: errorConfirm } = await stripe.handleNextAction({
                clientSecret: setupIntent.client_secret,
            });

            if (errorConfirm) {
                handleError(errorConfirm);
                return;
            }
        }
    };

    const handleSubmit = async () => {
        // create a setup intent with payment method type alipay, and current customer id
        if (!company?.cus_id || !company.id) return;
        const stripe = await stripePromise;
        if (!stripe) return;
        setIsLoading(true);
        try {
            const priceId = selectedPrice.priceIds.monthly;
            const currency = selectedPrice.currency;
            const setupIntent = await createSetupIntentForAlipay(company.id, company.cus_id, priceId, currency);

            await handleServerResponse(setupIntent);
        } catch (error) {
            //eslint-disable-next-line
            clientLogger(error, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="mb-2 p-6">
                <Button className="w-full" onClick={handleSubmit}>
                    {isLoading ? (
                        <Spinner className="m-auto h-5 w-5 fill-primary-600 text-white" />
                    ) : (
                        'Enable Alipay Agreement'
                    )}
                </Button>
            </div>
        </>
    );
}

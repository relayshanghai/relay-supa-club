import { createSetupIntentForAlipay } from 'src/utils/api/stripe/handle-subscriptions';
import { Button } from '../button';
import { useCompany } from 'src/hooks/use-company';
import { loadStripe } from '@stripe/stripe-js';
import { handleError } from 'src/utils/utils';
import type Stripe from 'stripe';
import { useCallback, useState } from 'react';
import { Spinner } from '../icons';
import type { NewRelayPlan } from 'types';
import { clientLogger } from 'src/utils/logger-client';
import type { ActiveSubscriptionTier } from 'src/hooks/use-prices';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';

const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY || '');

export default function AlipayPortal({
    selectedPrice,
    priceTier,
    couponId,
    paymentMethodId,
}: {
    selectedPrice: NewRelayPlan;
    priceTier: ActiveSubscriptionTier;
    couponId?: string;
    // if paymentMethodId is provided, user should not rescan the QR code of ALIPAY
    paymentMethodId?: string;
}) {
    const router = useRouter();
    const { company } = useCompany();
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();
    //handle any next actions https://stripe.com/docs/payments/finalize-payments-on-the-server?platform=web&type=setup#next-actions
    const handleServerResponse = useCallback(
        async (setupIntent: Stripe.SetupIntent) => {
            const stripe = await stripePromise;
            if (!stripe) return;
            if (!setupIntent || !setupIntent.client_secret) return;
            // redirect to Alipay website
            if (setupIntent.status === 'requires_action') {
                // Use Stripe.js to handle required next action
                const { error } = await stripe.handleNextAction({
                    clientSecret: setupIntent.client_secret,
                });
                if (error) {
                    handleError(error);
                    return;
                }
            }
            // if succeeded, means payment intent has already been initiated before and direct subscription initiated, redirect to dashboard
            if (setupIntent.status === 'succeeded') {
                router.push('/dashboard');
            }
        },
        [router],
    );

    const handleSubmit = useCallback(async () => {
        // create a setup intent with payment method type alipay, and current customer id
        if (!company?.cus_id || !company.id || isLoading) return;
        const stripe = await stripePromise;
        if (!stripe) return;
        setIsLoading(true);
        try {
            const priceId = selectedPrice.priceIds.monthly;
            const currency = selectedPrice.currency;
            const setupIntent = await createSetupIntentForAlipay({
                priceId,
                currency,
                priceTier,
                couponId,
                paymentMethodId,
            });
            await handleServerResponse(setupIntent);
        } catch (error) {
            clientLogger(error, 'error');
        } finally {
            setIsLoading(false);
        }
    }, [
        company?.cus_id,
        company?.id,
        isLoading,
        selectedPrice,
        priceTier,
        couponId,
        paymentMethodId,
        handleServerResponse,
    ]);

    return (
        <>
            <div className="mb-2 p-6">
                <Button className="w-full" onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? (
                        <Spinner className="m-auto h-5 w-5 fill-primary-600 text-white" />
                    ) : (
                        t('account.enableAlipay')
                    )}
                </Button>
            </div>
        </>
    );
}

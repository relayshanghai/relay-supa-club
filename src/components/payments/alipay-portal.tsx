import { createSetupIntentForAlipay } from 'src/utils/api/stripe/handle-subscriptions';
import { Button } from '../button';
import { useCompany } from 'src/hooks/use-company';
import { APP_URL } from 'src/constants';
import { loadStripe } from '@stripe/stripe-js';

const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY || '');

export default function AlipayPortal() {
    const { company } = useCompany();

    const handleSubmit = async () => {
        // create a setup intent with payment method type alipay, and current customer id
        if (!company?.cus_id || !company.id) return;

        const stripe = await stripePromise;

        if (!stripe) return;

        try {
            console.log('create a payment intent with customer ======>', company.cus_id);

            const { setupIntent } = await createSetupIntentForAlipay(company.cus_id);

            console.log('get the setupIntent back =======>', setupIntent.client_secret);

            // const { error } = await stripe.confirmAlipayPayment(setupIntent.client_secret, {
            //     return_url: `${APP_URL}/payments/confirm-alipay`,
            // });

            // if (error) {
            //     console.log('error============>', error);
            // }
        } catch (error) {
            console.log('error============>', error);

            // clientLogger(error, 'error');
        }

        // redirect to Alipay website

        //monitor webhooks

        // if setup_intent.succeeded, set the payment method to the customer default payment method

        // create a subscription with the setup intent id

        // if setup_intent.setup_failed webhook, redirect back to payment page with error message
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

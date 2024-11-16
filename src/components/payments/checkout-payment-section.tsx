import { loadStripe } from '@stripe/stripe-js';
import { Elements as StripeElementsProvider, useElements, useStripe } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { Button } from '../button';
import { Spinner } from '../icons';
import awaitToError from 'src/utils/await-to-error';
import { useLocalSelectedTopupBundle, useTopUpPlan } from 'src/hooks/use-topups';
import { type TopUpPrices, type TopUpSizes } from 'src/hooks/use-topups';
import { useCompany } from 'src/hooks/use-company';
import { useSubscription } from 'src/hooks/v2/use-subscription';

const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY || '');

const PaymentComponent = () => {
    const [selectedTopupBundle, setSelectedTopupBundle] = useLocalSelectedTopupBundle();
    const stripe = useStripe();
    const { company } = useCompany();
    const { topUpPrices } = useTopUpPlan();
    const { defaultPaymentMethod, paymentMethods } = useSubscription();
    const [isLoading, setIsLoading] = useState(false);
    const [, setErrorMessage] = useState('');

    const currentPrice =
        topUpPrices?.[selectedTopupBundle.topupPrice as TopUpSizes]?.[company?.currency as keyof TopUpPrices]?.price;
    const planName = selectedTopupBundle.topupPrice?.toUpperCase();

    const currentPaymentMethod = paymentMethods?.find((method) => method.id === defaultPaymentMethod);

    const handleError = (error: any) => {
        setIsLoading(false);
        setErrorMessage(error.message);
    };

    const handleCardPayment = async () => {
        if (!stripe) return;
        const { error } = await stripe.confirmPayment({
            clientSecret: selectedTopupBundle.clientSecret as string,
            confirmParams: {
                return_url: `${window.location.origin}/checkout/callbacks`,
            },
        });
        if (error) throw error;
    };

    const handleAlipayPayment = async () => {
        if (!stripe) return;
        const { error } = await stripe.confirmAlipayPayment(selectedTopupBundle.clientSecret as string, {
            return_url: `${window.location.origin}/checkout/callbacks`,
            mandate_data: {
                customer_acceptance: {
                    type: 'online',
                    online: {
                        ip_address: selectedTopupBundle.ipAddress,
                        user_agent: window.navigator.userAgent,
                    },
                },
            },
            save_payment_method: false,
        });
        if (error) throw error;
    };

    const handlePayment = async () => {
        setIsLoading(true);

        let err = null;
        const paymentType = currentPaymentMethod?.type;
        if (paymentType === 'card') {
            [err] = await awaitToError(handleCardPayment());
        } else if (paymentType === 'alipay') {
            [err] = await awaitToError(handleAlipayPayment());
        }

        if (err) {
            handleError(err);
            return;
        }
        setIsLoading(false);
    };

    return (
        <>
            <div className="rounded shadow ">
                {/* Your order text */}
                <div className="border-b bg-white p-4">
                    <h2 className="text-lg font-bold text-gray-800">Your order</h2>
                </div>
                {/* line */}
                <div className="border-b bg-white p-4">
                    <div className="flex justify-between">
                        <span className="flex w-52 space-x-1">
                            <strong>{planName}</strong>
                            <p className="text-gray-800">Bundle</p>
                        </span>
                        <p className="text-gray-800">
                            {currentPrice} {company?.currency.toUpperCase()}
                        </p>
                    </div>
                </div>
                <div className="border-b bg-white p-4">
                    <div className="flex justify-between">
                        <p className="text-xl font-semibold text-gray-800">Total</p>
                        <p className="text-xl font-semibold text-gray-800">
                            {currentPrice} {company?.currency.toUpperCase()}
                        </p>
                    </div>
                </div>
            </div>
            <Button data-testid="pay-button" className="mt-10 w-full" type="button" onClick={() => handlePayment()}>
                {isLoading ? <Spinner className="m-auto h-5 w-5 fill-primary-600 text-white" /> : 'Pay'}
            </Button>
        </>
    );
};

export const CheckoutPaymentsSection = () => {
    const [, setCouponId] = useState<string | undefined>(undefined);

    return (
        <div className="w-80 lg:w-[28rem]">
            {/* <PromoCodeSectionV2 setCouponId={setCouponId} /> */}
            <StripeElementsProvider stripe={stripePromise}>
                <PaymentComponent />
            </StripeElementsProvider>
        </div>
    );
};

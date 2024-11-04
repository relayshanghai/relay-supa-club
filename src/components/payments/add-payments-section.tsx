import { loadStripe } from '@stripe/stripe-js';
import { Elements as StripeElementsProvider, useStripe } from '@stripe/react-stripe-js';
import { useLocalStoragePaymentPeriod, useLocalStorageSelectedPrice } from 'src/hooks/use-prices';
import { useState } from 'react';
import { PromoCodeSectionV2 } from './promo-code-section-v2';
import {
    stripeSubscribeResponseInitialValue,
    useLocalStorageSubscribeResponse,
    useSubscription,
} from 'src/hooks/v2/use-subscription';
import { Button } from '../button';
import { Spinner } from '../icons';
import { useRouter } from 'next/router';
import awaitToError from 'src/utils/await-to-error';

const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY || '');

const PaymentComponent = () => {
    const {
        query: { subscriptionId },
    } = useRouter();
    const stripe = useStripe();
    const { defaultPaymentMethod, paymentMethods } = useSubscription();
    const [selectedPrice] = useLocalStorageSelectedPrice();
    const [paymentPeriod] = useLocalStoragePaymentPeriod();
    const [stripeSubscribeResponse, setStripeSubscribeResponse] = useLocalStorageSubscribeResponse();
    const [isLoading, setIsLoading] = useState(false);
    const [, setErrorMessage] = useState('');

    const currentPrices = +selectedPrice.prices[paymentPeriod.period];
    const planName = stripeSubscribeResponse.plan.charAt(0).toUpperCase() + stripeSubscribeResponse.plan.slice(1);

    const currentPaymentMethod = paymentMethods?.find((method) => method.id === defaultPaymentMethod);

    const handleError = (error: any) => {
        setIsLoading(false);
        setErrorMessage(error.message);
    };

    const handleCardPayment = async () => {
        if (!stripe) return;
        const { error } = await stripe.confirmPayment({
            clientSecret: stripeSubscribeResponse.clientSecret,
            confirmParams: {
                return_url: `${window.location.origin}/subscriptions/${subscriptionId}/credit-card/callbacks`,
            },
        });
        if (error) throw error;
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
    };

    const handleSubmit = async () => {
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
        } else {
            setStripeSubscribeResponse(stripeSubscribeResponseInitialValue);
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
                        <p className="text-gray-800">{planName} Subscription</p>
                        <p className="text-gray-800">
                            {currentPrices} {selectedPrice.currency.toUpperCase()}
                        </p>
                    </div>
                    <div className="flex justify-between">
                        <p className="text-gray-800">Discount</p>
                        <p className="text-gray-800">0 {selectedPrice.currency.toUpperCase()}</p>
                    </div>
                </div>
                <div className="border-b bg-white p-4">
                    <div className="flex justify-between">
                        <p className="text-xl font-semibold text-gray-800">Total</p>
                        <p className="text-xl font-semibold text-gray-800">
                            {currentPrices} {selectedPrice.currency.toUpperCase()}
                        </p>
                    </div>
                </div>
            </div>
            <Button data-testid="pay-button" className="mt-10 w-full" type="button" onClick={() => handleSubmit()}>
                {isLoading ? <Spinner className="m-auto h-5 w-5 fill-primary-600 text-white" /> : 'Pay'}
            </Button>
        </>
    );
};

export const AddPaymentsSection = () => {
    const [, setCouponId] = useState<string | undefined>(undefined);

    return (
        <div className="w-80 lg:w-[28rem]">
            <PromoCodeSectionV2 setCouponId={setCouponId} />
            <StripeElementsProvider stripe={stripePromise}>
                <PaymentComponent />
            </StripeElementsProvider>
        </div>
    );
};

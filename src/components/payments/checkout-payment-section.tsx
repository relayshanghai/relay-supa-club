import { loadStripe } from '@stripe/stripe-js';
import { Elements as StripeElementsProvider, useStripe } from '@stripe/react-stripe-js';
import { useLocalStorageSelectedPrice } from 'src/hooks/use-prices';
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
import { useLocalSelectedTopupBundle } from 'src/hooks/use-topups';
import { type TopUpPrices, topUpPrices, type TopUpSizes } from 'src/hooks/use-topups';
import { useCompany } from 'src/hooks/use-company';

const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY || '');

const PaymentComponent = () => {
    const [selectedTopupBundle] = useLocalSelectedTopupBundle();
    const stripe = useStripe();
    const { company } = useCompany();
    const { defaultPaymentMethod, paymentMethods } = useSubscription();
    const [isLoading, setIsLoading] = useState(false);
    const [, setErrorMessage] = useState('');

    const currentPrices =
        topUpPrices[selectedTopupBundle.topupPrice as TopUpSizes][company?.currency as keyof TopUpPrices];
    const planName = selectedTopupBundle.topupPrice?.toUpperCase();

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
                            {currentPrices} {company?.currency.toUpperCase()}
                        </p>
                    </div>
                    <div className="flex justify-between">
                        <p className="text-gray-800">Discount</p>
                        <p className="text-gray-800">0 {company?.currency.toUpperCase()}</p>
                    </div>
                </div>
                <div className="border-b bg-white p-4">
                    <div className="flex justify-between">
                        <p className="text-xl font-semibold text-gray-800">Total</p>
                        <p className="text-xl font-semibold text-gray-800">
                            {currentPrices} {company?.currency.toUpperCase()}
                        </p>
                    </div>
                </div>
            </div>
            <Button data-testid="pay-button" className="mt-10 w-full" type="button" onClick={() => null}>
                {isLoading ? <Spinner className="m-auto h-5 w-5 fill-primary-600 text-white" /> : 'Pay'}
            </Button>
        </>
    );
};

export const CheckoutPaymentsSection = () => {
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

import { Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import type { StripeElementsOptions } from '@stripe/stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentElement } from '@stripe/react-stripe-js';
import { Modal } from 'src/components/modal';
import { useCompany } from 'src/hooks/use-company';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { nextFetch } from 'src/utils/fetcher';
import { clientLogger } from 'src/utils/logger-client';
import type { SubscriptionPricesGetResponse } from './api/subscriptions/prices';
import { Spinner } from 'src/components/icons';
import { Button } from 'src/components/button';
const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

const formatPrice = (price: string, currency: string, period: 'monthly' | 'annually' | 'quarterly') => {
    const pricePerMonth =
        period === 'annually' ? Number(price) / 12 : period === 'quarterly' ? Number(price) / 3 : Number(price);
    /** I think rounding to the dollar is OK for now, but if need be we can add cents */
    const roundedPrice = Math.round(pricePerMonth);
    if (currency === 'usd')
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(roundedPrice);
    // not sure what other currencies we will handle and if we can pass them directly to Intl.NumberFormat so this is a placeholder until we know
    return `${roundedPrice} ${currency}`;
};

type PriceTiers = {
    diy: string;
    diyMax: string;
};
type Prices = {
    monthly: PriceTiers;
    quarterly: PriceTiers;
    // annually: PriceTiers;
};
const CheckoutForm = () => {
    const { company } = useCompany();
    const _customerId = company?.cus_id || '';
    const { t } = useTranslation();
    const [prices, setPrices] = useState<Prices>({
        monthly: {
            diy: '--',
            diyMax: '--',
            // VIP: t('pricing.contactUs'),
        },
        quarterly: {
            diy: '--',
            diyMax: '--',
            // VIP: t('pricing.contactUs'),
        },
        // annually: {
        //     diy: '--',
        //     diyMax: '--',
        // },
    });
    const [priceIds, setPriceIds] = useState<{
        diy: { monthly: string; quarterly: string; annually: string };
        diyMax: { monthly: string; quarterly: string; annually: string };
    } | null>(null);

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const res = await nextFetch<SubscriptionPricesGetResponse>('subscriptions/prices');
                const { diy, diyMax } = res;

                const monthly = {
                    diy: formatPrice(diy.prices.monthly, diy.currency, 'monthly'),
                    diyMax: formatPrice(diyMax.prices.monthly, diyMax.currency, 'monthly'),
                    VIP: t('pricing.contactUs'),
                };
                const quarterly = {
                    diy: formatPrice(diy.prices.quarterly, diy.currency, 'quarterly'),
                    diyMax: formatPrice(diyMax.prices.quarterly, diyMax.currency, 'quarterly'),
                    VIP: t('pricing.contactUs'),
                };
                // const annually = {
                //     diy: formatPrice(diy.prices.annually, diy.currency, 'annually'),
                //     diyMax: formatPrice(diyMax.prices.annually, diyMax.currency, 'annually'),
                //     VIP: t('pricing.contactUs'),
                // };

                setPrices({ monthly, quarterly });
                setPriceIds({ diy: diy.priceIds, diyMax: diyMax.priceIds });
            } catch (error) {
                clientLogger(error, 'error', true); // send to sentry cause there's something wrong with the pricing endpoint
            }
        };

        fetchPrices();
    }, [t]);

    const elements = useElements();
    const stripe = useStripe();

    const [errorMessage, setErrorMessage] = useState();
    const [loading, setLoading] = useState(false);

    const handleError = (error: any) => {
        setLoading(false);
        setErrorMessage(error.message);
    };

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        if (!stripe || !elements) return;
        setLoading(true);
        try {
            // Trigger form validation and wallet collection
            const { error: submitError } = await elements.submit();
            if (submitError) {
                handleError(submitError);
                return;
            }

            // Create the Subscription
            const { clientSecret } = await nextFetch('subscriptions/create-subscription', {
                method: 'POST',
                body: {
                    customerId: 'cus_NUvyplgF7TLHbe',
                    priceId: priceIds?.diy.monthly,
                },
            });
            // console.log({ clientSecret });

            // Confirm the Subscription using the details collected by the Payment Element
            const { error } = await stripe.confirmPayment({
                elements,
                clientSecret,
                confirmParams: {
                    return_url: '/account',
                },
            });

            if (error) {
                // This point is only reached if there's an immediate error when
                // confirming the payment. Show the error to your customer (for example, payment details incomplete)
                handleError(error);
            } else {
                // Your customer is redirected to your `return_url`. For some payment
                // methods like iDEAL, your customer is redirected to an intermediate
                // site first to authorize the payment, then redirected to the `return_url`.
            }
        } catch (error) {
            handleError(error);
        }
    };

    return (
        <Modal maxWidth="lg" visible={true} onClose={() => null}>
            <div className="flex justify-around">
                <div>
                    DIY
                    <div>Monthly: {prices.monthly.diy}</div>
                    <div>Quarterly: {prices.quarterly.diy}</div>
                </div>
                <div>
                    DIY Max
                    <div>Monthly: {prices.monthly.diyMax}</div>
                    <div>Quarterly: {prices.quarterly.diyMax}</div>
                </div>
                <form onSubmit={handleSubmit}>
                    <PaymentElement />
                    <Button disabled={loading || !prices.quarterly.diyMax || !stripe || !elements}>
                        {loading ? <Spinner className="h-5 w-5 fill-primary-600 text-white" /> : 'Submit Payment'}
                    </Button>
                    {errorMessage && <div>{errorMessage}</div>}
                </form>
            </div>
        </Modal>
    );
};

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY || '');

// steps:
// get prices from stripe
// whenever user toggles a price, send a request to the backend/stripe to create a subscription and make a payment intent

const StripeElements = () => {
    const options: StripeElementsOptions = {
        mode: 'subscription',
        amount: 0,
        currency: 'usd',
    };

    return (
        <Elements stripe={stripePromise} options={options}>
            <CheckoutForm />
        </Elements>
    );
};

export default StripeElements;

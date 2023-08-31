import { loadStripe } from '@stripe/stripe-js';
import type { StripeElementsOptions } from '@stripe/stripe-js';
import { Elements as StripeElementsProvider } from '@stripe/react-stripe-js';
import CheckoutForm from './checkout-form';
import { useNewPrices } from 'src/hooks/use-prices';
import { useTranslation } from 'react-i18next';
import type { newActiveSubscriptionTier } from 'types';

const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY || '');

export type CreatePaymentIntentQueries = {
    amount: string;
    currency: string;
};
export type CreatePaymentIntentResponse = {
    clientSecret?: string;
};

export const AddPaymentsSection = ({ priceTier }: { priceTier: newActiveSubscriptionTier }) => {
    const { i18n } = useTranslation();
    const newPrices = useNewPrices();

    const selectedPrice = newPrices[priceTier];

    const options: StripeElementsOptions = {
        mode: 'subscription',
        amount: parseInt(selectedPrice.prices.monthly) * 100, //amount in cents
        currency: selectedPrice.currency,
        appearance: {
            theme: 'stripe',
            variables: {
                colorPrimary: '#8B5CF6', //primary-500 see tailwind.config.js
            },
        },
        locale: i18n.language.includes('en') ? 'en' : 'zh',
    };

    return (
        <div className="w-80 rounded shadow lg:w-[28rem]">
            <StripeElementsProvider stripe={stripePromise} options={options}>
                <CheckoutForm selectedPrice={selectedPrice} />
            </StripeElementsProvider>
        </div>
    );
};

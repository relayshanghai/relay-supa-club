import { useTranslation } from 'react-i18next';
import { CheckoutForm } from '../account/payment-method-checkout-form';
import { Elements as StripeElementsProvider } from '@stripe/react-stripe-js';
import { loadStripe, type StripeElementsOptions } from '@stripe/stripe-js';
import i18n from 'i18n';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY || '');

export const PaymentMethodForm = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const cardOptions: StripeElementsOptions = {
        mode: 'setup',
        paymentMethodCreation: 'manual',
        appearance: {
            theme: 'stripe',
            variables: {
                colorPrimary: '#8B5CF6', //primary-500 see tailwind.config.js
            },
        },
        locale: i18n.language?.includes('en') ? 'en' : 'zh',
        payment_method_types: ['card', 'alipay'],
    };

    return (
        <>
            <StripeElementsProvider stripe={stripePromise} options={cardOptions}>
                <CheckoutForm
                    onCompletion={(success: boolean) => {
                        if (success) {
                            toast.success('Payment method added successfully');
                            router.push('/boostbot');
                        } else {
                            toast.error('Failed to add payment method');
                        }
                    }}
                    buttonText={t('pricing.submitPaymentDetails')}
                    forceDefaultPaymentMethod
                />
            </StripeElementsProvider>
        </>
    );
};

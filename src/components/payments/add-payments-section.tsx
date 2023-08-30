import { loadStripe } from '@stripe/stripe-js';
import type { StripeElementsOptions } from '@stripe/stripe-js';
import { Elements as StripeElementsProvider } from '@stripe/react-stripe-js';
import CheckoutForm from './checkout-form';
import { useNewPrices } from 'src/hooks/use-prices';
import { useTranslation } from 'react-i18next';
import type { newActiveSubscriptionTier } from 'types';
import { useState } from 'react';
import Image from 'next/legacy/image';

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
    const { i18n, t } = useTranslation();
    const newPrices = useNewPrices();

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
    const selectedPrice = newPrices[priceTier];

    const cardOptions: StripeElementsOptions = {
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
        payment_method_types: ['card'],
    };

    // const aliPayOptions: StripeElementsOptions = {
    //     mode: 'setup',
    //     appearance: {
    //         theme: 'stripe',
    //         variables: {
    //             colorPrimary: '#8B5CF6', //primary-500 see tailwind.config.js
    //         },
    //     },
    //     locale: i18n.language.includes('en') ? 'en' : 'zh',
    //     payment_method_types: ['alipay'],
    // };

    return (
        <div className="w-80 rounded shadow lg:w-[28rem]">
            <div className="flex w-full space-x-3 px-6 pt-6 text-xs text-gray-500">
                <button
                    className={`${
                        selectedPaymentMethod === 'card' ? 'border-2 border-primary-500 text-primary-500' : ''
                    } basis-1/2 rounded-md px-6 py-2 shadow hover:border-primary-400 focus:border-primary-400`}
                    onClick={() => setSelectedPaymentMethod('card')}
                >
                    {t('account.card')}
                </button>
                <button
                    className={`${
                        selectedPaymentMethod === 'alipay' ? 'border-2 border-primary-500 text-primary-500' : ''
                    } basis-1/2 rounded-md px-6 py-2 shadow hover:border-primary-400 focus:border-primary-400`}
                    onClick={() => setSelectedPaymentMethod('alipay')}
                >
                    {t('account.alipay')}
                </button>
            </div>
            {selectedPaymentMethod ? (
                <>
                    {selectedPaymentMethod === 'card' && (
                        <StripeElementsProvider stripe={stripePromise} options={cardOptions}>
                            <CheckoutForm selectedPrice={selectedPrice} />
                        </StripeElementsProvider>
                    )}

                    {selectedPaymentMethod === 'alipay' && (
                        <div className="mb-2 p-6">
                            <p className="p-6 text-xs text-gray-500">{t('account.contactUs')}</p>

                            <Image
                                src="/assets/imgs/qrcodes/amy-qrcode.jpg"
                                alt="qr code to contact customer service"
                                layout="responsive"
                                width={1000}
                                height={1200}
                            />
                            {/* <StripeElementsProvider stripe={stripePromise} options={aliPayOptions}>
                                <CheckoutForm selectedPrice={selectedPrice} />
                            </StripeElementsProvider> */}
                        </div>
                    )}
                </>
            ) : (
                <p className="p-6 text-xs text-gray-500">{t('account.choosePaymentMethod')}</p>
            )}
        </div>
    );
};

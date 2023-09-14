import { loadStripe } from '@stripe/stripe-js';
import type { StripeElementsOptions } from '@stripe/stripe-js';
import { Elements as StripeElementsProvider } from '@stripe/react-stripe-js';
import CheckoutForm from './checkout-form';
import { useNewPrices } from 'src/hooks/use-prices';
import { useTranslation } from 'react-i18next';
import type { newActiveSubscriptionTier } from 'types';
import { useState } from 'react';
// import Image from 'next/legacy/image';
import { Alipay, Payment } from '../icons';
import { useRudderstack } from 'src/hooks/use-rudderstack';
import { PAYMENT_PAGE } from 'src/utils/rudderstack/event-names';
import Link from 'next/link';
import { useUser } from 'src/hooks/use-user';
import { useCompany } from 'src/hooks/use-company';

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
    const { trackEvent } = useRudderstack();
    const { profile } = useUser();
    const { company } = useCompany();

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>('card');
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
        payment_method_types: ['card', 'alipay'],
    };
    const paymentLink =
        priceTier === 'discovery'
            ? `https://buy.stripe.com/test_eVa9C5goq4sOdXO4gg?prefilled_email=${profile?.email}&client_reference_id=${company?.cus_id}`
            : `https://buy.stripe.com/test_14kcOh7RU7F02f6001?prefilled_email=${profile?.email}&client_reference_id=${company?.cus_id}`;

    return (
        <div className="w-80 rounded shadow lg:w-[28rem]">
            <div className="flex w-full space-x-3 px-6 pt-6 text-xs text-gray-500">
                <div
                    className={`${
                        selectedPaymentMethod === 'card'
                            ? 'border-2 border-primary-500 fill-primary-500 text-primary-500'
                            : ''
                    } group basis-1/2 cursor-pointer rounded-md px-6 py-2 shadow transition hover:border-primary-400 focus:border-primary-400`}
                    onClick={() => {
                        setSelectedPaymentMethod('card');
                        trackEvent(PAYMENT_PAGE('click on card option'));
                    }}
                >
                    <Payment
                        className={`${
                            selectedPaymentMethod === 'card' ? 'fill-primary-500' : 'fill-gray-300'
                        } h-4 w-4 group-hover:fill-primary-500`}
                    />
                    <div className="group-hover:text-primary-500">{t('account.card')}</div>
                </div>
                <div
                    className={`${
                        selectedPaymentMethod === 'alipay' ? 'border-2 border-primary-500 text-primary-500' : ''
                    } group basis-1/2 cursor-pointer rounded-md px-6 py-2 shadow transition hover:border-primary-400 focus:border-primary-400`}
                    onClick={() => {
                        setSelectedPaymentMethod('alipay');
                        trackEvent(PAYMENT_PAGE('click on alipay option'));
                    }}
                >
                    <Alipay
                        className={`${
                            selectedPaymentMethod === 'alipay' ? 'fill-blue-600' : 'fill-gray-300'
                        } h-4 w-4 group-hover:fill-blue-600`}
                    />
                    <div className="group-hover:text-primary-500">{t('account.alipay')}</div>
                </div>
            </div>
            {selectedPaymentMethod ? (
                <>
                    {selectedPaymentMethod === 'card' && (
                        <StripeElementsProvider stripe={stripePromise} options={cardOptions}>
                            <CheckoutForm selectedPrice={selectedPrice} />
                        </StripeElementsProvider>
                    )}

                    {selectedPaymentMethod === 'alipay' && (
                        <div className="mb-2 flex flex-col p-6">
                            {/* <p className="p-6 text-xs text-gray-500">{t('account.contactUs')}</p>

                            <Image
                                src="/assets/imgs/qrcodes/relayclub.jpg"
                                alt="qr code to contact customer service"
                                layout="responsive"
                                width={1000}
                                height={1320}
                            /> */}

                            <p className="p-6 text-xs text-gray-500">
                                If you prefer to use Alipay, you could pay with the Payment Link.
                            </p>
                            <Link
                                href={paymentLink}
                                className="mx-6 rounded-md bg-primary-500 px-3 py-2 text-center text-sm font-medium text-white hover:bg-primary-600"
                            >
                                Payment Link
                            </Link>
                        </div>
                    )}
                </>
            ) : (
                <p className="p-6 text-xs text-gray-500">{t('account.choosePaymentMethod')}</p>
            )}
        </div>
    );
};

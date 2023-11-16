import { loadStripe } from '@stripe/stripe-js';
import type { StripeElementsOptions } from '@stripe/stripe-js';
import { Elements as StripeElementsProvider } from '@stripe/react-stripe-js';
import CheckoutForm from './checkout-form';
import { useNewPrices } from 'src/hooks/use-prices';
import { useTranslation } from 'react-i18next';
import type { newActiveSubscriptionTier } from 'types';
import { useMemo, useState } from 'react';
import Image from 'next/legacy/image';
import { Alipay, Payment } from '../icons';
import { useRudderstack } from 'src/hooks/use-rudderstack';
import { randomNumber } from 'src/utils/utils';
import { PromoCodeSection } from './promo-code-section';

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

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>('card');
    const selectedPrice = newPrices[priceTier];
    const [couponId, setCouponId] = useState<string | undefined>(undefined);

    const batchId = useMemo(() => randomNumber(), []);
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

    return (
        <div className="w-80 lg:w-[28rem]">
            <PromoCodeSection selectedPrice={selectedPrice} setCouponId={setCouponId} />
            <div className="rounded shadow ">
                <div className="flex w-full space-x-3 px-6 pt-6 text-xs text-gray-500">
                    <div
                        className={`${
                            selectedPaymentMethod === 'card'
                                ? 'border-2 border-primary-500 fill-primary-500 text-primary-500'
                                : ''
                        } group basis-1/2 cursor-pointer rounded-md px-6 py-2 shadow transition hover:border-primary-400 focus:border-primary-400`}
                        onClick={() => {
                            setSelectedPaymentMethod('card');
                            // @note previous name: Payment Page, click on card option
                            trackEvent('Select Payment Type', { payment_type: 'card' });
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
                            // @note previous name: Payment Page, click on alipay option
                            trackEvent('Select Payment Type', { payment_type: 'alipay' });
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
                                <CheckoutForm selectedPrice={selectedPrice} batchId={batchId} couponId={couponId} />
                            </StripeElementsProvider>
                        )}

                        {selectedPaymentMethod === 'alipay' && (
                            <div className="mb-2 p-6">
                                <p className="p-6 text-xs text-gray-500">{t('account.contactUs')}</p>

                                <Image
                                    src="/assets/imgs/qrcodes/relayclub-clubby.png"
                                    alt="qr code to contact customer service"
                                    layout="responsive"
                                    width={1000}
                                    height={1000}
                                />
                            </div>
                        )}
                    </>
                ) : (
                    <p className="p-6 text-xs text-gray-500">{t('account.choosePaymentMethod')}</p>
                )}
            </div>
        </div>
    );
};

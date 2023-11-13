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
import { Button } from '../button';
import { getAllPromoCodes } from 'src/utils/api/stripe/handle-subscriptions';
import type Stripe from 'stripe';
import { numberFormatter } from 'src/utils/formatter';

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
    const [promoCode, setPromoCode] = useState<string>('');
    const [couponId, setCouponId] = useState<string | undefined>(undefined);
    const [promoCodeMessage, setPromoCodeMessage] = useState<string>('');
    const [promoCodeMessageCls, setPromoCodeMessageCls] = useState<string>('text-gray-500');

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

    const handleSubmit = async (promoCode: string) => {
        const res = await getAllPromoCodes();
        const allPromoCodes = res.data;
        // check if promoCode is an valid active promo code
        const validCode: Stripe.PromotionCode | undefined = allPromoCodes.find((code) => code.code === promoCode);
        // calculate the amount deducted from the original price to show in the success message
        const calcAmountDeducted = (amount: number, percentageOff: number) => {
            return numberFormatter(amount * (percentageOff / 100));
        };
        if (validCode) {
            setCouponId(validCode.coupon.id);
            const percentageOff = validCode.coupon.percent_off;
            const validMonths = validCode.coupon.duration_in_months;
            const validDurationText = t('account.payments.validDuration', { validMonths });
            setPromoCodeMessageCls('text-green-600');
            setPromoCodeMessage(
                `${t('account.payments.promoCodeAdded')}  -¥${calcAmountDeducted(
                    parseInt(selectedPrice.prices.monthly),
                    percentageOff ?? 0,
                )} (${percentageOff?.toString()}% off) ${validDurationText}`,
            );
        } else {
            setPromoCodeMessage(t('account.payments.invalidPromoCode') || '');
            setPromoCodeMessageCls('text-red-500');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit(promoCode);
        }
    };
    return (
        <div className="w-80 lg:w-[28rem]">
            {/* promo code input section */}
            <div className="mb-3">
                <div className="flex flex-col ">
                    <label className="mb-2 text-sm font-semibold text-gray-600">
                        {t('account.payments.promoCode')}
                    </label>
                    <div className="flex h-10 items-end space-x-3">
                        <input
                            type="text"
                            placeholder={t('account.payments.enterPromoCode') || ''}
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e)}
                            className="focus:ring-primary h-full w-full rounded border-2 border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 placeholder-gray-400 focus:appearance-none focus:border-primary-500  focus:outline-none focus:ring-0 "
                        />
                        <Button className="h-full" type="submit" onClick={() => handleSubmit(promoCode)}>
                            {t('account.payments.apply')}
                        </Button>
                    </div>
                </div>
                <p className={`px-3 py-2 text-xs font-semibold ${promoCodeMessageCls}`}>{promoCodeMessage}</p>
            </div>
            {/* payment method selection section */}
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

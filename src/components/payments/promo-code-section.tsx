import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getAllPromoCodes } from 'src/utils/api/stripe/handle-subscriptions';
import { numberFormatter } from 'src/utils/formatter';
import type Stripe from 'stripe';
import type { NewRelayPlan } from 'types';
import { Button } from '../button';
import { Spinner } from '../icons';

export const PromoCodeSection = ({
    selectedPrice,
    setCouponId,
}: {
    selectedPrice: NewRelayPlan;
    setCouponId: (value: string) => void;
}) => {
    const { t } = useTranslation();
    const [promoCode, setPromoCode] = useState<string>('');
    const [promoCodeMessage, setPromoCodeMessage] = useState<string>('');
    const [promoCodeMessageCls, setPromoCodeMessageCls] = useState<string>('text-gray-500');
    const [promoCodeInputCls, setPromoCodeInputCls] = useState<string>('focus:border-primary-500');
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (promoCode: string) => {
        setLoading(true);
        const allPromoCodes = await getAllPromoCodes();
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
            setPromoCodeInputCls('focus:border-green-600 border-green-600');
            setPromoCodeMessage(
                ` ${percentageOff}% ${t('account.payments.offCn')} (¥${calcAmountDeducted(
                    parseInt(selectedPrice.prices.monthly),
                    percentageOff ?? 0,
                )}) ${t('account.payments.offEn')}${validDurationText}`,
            );
        } else {
            setPromoCodeMessage(t('account.payments.invalidPromoCode') || '');
            setPromoCodeMessageCls('text-red-500');
            setPromoCodeInputCls('focus:border-red-500 border-red-500');
        }
        setLoading(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit(promoCode);
        }
    };

    return (
        <div className="mb-3">
            <div className="flex flex-col ">
                <label className="mb-2 text-sm font-semibold text-gray-600">{t('account.payments.promoCode')}</label>
                <div className="flex h-10 items-end space-x-3">
                    <input
                        type="text"
                        placeholder={t('account.payments.enterPromoCode') || ''}
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e)}
                        className={`${promoCodeInputCls} h-full w-full rounded border-2 border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 placeholder-gray-400 focus:appearance-none  focus:outline-none focus:ring-0 `}
                    />
                    <Button className="h-full" type="submit" onClick={() => handleSubmit(promoCode)}>
                        {loading ? (
                            <Spinner className="h-5 w-5 fill-primary-600 text-white" />
                        ) : (
                            t('account.payments.apply')
                        )}
                    </Button>
                </div>
            </div>
            <p className={`px-3 py-2 text-xs font-semibold ${promoCodeMessageCls}`}>{promoCodeMessage}</p>
        </div>
    );
};

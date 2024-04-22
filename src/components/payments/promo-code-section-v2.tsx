/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { NewRelayPlan } from 'types';
import { Button } from '../button';
import { Spinner } from '../icons';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { ApplyPromoCode } from 'src/utils/analytics/events';
import type { ActiveSubscriptionTier } from 'src/hooks/use-prices';
import { useCouponV2, useLocalStorageSubscribeResponse } from 'src/hooks/v2/use-subscription';
import { useRouter } from 'next/router';
import awaitToError from 'src/utils/await-to-error';

export const PromoCodeSectionV2 = ({
    setCouponId,
    priceTier,
}: {
    selectedPrice: NewRelayPlan;
    setCouponId: (value: string) => void;
    priceTier: ActiveSubscriptionTier;
}) => {
    const { t } = useTranslation();
    const {
        query: { subscriptionId },
    } = useRouter();
    const [stripeSubscribeResponse] = useLocalStorageSubscribeResponse();
    const [promoCode, setPromoCode] = useState<string>(stripeSubscribeResponse.coupon ?? '');
    const [promoCodeMessage, setPromoCodeMessage] = useState<string>('');
    const [promoCodeMessageCls, setPromoCodeMessageCls] = useState<string>('text-gray-500');
    const [promoCodeInputCls, setPromoCodeInputCls] = useState<string>('focus:border-primary-500');
    const { track } = useRudderstackTrack();
    const { loading, applyCoupon } = useCouponV2();

    const handleSubmit = async (promoCode: string) => {
        const [, couponResponse] = await awaitToError(applyCoupon(subscriptionId as string, { coupon: promoCode }));

        if (couponResponse) {
            setCouponId(couponResponse.id);
            const percentageOff = couponResponse.percent_off;
            const validMonths = couponResponse.duration_in_months;
            const validDurationText = t('account.payments.validDuration', { validMonths: validMonths || 1 });
            setPromoCodeMessageCls('text-green-600');
            setPromoCodeInputCls('focus:border-green-600 border-green-600');
            setPromoCodeMessage(
                ` ${percentageOff}% ${t('account.payments.offCn')} ${t('account.payments.offEn')}${validDurationText}`,
            );
            track(ApplyPromoCode, { selected_plan: priceTier, promo_code: promoCode });
        } else {
            setPromoCodeMessage(t('account.payments.invalidPromoCode') || '');
            setPromoCodeMessageCls('text-red-500');
            setPromoCodeInputCls('focus:border-red-500 border-red-500');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit(promoCode);
        }
    };
    useEffect(() => {
        if (stripeSubscribeResponse.coupon) {
            handleSubmit(promoCode);
        }
    }, []);
    return (
        <div className="mb-3">
            <div className="flex flex-col ">
                <label className="mb-2 text-sm font-semibold text-gray-600">{t('account.payments.promoCode')}</label>
                <div className="flex h-10 items-end space-x-3">
                    <input
                        data-testid="coupon-input"
                        type="text"
                        placeholder={t('account.payments.enterPromoCode') || ''}
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e)}
                        className={`${promoCodeInputCls} h-full w-full rounded border-2 border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 placeholder-gray-400 focus:appearance-none  focus:outline-none focus:ring-0 `}
                    />
                    <Button
                        data-testid="apply-coupon-button"
                        className="h-full"
                        type="submit"
                        onClick={() => handleSubmit(promoCode)}
                    >
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

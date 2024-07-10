/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../button';
import { Spinner } from '../icons';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { ApplyPromoCode } from 'src/utils/analytics/events';
import {
    type Coupon,
    useCouponV2,
    useLocalStorageSubscribeResponse,
    useApplyCouponResponseStore,
} from 'src/hooks/v2/use-subscription';
import { useRouter } from 'next/router';
import awaitToError from 'src/utils/await-to-error';
import { Popover, PopoverContent, PopoverTrigger } from 'shadcn/components/ui/popover';

const getCoupon = (coupon: Coupon | string): string | undefined => {
    if (typeof coupon !== 'string') {
        return '';
    }
    if (coupon) {
        return coupon;
    }
};

export const PromoCodeSectionV2 = ({ setCouponId }: { setCouponId: (value: string) => void }) => {
    const { t } = useTranslation();
    const {
        query: { subscriptionId },
        push,
    } = useRouter();
    const { setApplyCouponResponse } = useApplyCouponResponseStore();
    const [stripeSubscribeResponse, setStripeSubscribeResponse] = useLocalStorageSubscribeResponse();
    const [promoCode, setPromoCode] = useState<string>(
        getCoupon(stripeSubscribeResponse.coupon as Coupon | string) as string,
    );
    const [promoCodeMessage, setPromoCodeMessage] = useState<string>('');
    const [promoCodeMessageCls, setPromoCodeMessageCls] = useState<string>('text-gray-500');
    const [promoCodeInputCls, setPromoCodeInputCls] = useState<string>('focus:border-primary-500');
    const { track } = useRudderstackTrack();
    const { loading, applyCoupon } = useCouponV2();

    const handleSubmit = async (promoCode: string) => {
        const [, couponResponse] = await awaitToError(applyCoupon(subscriptionId as string, { coupon: promoCode }));

        if (couponResponse?.coupon) {
            setCouponId(couponResponse.coupon.id);
            const percentageOff = couponResponse.coupon.percent_off;
            const validMonths = couponResponse.coupon.duration_in_months;
            const validDurationText = t('account.payments.validDuration', { validMonths: validMonths || 1 });
            setPromoCodeMessageCls('text-green-600');
            setPromoCodeInputCls('focus:border-green-600 border-green-600');
            setPromoCodeMessage(
                ` ${percentageOff}% ${t('account.payments.offCn')} ${t('account.payments.offEn')}${validDurationText}`,
            );
            setApplyCouponResponse({
                clientSecret: couponResponse?.clientSecret,
                ipAddress: couponResponse?.ipAddress,
                providerSubscriptionId: subscriptionId as string,
                plan: stripeSubscribeResponse.plan,
                coupon: couponResponse?.coupon,
            });
            setStripeSubscribeResponse({
                clientSecret: couponResponse?.clientSecret,
                ipAddress: couponResponse?.ipAddress,
                plan: stripeSubscribeResponse.plan,
                coupon: couponResponse?.coupon,
            });

            push(`/subscriptions/${couponResponse.providerSubscriptionId}/payments`);
            track(ApplyPromoCode, { selected_plan: stripeSubscribeResponse.plan, promo_code: promoCode });
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
        if (getCoupon(stripeSubscribeResponse.coupon as string)) {
            handleSubmit(promoCode);
        }
    }, []);

    const buttonRef = useRef(null);
    const [popOverOpened, setPopOverOpened] = useState(false);

    const handleBlur = () => {
        // Using setTimeout to ensure the check happens after the focus change
        setTimeout(() => {
            if (promoCode.length > 0 && document.activeElement !== buttonRef.current) {
                setPopOverOpened(true);
            }
        }, 0);
    };

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
                        onBlur={handleBlur}
                    />
                    <Popover
                        open={popOverOpened}
                        onOpenChange={() => {
                            setPopOverOpened(false);
                        }}
                    >
                        <PopoverTrigger asChild>
                            <Button
                                ref={buttonRef}
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
                        </PopoverTrigger>
                        <PopoverContent side="bottom">
                            <div className="p-2 text-xs text-gray-500">{t('pricing.pressApplyCouponButton')}</div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
            <p className={`px-3 py-2 text-xs font-semibold ${promoCodeMessageCls}`}>{promoCodeMessage}</p>
        </div>
    );
};

import { useRouter } from 'next/router';
import type { SubscriptionCreatePostResponse } from 'pages/api/subscriptions/create';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { createSubscriptionErrors } from 'src/errors/subscription';
import { hasCustomError } from 'src/utils/errors';
import type { SubscriptionPeriod } from 'types';

import { Button } from '../button';
import { Modal } from '../modal';
import { nextFetchWithQueries } from 'src/utils/fetcher';
import type { CouponGetQueries, CouponGetResponse } from 'pages/api/subscriptions/coupon';
import { clientLogger } from 'src/utils/logger-client';
import { Input } from '../input';

export interface SubscriptionConfirmModalData {
    plan: 'diy' | 'diyMax';
    period: SubscriptionPeriod;
    priceId: string;
    price: string;
}
export interface SubscriptionConfirmModalProps {
    confirmModalData: SubscriptionConfirmModalData | null;
    setConfirmModalData: (value: SubscriptionConfirmModalData | null) => void;
    createSubscription: (priceId: string, couponId?: string) => Promise<SubscriptionCreatePostResponse>;
}

export const SubscriptionConfirmModal = ({
    confirmModalData,
    setConfirmModalData,
    createSubscription,
}: SubscriptionConfirmModalProps) => {
    const [submitStatus, setSubmitStatus] = useState<'initial' | 'submitting' | 'submitted'>('initial');
    const router = useRouter();
    const { t } = useTranslation();

    const [couponId, setCouponId] = useState<string>('');
    const [couponInfo, setCouponInfo] = useState<CouponGetResponse | null>(null);
    const [checkingCoupon, setCheckingCoupon] = useState<boolean>(false);
    const { price, period, priceId, plan } = confirmModalData || {};
    const handleCreateSubscription = useCallback(async () => {
        setSubmitStatus('submitting');
        const id = toast.loading(t('account.subscription.modal.subscribing'));
        try {
            if (!priceId) throw new Error('noPriceId');
            const result = await createSubscription(priceId, couponId);
            if (result?.status === 'active')
                toast.success(t('account.subscription.modal.subscriptionPurchased'), { id });
            setSubmitStatus('submitted');
        } catch (e: any) {
            if (hasCustomError(e, createSubscriptionErrors)) {
                toast.error(t(`account.subscription.modal.${e.message}`), {
                    id,
                });
            } else {
                toast.error(t('account.subscription.modal.wentWrong'), {
                    id,
                });
            }
            setSubmitStatus('initial');
        }
    }, [t, createSubscription, priceId, couponId]);

    const checkCoupon = useCallback(async () => {
        setCheckingCoupon(true);
        try {
            const coupon = await nextFetchWithQueries<CouponGetQueries, CouponGetResponse>(`subscriptions/coupon`, {
                coupon_id: couponId,
            });
            setCouponInfo(coupon);
        } catch (error) {
            clientLogger(error, 'error');
            setCouponInfo(null);
        }
        if (!couponInfo || !couponInfo.valid) {
            toast.error(t('pricing.invalidCoupon'));
        } else {
            if (couponInfo.percent_off) toast.success(t('pricing.couponApplied'));
        }
        setCheckingCoupon(false);
    }, [couponId, couponInfo, t]);

    const priceNumber = Number(price?.split('$')[1]);
    const priceAfterCoupon =
        price && !Number.isNaN(priceNumber) && couponInfo?.percent_off
            ? '$' + (priceNumber * (1 - couponInfo.percent_off / 100)).toFixed(2)
            : price;

    return (
        <Modal visible={!!confirmModalData} onClose={() => setConfirmModalData(null)}>
            {priceAfterCoupon && period && priceId && plan ? (
                <div className="p-2">
                    <div className="mb-8 flex justify-between">
                        <h1 className="text-2xl text-primary-700">
                            {t('account.subscription.modal.plan_planName', {
                                planName: plan === 'diy' ? 'DIY' : 'DIY Max',
                            })}
                        </h1>
                        <Button
                            variant="secondary"
                            className="!px-2 !py-0 !text-xs"
                            onClick={async () => setConfirmModalData(null)}
                        >
                            {t('account.subscription.modal.close')}
                        </Button>
                    </div>

                    <div className="flex items-center justify-around">
                        <Input
                            label="Coupon ID"
                            type="text"
                            value={couponId}
                            onChange={(e) => {
                                setCouponId(e.target.value);
                            }}
                        />
                        <Button
                            variant="secondary"
                            className="ml-10 h-max !px-2 !py-2 !text-xs"
                            disabled={checkingCoupon}
                            onClick={() => checkCoupon()}
                        >
                            {t('pricing.applyCoupon')}
                        </Button>
                    </div>
                    {couponInfo?.valid && (
                        <div className="flex flex-col items-center">
                            <p className="font-bold">{couponInfo.name}</p>

                            <div className="mt-2 flex">
                                <p>
                                    {t('pricing.discount')}
                                    {`: `}
                                </p>
                                <p className="ml-10">
                                    {couponInfo.percent_off}
                                    {` %`}
                                </p>
                            </div>
                        </div>
                    )}

                    <h2 className="mt-10">{t('account.subscription.modal.youAreAboutToSubscribeFor')}</h2>
                    <div className="mt-4 flex items-center justify-between">
                        <p className="text-sm font-bold">{`${priceAfterCoupon}${t(
                            'account.subscription.modal.perMonth',
                        )}. ${t('account.subscription.modal.billed_period', {
                            period: t(`account.subscription.${period}`),
                        })}`}</p>

                        <Button
                            disabled={submitStatus === 'submitting'}
                            onClick={() =>
                                submitStatus === 'submitted' ? router.push('/account') : handleCreateSubscription()
                            }
                        >
                            {submitStatus === 'submitted'
                                ? t('account.subscription.modal.backToAccount')
                                : t('account.subscription.modal.subscribe')}
                        </Button>
                    </div>
                    <div className="mt-8 text-xs text-gray-600">
                        {t('account.subscription.modal.noteClickingSubscribeWillCharge')}
                    </div>
                </div>
            ) : (
                <div />
            )}
        </Modal>
    );
};

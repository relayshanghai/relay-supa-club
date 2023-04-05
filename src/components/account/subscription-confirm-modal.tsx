import { useRouter } from 'next/router';
import type { SubscriptionCreatePostResponse } from 'pages/api/subscriptions/create';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { createSubscriptionErrors } from 'src/errors/subscription';
import { hasCustomError } from 'src/utils/errors';
import type { SubscriptionPeriod } from 'types';

import { Button } from '../button';
import { Modal } from '../modal';

export interface SubscriptionConfirmModalData {
    plan: 'diy' | 'diyMax';
    period: SubscriptionPeriod;
    priceId: string;
    price: string;
}
export const SubscriptionConfirmModal = ({
    confirmModalData,
    setConfirmModalData,
    createSubscription,
}: {
    confirmModalData: SubscriptionConfirmModalData | null;
    setConfirmModalData: (value: SubscriptionConfirmModalData | null) => void;
    createSubscription: (priceId: string) => Promise<SubscriptionCreatePostResponse>;
}) => {
    const [submitStatus, setSubmitStatus] = useState<'initial' | 'submitting' | 'submitted'>('initial');
    const router = useRouter();
    const { t } = useTranslation();
    const handleCreateSubscription = async (priceId: string) => {
        setSubmitStatus('submitting');
        const id = toast.loading(t('account.subscription.modal.subscribing'));
        try {
            const result = await createSubscription(priceId);
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
    };
    const { price, period, priceId, plan } = confirmModalData || {};
    return (
        <Modal visible={!!confirmModalData} onClose={() => setConfirmModalData(null)}>
            {price && period && priceId && plan ? (
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

                    <h2>{t('account.subscription.modal.youAreAboutToSubscribeFor')}</h2>
                    <div className="mt-4 flex items-center justify-between">
                        <p className="text-sm font-bold">{`${price}${t('account.subscription.modal.perMonth')}. ${t(
                            'account.subscription.modal.billed_period',
                            {
                                period: t(`account.subscription.${period}`),
                            },
                        )}`}</p>

                        <Button
                            disabled={submitStatus === 'submitting'}
                            onClick={() =>
                                submitStatus === 'submitted'
                                    ? router.push('/account')
                                    : handleCreateSubscription(priceId)
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

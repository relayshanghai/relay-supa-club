import { t } from 'i18next';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useSubscription } from 'src/hooks/use-subscription';
import { Button } from '../button';
import { Modal } from '../modal';

export const CancelSubscriptionModal = ({
    visible,
    onClose,
}: {
    visible: boolean;
    onClose: () => void;
}) => {
    const { createDiscountRenew, cancelSubscription } = useSubscription();
    const [submitting, setSubmitting] = useState(false);
    const handleCancel = async () => {
        setSubmitting(true);
        const id = toast.loading(t('account.cancelModal.cancelling'));
        try {
            const result = await cancelSubscription();
            if (result?.status)
                toast.success(t('account.cancelModal.subscriptionCancelled'), { id });
        } catch (e) {
            toast.error(t('account.subscription.modal.wentWrong'), {
                id,
            });
        } finally {
            setSubmitting(false);
        }
    };
    const handleRenewWithDiscount = async () => {
        setSubmitting(true);
        const id = toast.loading(t('account.subscription.modal.subscribing'));
        try {
            const result = await createDiscountRenew();
            if (result?.status === 'active')
                toast.success(t('account.subscription.modal.subscriptionPurchased'), { id });
        } catch (e) {
            toast.error(t('account.subscription.modal.wentWrong'), {
                id,
            });
        } finally {
            setSubmitting(false);
        }
    };
    const handleClose = () => {
        if (!submitting) {
            onClose();
        }
    };
    return (
        <Modal visible={visible} onClose={handleClose}>
            <div className="flex flex-col space-y-4 pt-4">
                <div className="flex justify-between mb-8">
                    <h1 className="text-2xl text-primary-700"> {t('account.cancelModal.title')}</h1>
                    <Button
                        variant="secondary"
                        className="!text-xs !px-2 !py-0"
                        onClick={handleClose}
                    >
                        {t('account.subscription.modal.close')}
                    </Button>
                </div>
                <h3 className="text-lg font-bold">
                    {t('account.cancelModal.areYouSureYouWantToCancelYourSubscription')}
                </h3>
                <p className="text-gray-500">
                    {t('account.cancelModal.youWillLoseAccessToAllData')}
                </p>
                <div className="flex flex-row space-x-4">
                    <Button
                        disabled={submitting}
                        onClick={handleCancel}
                        className="bg-red-700 border-red-700 hover:bg-red-600 hover:border-red-600 m-auto"
                    >
                        {t('account.cancelModal.cancelSubscription')}
                    </Button>
                </div>
                <p className="text-gray-500">
                    {t('account.cancelModal.orRenewAtDiscount_percentage', { percentage: 20 })}
                </p>

                <Button disabled={submitting} className="m-auto" onClick={handleRenewWithDiscount}>
                    {t('account.cancelModal.renewNow')}
                </Button>
            </div>
        </Modal>
    );
};

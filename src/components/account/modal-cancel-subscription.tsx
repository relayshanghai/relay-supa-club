import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useSubscription } from 'src/hooks/use-subscription';
import { Button } from '../button';
import { Modal } from '../modal';
import { useRudderstack } from 'src/hooks/use-rudderstack';
import { CANCEL_SUBSCRIPTION_MODAL } from 'src/utils/rudderstack/event-names';

export const CancelSubscriptionModal = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
    const { t } = useTranslation();
    const { cancelSubscription } = useSubscription();
    const { trackEvent } = useRudderstack();

    const [submitting, setSubmitting] = useState(false);
    const handleCancel = async () => {
        setSubmitting(true);
        const id = toast.loading(t('account.cancelModal.cancelling'));
        try {
            const result = await cancelSubscription();
            if (result?.status) toast.success(t('account.cancelModal.subscriptionCancelled'), { id });
            trackEvent(CANCEL_SUBSCRIPTION_MODAL('canceled subscription'));
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
                <div className="mb-8 flex justify-between">
                    <h1 className="text-2xl text-primary-700"> {t('account.cancelModal.title')}</h1>
                    <Button variant="secondary" className="!px-2 !py-0 !text-xs" onClick={handleClose}>
                        {t('account.subscription.modal.close')}
                    </Button>
                </div>
                <h3 className="text-lg font-bold">
                    {t('account.cancelModal.areYouSureYouWantToCancelYourSubscription')}
                </h3>
                <p className="text-gray-500">{t('account.cancelModal.youWillLoseAccessToAllData')}</p>
                <div className="flex flex-row space-x-4">
                    <Button
                        disabled={submitting}
                        onClick={handleCancel}
                        className="m-auto border-red-700 bg-red-700 hover:border-red-600 hover:bg-red-600"
                    >
                        {t('account.cancelModal.cancelSubscription')}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

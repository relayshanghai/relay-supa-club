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
    const [submitStatus, setSubmitStatus] = useState<'initial' | 'submitting' | 'submitted'>(
        'initial',
    );
    const handleCancel = async () => {
        setSubmitStatus('submitting');
        const id = toast.loading(t('account.subscription.modal.subscribing'));
        try {
            const result = await cancelSubscription();
            if (result?.status === 'active')
                toast.success(t('account.subscription.modal.subscriptionPurchased'), { id });
            setSubmitStatus('submitted');
        } catch (e) {
            toast.error(t('account.subscription.modal.wentWrong'), {
                id,
            });
            setSubmitStatus('initial');
        }
    };
    const handleRenewWithDiscount = async () => {
        setSubmitStatus('submitting');
        const id = toast.loading(t('account.subscription.modal.subscribing'));
        try {
            const result = await createDiscountRenew();
            if (result?.status === 'active')
                toast.success(t('account.subscription.modal.subscriptionPurchased'), { id });
            setSubmitStatus('submitted');
        } catch (e) {
            toast.error(t('account.subscription.modal.wentWrong'), {
                id,
            });
            setSubmitStatus('initial');
        }
    };
    return (
        <Modal visible={visible} onClose={onClose}>
            <div className="flex flex-col space-y-4 pt-4">
                <div className="flex justify-between mb-8">
                    <h1 className="text-2xl text-primary-700">Cancel Subscription</h1>
                    <Button
                        variant="secondary"
                        className="!text-xs !px-2 !py-0"
                        onClick={async () => onClose()}
                    >
                        {t('account.subscription.modal.close')}
                    </Button>
                </div>
                <h3 className="text-lg font-bold">
                    Are you sure you want to cancel your subscription?
                </h3>
                <p className="text-gray-500">
                    You will lose access to all your projects and data once the current billing
                    period expires.
                </p>
                <div className="flex flex-row space-x-4">
                    <Button
                        onClick={handleCancel}
                        className="bg-red-700 border-red-700 hover:bg-red-600 hover:border-red-600 m-auto"
                    >
                        Cancel Subscription
                    </Button>
                </div>
                <p className="text-gray-500">Or renew now at 20% discount</p>

                <Button
                    disabled={submitStatus === 'submitting'}
                    className="m-auto"
                    onClick={handleRenewWithDiscount}
                >
                    Renew Now
                </Button>
            </div>
        </Modal>
    );
};

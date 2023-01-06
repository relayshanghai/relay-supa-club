import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { StripePlanWithPrice } from 'types';

import { Button } from '../button';
import { Modal } from '../modal';

export const SubscriptionConfirmModal = ({
    confirmModalData,
    setConfirmModalData,
    subscription,
    createSubscriptions
}: {
    confirmModalData: StripePlanWithPrice | null;
    setConfirmModalData: (value: StripePlanWithPrice | null) => void;
    subscription?: any;
    createSubscriptions: (planId: string) => void;
}) => {
    const { t } = useTranslation();
    const handleCreateSubscription = async (priceId: string) => {
        const id = toast.loading(t('account.subscription.modal.subscribing'));
        try {
            await createSubscriptions(priceId);
            setConfirmModalData(null);
            toast.success(t('account.subscription.modal.subscriptionPurchased'), { id });
        } catch (e) {
            toast.error(t('account.subscription.modal.wentWrong'), {
                id
            });
        }
    };
    return (
        <Modal
            title={`${confirmModalData?.name}${t('account.subscription.modal.planFor')}${
                confirmModalData?.metadata.usage_limit
            }${t('account.subscription.modal.monthlyProfiles')}`}
            visible={!!confirmModalData}
            onClose={() => setConfirmModalData(null)}
        >
            <h2 className="py-4">{t('account.subscription.modal.availableSubscriptions')}</h2>
            <div className="flex flex-col space-y-8">
                {confirmModalData?.prices?.map((price, i) => {
                    const priceAmount = (Number(price.amount) / 100).toFixed(0);
                    return (
                        <div key={i} className="flex flex-row justify-between">
                            <div className="text-sm font-bold space-y-1 flex-col flex items-start">
                                <p>
                                    {priceAmount}
                                    {` `}
                                    {price.currency.toUpperCase()} / {price.interval}{' '}
                                </p>
                                {price.interval === 'year' && (
                                    <p className="text-xs rounded p-1 bg-green-200">
                                        {t('account.subscription.modal.bestValue_price', {
                                            price: priceAmount
                                        })}
                                    </p>
                                )}
                                {price.id === subscription?.plan?.id && (
                                    <span className="text-xs bg-gray-200 p-1 rounded">
                                        {t('account.subscription.active')}
                                    </span>
                                )}
                            </div>
                            <div className="text-sm font-bold">
                                <Button
                                    disabled={price.id === subscription?.plan?.id}
                                    variant={price.interval === 'year' ? 'primary' : 'secondary'}
                                    onClick={() => handleCreateSubscription(price.id)}
                                >
                                    {t('account.subscription.modal.subscribe')}
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="text-xs text-gray-600 mt-4">
                {t('account.subscription.modal.noteClickingSubscribeWillCharge')}
            </div>
            <div className="pt-8 space-x-16 justify-center flex flex-row w-full">
                <Button variant="secondary" onClick={async () => setConfirmModalData(null)}>
                    {t('account.subscription.modal.cancel')}
                </Button>
            </div>
        </Modal>
    );
};

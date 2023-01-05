import { useContext } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import { Button } from '../button';
import { Modal } from '../modal';
import { AccountContext } from './account-context';

export const SubscriptionConfirmModal = () => {
    const { subscription, createSubscriptions, confirmModalData, setConfirmModalData } =
        useContext(AccountContext);
    const { t } = useTranslation();
    return (
        <Modal
            title={`${confirmModalData?.name}${t('account.subscription.modal.planFor')}${
                confirmModalData?.usage_limit
            }${t('account.subscription.modal.monthlyProfiles')}`}
            visible={confirmModalData.show || false}
            onClose={() => setConfirmModalData({ show: false })}
        >
            <h2 className="py-4">{t('account.subscription.modal.availableSubscriptions')}</h2>
            <div className="flex flex-col space-y-8">
                {confirmModalData.prices?.map((price, i) => {
                    return (
                        <div key={i} className="flex flex-row justify-between">
                            <div className="text-sm font-bold space-y-1 flex-col flex items-start">
                                <p>
                                    {Number(price.amount / 100).toLocaleString()}
                                    {` `}
                                    {price.currency.toUpperCase()} / {price.interval}{' '}
                                </p>
                                {price.interval === 'year' && (
                                    <p className="text-xs rounded p-1 bg-green-200">
                                        {'Best value: ' +
                                            Number(price.amount / 100 / 12).toLocaleString() +
                                            ' ' +
                                            price.currency.toUpperCase() +
                                            ' / month'}
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
                                    onClick={async () => {
                                        const id = toast.loading(
                                            t('account.subscription.modal.subscribing')
                                        );
                                        try {
                                            await createSubscriptions(price.id);
                                            setConfirmModalData({ show: false });
                                            toast.success(
                                                t(
                                                    'account.subscription.modal.subscriptionPurchased'
                                                ),
                                                { id }
                                            );
                                        } catch (e) {
                                            toast.error(t('account.subscription.modal.wentWrong'), {
                                                id
                                            });
                                        }
                                    }}
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
                <Button
                    variant="secondary"
                    onClick={async () => setConfirmModalData({ show: false })}
                >
                    {t('account.subscription.modal.cancel')}
                </Button>
            </div>
        </Modal>
    );
};

import { useContext } from 'react';
import toast from 'react-hot-toast';

import { Button } from '../button';
import { Modal } from '../modal';
import { AccountContext } from './account-context';

export const SubscriptionConfirmModal = () => {
    const { subscription, createSubscriptions, confirmModalData, setConfirmModalData } =
        useContext(AccountContext);

    return (
        <Modal
            title={`${confirmModalData?.name} plan for ${confirmModalData?.usage_limit} monthly profiles`}
            visible={confirmModalData.show || false}
            onClose={() => setConfirmModalData({ show: false })}
        >
            <div className="py-4">These are available subscriptions</div>
            <div className="flex flex-col space-y-8">
                {confirmModalData.prices?.map((price: any, i: any) => {
                    return (
                        <div key={i} className="flex flex-row justify-between">
                            <div className="text-sm font-bold space-y-1 flex-col flex items-start">
                                <div>
                                    {Number(price.amount / 100).toLocaleString()}
                                    {` `}
                                    {price.currency.toUpperCase()} / {price.interval}{' '}
                                </div>
                                {price.interval === 'year' ? (
                                    <div className="text-xs rounded p-1 bg-green-200">
                                        {'Best value: ' +
                                            Number(price.amount / 100 / 12).toLocaleString() +
                                            ' ' +
                                            price.currency.toUpperCase() +
                                            ' / month'}
                                    </div>
                                ) : null}
                                {price.id === subscription?.plan?.id ? (
                                    <span className="text-xs bg-gray-200 p-1 rounded">Active</span>
                                ) : null}
                            </div>
                            <div className="text-sm font-bold">
                                <Button
                                    disabled={price.id === subscription?.plan?.id}
                                    variant={price.interval === 'year' ? 'primary' : 'secondary'}
                                    onClick={async () => {
                                        const id = toast.loading('Subscribing...');
                                        try {
                                            await createSubscriptions(price.id);
                                            setConfirmModalData({ show: false });
                                            toast.success('Subscription purchased', { id });
                                        } catch (e) {
                                            toast.error('Ops, something went wrong', { id });
                                        }
                                    }}
                                >
                                    Subscribe
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="text-xs text-gray-600 mt-4">
                Note that clicking `Subscribe` will charge the default payment method.
            </div>
            <div className="pt-8 space-x-16 justify-center flex flex-row w-full">
                <Button
                    variant="secondary"
                    onClick={async () => setConfirmModalData({ show: false })}
                >
                    Cancel
                </Button>
            </div>
        </Modal>
    );
};

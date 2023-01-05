import { useContext } from 'react';
import toast from 'react-hot-toast';
import { Button } from '../button';
import { Modal } from '../modal';
import { AccountContext } from './account-context';

export const SubscriptionConfirmModal = () => {
    const { subscription, createSubscriptions, confirmModal, setShowConfirmModal } =
        useContext(AccountContext);

    return (
        <Modal
            title={`${confirmModal?.name} plan for ${confirmModal?.metadata.usage_limit} monthly profiles`}
            visible={!!confirmModal}
            onClose={() => {
                setShowConfirmModal(undefined);
            }}
        >
            <div className="py-4">These are available subscriptions</div>
            <div className="flex flex-col space-y-8">
                {confirmModal?.prices.map((price: any, i: any) => {
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
                                            setShowConfirmModal(undefined);
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
                    onClick={async () => {
                        setShowConfirmModal(undefined);
                    }}
                >
                    Cancel
                </Button>
            </div>
        </Modal>
    );
};

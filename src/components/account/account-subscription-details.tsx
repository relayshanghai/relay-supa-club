import { format } from 'date-fns';
import { useContext } from 'react';
import { Button } from '../button';
import { AccountContext } from './account-context';
import { SubscriptionConfirmModal } from './subscription-confirm-modal';

export const SubscriptionDetails = () => {
    const { loading, subscription, plans, paymentMethods, setConfirmModalData, profile, company } =
        useContext(AccountContext);
    return (
        <div className="flex flex-col items-start space-y-4 p-4 bg-white rounded-lg w-full lg:max-w-2xl">
            <SubscriptionConfirmModal />

            <div className="flex flex-row justify-between w-full items-center">
                <div>Subscription</div>
                <div className="flex flex-row justify-end">
                    <Button
                        variant="secondary"
                        onClick={() => {
                            window.open(`/api/subscriptions/portal?id=${company?.id}`);
                        }}
                    >
                        View billing portal
                    </Button>
                </div>
            </div>
            <div className={`flex flex-row space-x-4 ${loading ? 'opacity-50' : ''}`}>
                {subscription ? (
                    <div className="flex flex-col space-y-2">
                        <div>
                            You currently are on <b>{subscription.product.name}</b> plan, which
                            gives you a total of <b>{subscription.product.metadata.usage_limit}</b>{' '}
                            monthly profiles at{' '}
                            <b>
                                {Number(subscription.plan.amount / 100).toLocaleString()} {` `}
                                {subscription.plan.currency.toUpperCase()}
                            </b>{' '}
                            / <b>{subscription.plan.interval}</b>. You are on a{' '}
                            <b>{subscription.plan.interval}</b> cycle which will end on{' '}
                            <b>
                                {format(
                                    new Date(subscription.current_period_end * 1e3),
                                    'MMM dd, Y'
                                )}
                            </b>
                            .
                        </div>
                        <div>Not enough? checkout the available plans below.</div>
                    </div>
                ) : (
                    <div className="text-sm py-2 text-gray-500">
                        You have no active subscription. Please purchase one below.
                    </div>
                )}
            </div>
            {paymentMethods?.data.length === 0 ? (
                <div className="w-full">
                    <div>Before purchasing a subscription, you need to add a payment method. </div>
                    <div className="flex flex-row justify-end">
                        <Button
                            onClick={() => {
                                window.open(`/api/subscriptions/portal?id=${company?.id}`);
                            }}
                        >
                            Add payment method
                        </Button>
                    </div>
                </div>
            ) : null}
            {paymentMethods?.data.length !== 0 && Array.isArray(plans) ? (
                <div className="w-full pt-8 divide-y divide-gray-200">
                    <div className="pb-4">Available plans</div>
                    {plans.map((item: any, i: any) => {
                        return (
                            <div
                                key={item.id}
                                className="flex flex-row space-x-2 items-center justify-between w-full py-2"
                            >
                                <div className="text-sm font-bold w-1/4">
                                    {i === 0 ? (
                                        <div className="text-xs text-gray-500 font-normal">
                                            Name
                                        </div>
                                    ) : null}
                                    {item.name}{' '}
                                    {item.name === subscription?.product.name ? (
                                        <span className="text-xs bg-gray-200 p-1 rounded">
                                            Active
                                        </span>
                                    ) : null}
                                </div>
                                <div className="text-sm font-bold w-1/4">
                                    {i === 0 ? (
                                        <div className="text-xs text-gray-500 font-normal">
                                            Monthly profiles
                                        </div>
                                    ) : null}
                                    {item.metadata.usage_limit}
                                </div>
                                {profile?.admin ? (
                                    <div className="text-sm font-bold w-2/6 flex flex-row justify-end">
                                        <Button
                                            disabled={item.id === subscription?.plan_id}
                                            onClick={async () => {
                                                setConfirmModalData(item);
                                            }}
                                        >
                                            Starting from{' '}
                                            {Number(item.prices[1]?.amount / 100).toLocaleString()}{' '}
                                            / {item.prices[1]?.interval}
                                        </Button>
                                    </div>
                                ) : null}
                            </div>
                        );
                    })}
                </div>
            ) : null}
        </div>
    );
};

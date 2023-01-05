import { format } from 'date-fns';
import Link from 'next/link';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SECONDS_IN_MILLISECONDS } from 'src/constants/conversions';
import { useSubscription } from 'src/hooks/use-subscription';
import { Button } from '../button';
import { AccountContext } from './account-context';
import { ConfirmModalData, SubscriptionConfirmModal } from './subscription-confirm-modal';

export const SubscriptionDetails = () => {
    const {
        subscription: subscriptionWrongType,
        plans,
        paymentMethods,
        createSubscriptions
    } = useSubscription();

    // TODO: investigate why this type doesn't seem to match our code's usage
    const subscription = subscriptionWrongType as any;
    const [confirmModalData, setConfirmModalData] = useState<ConfirmModalData>({});

    const { userDataLoading, profile, company } = useContext(AccountContext);

    const { t } = useTranslation();
    return (
        <div className="flex flex-col items-start space-y-4 p-4 bg-white rounded-lg w-full lg:max-w-2xl">
            <SubscriptionConfirmModal
                subscription={subscription}
                createSubscriptions={createSubscriptions}
                confirmModalData={confirmModalData}
                setConfirmModalData={setConfirmModalData}
            />

            <div className="flex flex-row justify-between w-full items-center">
                <h2>{t('account.subscription.title')}</h2>
                <div className="flex flex-row justify-end">
                    <Button variant="secondary">
                        <Link href={`/api/subscriptions/portal?id=${company?.id}`}>
                            <a>{t('account.subscription.viewBillingPortal')}</a>
                        </Link>
                    </Button>
                </div>
            </div>
            <div className={`flex flex-row space-x-4 ${userDataLoading ? 'opacity-50' : ''}`}>
                {subscription?.product ? (
                    <div className="flex flex-col space-y-2">
                        <p>
                            {t('account.subscription.youAreCurrentlyOn')}
                            <b>{subscription.product.name}</b>{' '}
                            {t('account.subscription.planWhichGivesYouATotalOf')}
                            <b>{subscription.product.metadata.usage_limit}</b>
                            {t('account.subscription.monthlyProfilesAt')}
                            <b>
                                {Number(subscription.plan.amount / 100).toLocaleString()} {` `}
                                {subscription.plan.currency.toUpperCase()}
                            </b>{' '}
                            / <b>{subscription.plan.interval}</b>
                            {t('account.subscription.youAreOnA')}
                            <b>{subscription.plan.interval}</b>
                            {t('account.subscription.cycleWhichWillEndOn')}
                            <b>
                                {format(
                                    new Date(
                                        subscription.current_period_end * SECONDS_IN_MILLISECONDS
                                    ),
                                    'MMM dd, Y'
                                )}
                            </b>
                            .
                        </p>
                        <p>{t('account.subscription.notEnoughCheckOutPlansBelow')}</p>
                    </div>
                ) : (
                    <p className="text-sm py-2 text-gray-500">
                        {t('account.subscription.youHaveNoActiveSubscriptionPleasePurchaseBelow')}
                    </p>
                )}
            </div>
            {paymentMethods?.data?.length === 0 ? (
                <div className="w-full">
                    <p>{t('account.subscription.beforePurchasingYouNeedPaymentMethod')}</p>
                    <div className="flex flex-row justify-end">
                        <Button>
                            <Link href={`/api/subscriptions/portal?id=${company?.id}`}>
                                <a> {t('account.subscription.addPaymentMethod')}</a>
                            </Link>
                        </Button>
                    </div>
                </div>
            ) : null}
            {paymentMethods?.data?.length !== 0 && Array.isArray(plans) ? (
                <div className="w-full pt-8 divide-y divide-gray-200">
                    <div className="pb-4">{t('account.subscription.availablePlans')}</div>
                    {plans.map((item, i) => {
                        return (
                            <div
                                key={item.id}
                                className="flex flex-row space-x-2 items-center justify-between w-full py-2"
                            >
                                <div className="text-sm font-bold w-1/4">
                                    {i === 0 && (
                                        <p className="text-xs text-gray-500 font-normal">
                                            {t('account.subscription.planName')}
                                        </p>
                                    )}
                                    {item.name}{' '}
                                    {item.name === subscription?.product?.name && (
                                        <p className="text-xs bg-gray-200 p-1 rounded">
                                            {t('account.subscription.active')}
                                        </p>
                                    )}
                                </div>
                                <div className="text-sm font-bold w-1/4">
                                    {i === 0 && (
                                        <p className="text-xs text-gray-500 font-normal">
                                            {t('account.subscription.monthlyProfiles')}
                                        </p>
                                    )}
                                    {item.metadata.usage_limit}
                                </div>
                                {profile?.admin && (
                                    <div className="text-sm font-bold w-2/6 flex flex-row justify-end">
                                        <Button
                                            disabled={item.id === subscription?.plan_id}
                                            onClick={() => setConfirmModalData(item)}
                                        >
                                            {Number(item.prices[1]?.amount / 100).toLocaleString()}{' '}
                                            / {item.prices[1]?.interval}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : null}
        </div>
    );
};

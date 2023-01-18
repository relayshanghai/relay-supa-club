import { format } from 'date-fns';
import Link from 'next/link';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SECONDS_IN_MILLISECONDS } from 'src/constants/conversions';
import { useSubscription } from 'src/hooks/use-subscription';
import { StripePlanWithPrice } from 'types';
import { Button } from '../button';
import { AccountContext } from './account-context';
import { SubscriptionConfirmModal } from './subscription-confirm-modal';

export const SubscriptionDetails = () => {
    const {
        subscription: subscriptionWrongType,
        paymentMethods,
        createSubscriptions
    } = useSubscription();

    // TODO: investigate why this type doesn't seem to match our code's usage
    const subscription = subscriptionWrongType as any;
    const [confirmModalData, setConfirmModalData] = useState<StripePlanWithPrice | null>(null);

    const { userDataLoading, company } = useContext(AccountContext);

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
            {paymentMethods?.data?.length === 0 && (
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
            )}
            <Link href="/pricing">
                <Button>Upgrade subscription</Button>
            </Link>
        </div>
    );
};

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCompany } from 'src/hooks/use-company';
import { useSubscription } from 'src/hooks/use-subscription';
import { useUsages } from 'src/hooks/use-usages';
import { useUser } from 'src/hooks/use-user';
import { checkStripeAndDatabaseMatch } from 'src/utils/usagesHelpers';
import { unixEpochToISOString } from 'src/utils/utils';

import { Button } from '../button';
import { Spinner } from '../icons';
import { CancelSubscriptionModal } from './modal-cancel-subscription';
import { useRudderstack } from 'src/hooks/use-rudderstack';
import { ACCOUNT_SUBSCRIPTION } from 'src/utils/rudderstack/event-names';

export const SubscriptionDetails = () => {
    const { subscription } = useSubscription();
    const { company, refreshCompany, isExpired } = useCompany();
    const { loading: userDataLoading } = useUser();
    const { t, i18n } = useTranslation();
    const { trackEvent } = useRudderstack();

    const [showCancelModal, setShowCancelModal] = useState(false);
    const handleCancelSubscription = async () => {
        setShowCancelModal(true);
        trackEvent(ACCOUNT_SUBSCRIPTION('open cancel subscription modal'));
    };
    checkStripeAndDatabaseMatch(company, subscription);

    // these we get from stripe directly
    // This is just the billing period, not the monthly 'usage' period
    const periodStart = unixEpochToISOString(subscription?.current_period_start);
    const periodEnd = unixEpochToISOString(subscription?.current_period_end);

    const subscriptionEndDate = company?.subscription_end_date;

    const { usages, refreshUsages } = useUsages(
        true,
        periodStart && periodEnd
            ? { thisMonthStartDate: new Date(periodStart), thisMonthEndDate: new Date(periodEnd) }
            : undefined,
    );

    const statusColor = subscriptionEndDate ? ' bg-red-100 text-red-500' : ' bg-green-100 text-green-500';

    useEffect(() => {
        refreshCompany();
        refreshUsages();
    }, [company, refreshCompany, refreshUsages]);

    return (
        <div className="flex w-full flex-col items-start space-y-4 rounded-lg bg-white p-4 shadow-lg shadow-gray-200 lg:max-w-2xl">
            <CancelSubscriptionModal
                visible={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                periodEnd={periodEnd}
            />
            <div className="flex w-full flex-row items-center justify-between">
                <h2 className="text-lg font-bold">{t('account.subscription.title')}</h2>
            </div>
            {company ? (
                <>
                    <div className={`w-full ${userDataLoading ? 'opacity-50' : ''}`}>
                        <div className="w-ful flex flex-col space-y-2">
                            {subscription && (
                                <div className={`mb-8 w-full md:flex md:flex-wrap md:justify-between`}>
                                    <div className="flex min-w-fit flex-col space-y-2 p-4">
                                        <div className="text-xs font-medium uppercase text-gray-600 ">
                                            {t('account.subscription.plan')}
                                        </div>
                                        <div className="py-1 text-sm font-semibold">
                                            {t(`account.plans.${subscription.name.toLowerCase()}`)}
                                            {subscription.status === 'trial' &&
                                                ` - ${t('account.subscription.freeTrial')}`}
                                            {subscription.status === 'paused' &&
                                                ` - ${t('account.subscription.trialExpired')}`}
                                            {isExpired && ` - ${t('account.subscription.canceled')}`}
                                        </div>
                                    </div>
                                    <div className="flex min-w-fit flex-col space-y-2 p-4">
                                        <div className="text-xs font-medium uppercase text-gray-600 ">
                                            {t('account.subscription.paymentCycle')}
                                        </div>
                                        <div className="py-1 text-sm font-semibold">
                                            {t(`account.subscription.${subscription.interval}`)}
                                        </div>
                                    </div>

                                    {subscription.status !== 'canceled' && periodEnd && (
                                        <div className="flex min-w-fit flex-col space-y-2 p-4">
                                            <div className="text-xs font-medium uppercase text-gray-600 ">
                                                {t('account.subscription.renewsOn')}
                                            </div>
                                            <div className="py-1 text-sm font-semibold text-gray-700">
                                                {new Date(subscriptionEndDate ?? periodEnd).toLocaleDateString(
                                                    i18n.language,
                                                    {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    },
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex min-w-fit flex-col p-4">
                                        <div className="text-xs font-medium uppercase text-gray-600">
                                            {t('account.subscription.subscriptionStatus')}
                                        </div>
                                        <div
                                            className={`w-fit whitespace-nowrap rounded-md px-3 py-2 text-center text-xs  ${statusColor} mt-1`}
                                        >
                                            {subscriptionEndDate
                                                ? t('account.subscription.canceled')
                                                : t(`account.subscription.${subscription.status}`)}
                                        </div>
                                    </div>
                                    {subscriptionEndDate && (
                                        <div className="flex min-w-fit flex-col space-y-2 p-4">
                                            <div className="text-sm text-red-500">
                                                {t('account.subscription.canceledMessage', {
                                                    expirationDate: new Date(subscriptionEndDate).toLocaleDateString(
                                                        i18n.language,
                                                        {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                        },
                                                    ),
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                            <table>
                                <thead>
                                    <tr className="text-xs font-medium text-gray-600 ">
                                        <th className="px-4 py-2 text-left">{t('account.subscription.usageLimits')}</th>
                                        <th className="px-4 py-2 text-right">
                                            {t('account.subscription.usedThisMonth')}
                                        </th>
                                        <th className="px-4 py-2 text-right">
                                            {t('account.subscription.monthlyLimit')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    <tr>
                                        <td className="border px-4 py-2">
                                            {t('account.subscription.profilesUnlocked')}
                                        </td>
                                        <td className="border px-4 py-2 text-right">{usages.profile.current}</td>
                                        <td className="border px-4 py-2 text-right">{usages.profile.limit}</td>
                                    </tr>
                                    <tr>
                                        <td className="border px-4 py-2">{t('account.subscription.searches')}</td>
                                        <td className="border px-4 py-2 text-right">{usages.search.current}</td>
                                        <td className="border px-4 py-2 text-right">{usages.search.limit}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="flex w-full justify-end space-x-6 pt-5">
                        {!subscriptionEndDate && (
                            <Button onClick={handleCancelSubscription} variant="secondary">
                                {t('account.subscription.cancelSubscription')}
                            </Button>
                        )}
                        <Link href="/upgrade">
                            <Button
                                onClick={() =>
                                    // @note previous name: Account, Subscription, click upgrade subscription and go to pricing page
                                    trackEvent('Start Upgrade Subscription')
                                }
                            >
                                {t('account.subscription.upgradeSubscription')}
                            </Button>
                        </Link>
                    </div>
                </>
            ) : (
                <div className="flex w-full justify-center">
                    {/* TODO task V2-32: make skeleton */}
                    <Spinner className="h-8 w-8 fill-primary-400 text-white" />
                </div>
            )}
        </div>
    );
};

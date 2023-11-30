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
                    <div className={`flex flex-row space-x-4 ${userDataLoading ? 'opacity-50' : ''}`}>
                        <div className="flex flex-col space-y-2 ">
                            {subscription && (
                                <div className={`mb-8 w-full space-y-6`}>
                                    <div className="flex flex-col space-y-2">
                                        <div className="text-sm">{t('account.subscription.plan')}</div>
                                        <div className="ml-2 text-sm font-semibold">
                                            {t(`account.plans.${subscription.name.toLowerCase()}`)}
                                            {subscription.status === 'trial' &&
                                                ` - ${t('account.subscription.freeTrial')}`}
                                            {subscription.status === 'paused' &&
                                                ` - ${t('account.subscription.trialExpired')}`}
                                            {isExpired && ` - ${t('account.subscription.canceled')}`}
                                        </div>
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <div className="text-sm">{t('account.subscription.paymentCycle')}</div>
                                        <div className="ml-2 text-sm font-semibold">
                                            {t(`account.subscription.${subscription.interval}`)}
                                        </div>
                                    </div>
                                    {subscriptionEndDate && (
                                        <div className="flex flex-col space-y-2">
                                            <div className="text-sm ">
                                                {t('account.subscription.subscriptionStatus')}
                                            </div>

                                            <div className="ml-2 text-sm font-semibold">
                                                {' '}
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
                                    {subscription.status !== 'canceled' && periodEnd && !subscriptionEndDate && (
                                        <div className="flex flex-col space-y-2">
                                            <div className="text-sm">{t('account.subscription.renewsOn')}</div>
                                            <div className="ml-2 text-sm font-semibold text-gray-700">
                                                {new Date(periodEnd).toLocaleDateString(i18n.language, {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                            <table>
                                <thead>
                                    <tr className="text-sm font-medium">
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

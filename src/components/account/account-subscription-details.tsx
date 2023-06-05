import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCompany } from 'src/hooks/use-company';
import { useSubscription } from 'src/hooks/use-subscription';
import { useUsages } from 'src/hooks/use-usages';
import { useUser } from 'src/hooks/use-user';
import { buildSubscriptionPortalUrl } from 'src/utils/api/stripe/portal';
import { clientLogger } from 'src/utils/logger-client';
import { getCurrentMonthPeriod } from 'src/utils/usagesHelpers';
import { unixEpochToISOString } from 'src/utils/utils';

import { Button } from '../button';
import { Spinner } from '../icons';
import { CancelSubscriptionModal } from './modal-cancel-subscription';
import type { CompanyDB } from 'src/utils/api/db';

const checkStripeAndDatabaseMatch = (
    company?: CompanyDB,
    thisMonthStartDate?: Date | null,
    thisMonthEndDate?: Date | null,
) => {
    // company?.subscription_current_period_start and end are updated when we detect current period has ended (in utils/api/db/usages), we query stripe and update the company
    if (company?.subscription_current_period_start && thisMonthStartDate && thisMonthEndDate) {
        // a debug, just to warn a developer if these aren't matching, maybe there is something wrong with the data
        const { thisMonthStartDate: companyThisMonthStartDate, thisMonthEndDate: companyThisMonthEndDate } =
            getCurrentMonthPeriod(new Date(company?.subscription_current_period_start));
        if (
            companyThisMonthStartDate.toISOString() !== thisMonthStartDate.toISOString() ||
            companyThisMonthEndDate.toISOString() !== thisMonthEndDate.toISOString()
        ) {
            clientLogger(
                `Company subscription this month period start/end does not match subscription this month period start/end. companyPeriodStart ${companyThisMonthStartDate.toISOString()} periodStart ${thisMonthStartDate.toISOString()}companyPeriodEnd ${companyThisMonthEndDate.toISOString()} periodEnd ${thisMonthEndDate.toISOString()}`,
                'warn',
            );
        }
    }
};

export const SubscriptionDetails = () => {
    const { subscription } = useSubscription();
    const { company, refreshCompany } = useCompany();
    const { loading: userDataLoading } = useUser();
    const { t, i18n } = useTranslation();

    const [showCancelModal, setShowCancelModal] = useState(false);
    const handleCancelSubscription = async () => setShowCancelModal(true);

    // these we get from stripe directly
    // This is just the billing period, not the monthly 'usage' period
    const periodStart = unixEpochToISOString(subscription?.current_period_start);
    const periodEnd = unixEpochToISOString(subscription?.current_period_end);

    const currentMonth = periodStart
        ? getCurrentMonthPeriod(new Date(periodStart))
        : { thisMonthStartDate: undefined, thisMonthEndDate: undefined };

    const thisMonthStartDate = currentMonth.thisMonthStartDate;
    const thisMonthEndDate = currentMonth.thisMonthEndDate;

    const { usages: currentMonthUsages, refreshUsages } = useUsages(
        true,
        thisMonthStartDate ? thisMonthStartDate.toISOString() : undefined,
        thisMonthEndDate ? thisMonthEndDate.toISOString() : undefined,
    );
    checkStripeAndDatabaseMatch(company, thisMonthStartDate, thisMonthEndDate);

    const profileViewUsagesThisMonth = currentMonthUsages?.filter(({ type }) => type === 'profile');

    const searchUsagesThisMonth = currentMonthUsages?.filter(({ type }) => type === 'search');
    const aiEmailUsagesThisMonth = currentMonthUsages?.filter(({ type }) => type === 'ai_email');

    useEffect(() => {
        refreshCompany();
        refreshUsages();
    }, [company, refreshCompany, refreshUsages]);

    return (
        <div className="flex w-full flex-col items-start space-y-4 rounded-lg bg-white p-4 shadow-lg shadow-gray-200 lg:max-w-2xl">
            <CancelSubscriptionModal visible={showCancelModal} onClose={() => setShowCancelModal(false)} />
            <div className="flex w-full flex-row items-center justify-between">
                <h2 className="text-lg font-bold">{t('account.subscription.title')}</h2>
                <div className="flex flex-row justify-end">
                    {company?.id && (
                        <Link href={buildSubscriptionPortalUrl({ id: company.id })}>
                            <Button variant="secondary">{t('account.subscription.viewBillingPortal')}</Button>
                        </Link>
                    )}
                </div>
            </div>
            {company && profileViewUsagesThisMonth ? (
                <>
                    <div className={`flex flex-row space-x-4 ${userDataLoading ? 'opacity-50' : ''}`}>
                        <div className="flex flex-col space-y-2 ">
                            {subscription && (
                                <div className={`mb-8 w-full space-y-6`}>
                                    <div className="flex flex-col space-y-3">
                                        <div className="text-sm">{t('account.subscription.plan')}</div>
                                        <div className="ml-2 text-sm font-bold">
                                            {subscription.name}
                                            {subscription.status === 'trialing' &&
                                                ` - ${t('account.subscription.freeTrial')}`}
                                            {subscription.status === 'canceled' &&
                                                ` - ${t('account.subscription.canceled')}`}
                                        </div>
                                    </div>
                                    <div className="flex flex-col space-y-3">
                                        <div className="text-sm">{t('account.subscription.paymentCycle')}</div>
                                        <div className="ml-2 text-sm font-bold">
                                            {t(`account.subscription.${subscription.interval}`)}
                                        </div>
                                    </div>
                                    {subscription.status !== 'canceled' && periodEnd && (
                                        <div className="flex flex-col space-y-3">
                                            <div className="text-sm">{t('account.subscription.renewsOn')}</div>
                                            <div className="ml-2 text-sm font-bold">
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
                                    <tr>
                                        <th className="p-2 pl-4 text-left  font-bold">
                                            {t('account.subscription.usageLimits')}
                                        </th>
                                        <th className="px-4 text-right font-medium">
                                            {t('account.subscription.usedThisMonth')}
                                        </th>
                                        <th className="px-4 text-right font-medium">
                                            {t('account.subscription.monthlyLimit')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border px-4 py-2">
                                            {t('account.subscription.profilesUnlocked')}
                                        </td>
                                        <td className="border px-4 py-2 text-right">
                                            {profileViewUsagesThisMonth?.length}
                                        </td>
                                        <td className="border px-4 py-2 text-right">
                                            {company.subscription_status === 'trial'
                                                ? company.trial_profiles_limit
                                                : company.profiles_limit}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border px-4 py-2">{t('account.subscription.searches')}</td>
                                        <td className="border px-4 py-2 text-right">{searchUsagesThisMonth?.length}</td>
                                        <td className="border px-4 py-2 text-right">
                                            {company.subscription_status === 'trial'
                                                ? company.trial_searches_limit
                                                : company.searches_limit}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border px-4 py-2">
                                            {t('account.subscription.aiEmailGeneration')}
                                        </td>
                                        <td className="border px-4 py-2 text-right">
                                            {aiEmailUsagesThisMonth?.length}
                                        </td>
                                        <td className="border px-4 py-2 text-right">
                                            {company.subscription_status === 'trial'
                                                ? company.trial_ai_email_generator_limit
                                                : company.ai_email_generator_limit}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="flex w-full justify-end space-x-6 pt-5">
                        <Button onClick={handleCancelSubscription} variant="secondary">
                            {t('account.subscription.cancelSubscription')}
                        </Button>
                        <Link href="/pricing">
                            <Button>{t('account.subscription.upgradeSubscription')}</Button>
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

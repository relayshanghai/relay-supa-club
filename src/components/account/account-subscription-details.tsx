import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCompany } from 'src/hooks/use-company';
import { useSubscription } from 'src/hooks/use-subscription';
import { useUsages } from 'src/hooks/use-usages';
import { checkStripeAndDatabaseMatch } from 'src/utils/usagesHelpers';
import { unixEpochToISOString } from 'src/utils/utils';
import { Button } from 'shadcn/components/ui/button';
import { CancelSubscriptionModal } from './modal-cancel-subscription';
import { useRudderstack } from 'src/hooks/use-rudderstack';
import { ACCOUNT_SUBSCRIPTION } from 'src/utils/rudderstack/event-names';
import { Progress } from 'shadcn/components/ui/progress';
import { Rocket } from '../icons';
import { Skeleton } from 'shadcn/components/ui/skeleton';

const Tablet = ({
    children,
    customStyle,
    textSize = 'text-sm',
}: {
    children: React.ReactNode;
    customStyle: string;
    textSize?: string;
}) => {
    return <span className={`rounded-lg border px-2 py-0.5 font-medium ${customStyle} ${textSize}`}>{children}</span>;
};

export const SubscriptionDetails = () => {
    const { subscription } = useSubscription();

    const { company, refreshCompany } = useCompany();
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

    const subscriptionEndDate = useMemo(() => company?.subscription_end_date, [company]);
    const canceledNotExpired = (subscriptionEndDate && new Date(subscriptionEndDate) > new Date()) || false;
    const { usages, refreshUsages } = useUsages(
        true,
        periodStart && periodEnd
            ? { thisMonthStartDate: new Date(periodStart), thisMonthEndDate: new Date(periodEnd) }
            : undefined,
    );

    const statusColor = useMemo(() => {
        if (canceledNotExpired && subscription?.status === 'canceled') {
            return ' bg-red-100 text-red-700 border-red-200 text-sm';
        } else if (subscription?.status === 'active') {
            return 'bg-green-100 text-green-700 border-green-200 text-sm';
        } else if (subscription?.status === 'trial') {
            return 'bg-yellow-100 text-yellow-700 border-yellow-200 text-sm';
        } else {
            return 'bg-gray-100 text-gray-700 border-gray-200 text-sm';
        }
    }, [canceledNotExpired, subscription]);

    useEffect(() => {
        refreshCompany();
        refreshUsages();
    }, [company, refreshCompany, refreshUsages]);

    return (
        <section id="subscription-details" className="w-full">
            <p className="pb-6 font-semibold">Plan</p>
            <hr className="pb-5" />
            <section className="flex w-full justify-end">
                <section className="flex w-full flex-col items-end">
                    <div className="flex flex-col space-y-4 rounded-lg border border-gray-200 bg-white p-6 pb-12 lg:w-3/4">
                        <CancelSubscriptionModal
                            visible={showCancelModal}
                            onClose={() => setShowCancelModal(false)}
                            periodEnd={periodEnd}
                        />
                        {company && subscription ? (
                            <>
                                <section className="flex">
                                    <div className="flex w-full flex-col items-start justify-between">
                                        <h2 className="flex items-start gap-3 text-4xl font-semibold text-gray-900">
                                            <span>{t(`account.plans.${subscription?.name.toLowerCase()}`)}</span>
                                            <Tablet customStyle={statusColor}>
                                                {!canceledNotExpired
                                                    ? t('account.subscription.canceled')
                                                    : t(`account.subscription.${subscription?.status}`)}
                                            </Tablet>
                                            {subscription?.status === 'active' && canceledNotExpired && (
                                                <Tablet customStyle="bg-gray-100 text-gray-700 border-gray-200">
                                                    <span className="font-semibold">
                                                        {t('account.subscription.expirationDate')}
                                                        {': '}
                                                    </span>
                                                    <span>
                                                        {new Date(
                                                            subscriptionEndDate ?? (periodEnd as string | number),
                                                        ).toLocaleDateString(i18n.language, {
                                                            month: 'short',
                                                            day: 'numeric',
                                                        })}
                                                    </span>
                                                </Tablet>
                                            )}
                                        </h2>
                                        <h2 className="text-sm font-normal text-gray-600">
                                            {t(`account.plans.details`)}
                                        </h2>
                                    </div>
                                    <div className="flex w-full flex-col items-end gap-2">
                                        <div className="flex h-fit gap-3">
                                            <Tablet customStyle={statusColor}>
                                                {!canceledNotExpired
                                                    ? t('account.subscription.canceled')
                                                    : t(`account.subscription.${subscription?.status}`)}
                                            </Tablet>
                                            {!['trial', 'canceled', 'paused'].includes(subscription.status) && (
                                                <Tablet
                                                    customStyle={'bg-primary-100 text-primary-700 border-primary-200'}
                                                >
                                                    {t(`account.subscription.${subscription?.interval}`)}
                                                </Tablet>
                                            )}
                                        </div>
                                        <div className="text-sm">
                                            <span className="font-semibold text-gray-600">
                                                {subscription?.status === 'active' && !canceledNotExpired
                                                    ? t('account.subscription.renewsOn')
                                                    : t('account.subscription.expirationDate')}
                                                {': '}
                                            </span>
                                            <span>
                                                {new Date(
                                                    subscriptionEndDate ?? (periodEnd as string | number),
                                                ).toLocaleDateString(i18n.language, {
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </span>
                                        </div>
                                        <p
                                            onClick={handleCancelSubscription}
                                            className="cursor-pointer text-sm font-semibold text-red-400"
                                        >
                                            {t('account.subscription.cancelSubscription')}
                                        </p>
                                    </div>
                                </section>

                                <section className="flex flex-col gap-3">
                                    <span>
                                        {usages.profile.current}/{usages.profile.limit} Reports
                                    </span>
                                    <Progress
                                        className="h-3"
                                        value={usages.profile.current}
                                        max={usages.profile.limit}
                                    />
                                    <span>
                                        {usages.search.current}/{usages.search.limit} Searches
                                    </span>
                                    <Progress className="h-3" value={usages.search.current} max={usages.search.limit} />
                                </section>
                            </>
                        ) : (
                            <>
                                <section className="flex">
                                    <div className="flex w-full flex-col items-start justify-between gap-5">
                                        <Skeleton className="h-9 w-48 font-semibold text-gray-900" />
                                        <Skeleton className="h-4 w-24 font-normal text-gray-600" />
                                    </div>
                                    <div className="flex flex-col items-end gap-3">
                                        <div className="flex h-fit gap-3">
                                            <Skeleton className="h-4 w-24" />
                                            <Skeleton className="h-4 w-24" />
                                        </div>
                                        <div className="text-sm">
                                            <Skeleton className="h-4 w-48" />
                                        </div>
                                        <Skeleton className="h-4 w-48 cursor-pointer text-sm font-semibold text-red-400" />
                                    </div>
                                </section>

                                <section className="flex flex-col gap-3">
                                    <Skeleton className="h-5 w-48" />
                                    <Skeleton className="h-5 w-full" />
                                    <Skeleton className="h-5 w-48" />
                                    <Skeleton className="h-5 w-full" />
                                </section>
                            </>
                        )}
                    </div>
                    <Link className="mt-11" href="/upgrade">
                        <Button
                            className="w-full bg-accent-500 font-semibold text-white hover:bg-accent-300"
                            onClick={() =>
                                // @note previous name: Account, Subscription, click upgrade subscription and go to pricing page
                                trackEvent('Start Upgrade Subscription')
                            }
                        >
                            <Rocket className="mr-2 h-4 w-4 text-white" />
                            {t('account.subscription.upgradeSubscription')}
                        </Button>
                    </Link>
                </section>
            </section>
        </section>
    );
};

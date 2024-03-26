import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCompany } from 'src/hooks/use-company';
import { useUsages } from 'src/hooks/use-usages';
import { unixEpochToISOString } from 'src/utils/utils';
import { Button } from 'shadcn/components/ui/button';
import { CancelSubscriptionModal } from './modal-cancel-subscription';
import { useRudderstack } from 'src/hooks/use-rudderstack';
import { ACCOUNT_SUBSCRIPTION } from 'src/utils/rudderstack/event-names';
import { Progress } from 'shadcn/components/ui/progress';
import {
    CalendarChecked,
    ClockCheckedOutline,
    CrossedCircleOutline,
    Hourglass,
    PausedCircleOutline,
    PaymentFailedOutline,
    CheckedCircleOutline,
    Rocket,
} from '../icons';
import { Skeleton } from 'shadcn/components/ui/skeleton';
import { useSubscription } from 'src/hooks/v2/use-subscription';
import type { SubscriptionEntity } from 'src/backend/database/subcription/subscription-entity';
import type Stripe from 'stripe';

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

const PaymentTablets = ({
    subscription,
    handleCancelSubscription,
}: {
    subscription: SubscriptionEntity<Stripe.Subscription>;
    handleCancelSubscription: () => void;
}) => {
    const { subscriptionData, activeAt, cancelledAt, pausedAt } = subscription;

    const { t, i18n } = useTranslation();

    const canceledNotExpired = (cancelledAt && new Date(cancelledAt) > new Date()) || false;

    //@ts-ignore plan does exist on the object
    const subscriptionInterval = subscriptionData.plan.interval || subscriptionData.items.data[0].plan.interval;
    const subscriptionIntervalCount =
        //@ts-ignore plan does exist on the object
        subscriptionData.plan.interval_count || subscriptionData.items.data[0].plan.interval_count;
    const interval =
        //@ts-ignore plan does exist on the object
        subscriptionInterval === 'month'
            ? //@ts-ignore plan does exist on the object
              subscriptionIntervalCount === 3
                ? 'quarterly'
                : 'monthly'
            : subscriptionInterval === 'year'
            ? 'annually'
            : null;
    if (!interval) {
        throw new Error('Invalid interval');
    }

    if (cancelledAt && new Date() > new Date(cancelledAt)) {
        return (
            <section className="flex w-full flex-col items-end gap-2">
                <Tablet customStyle="bg-gray-100 flex items-center gap-2 text-gray-700 border-gray-200">
                    <CrossedCircleOutline className="h-4 w-4 text-gray-700" />
                    {t('account.subscription.canceled')}
                </Tablet>
                <p className="whitespace-nowrap">
                    <span className="font-semibold">{t('account.planSection.canceledOn')}: </span>
                    <span>
                        {new Date(cancelledAt).toLocaleDateString(i18n.language, {
                            month: 'short',
                            day: 'numeric',
                        })}
                    </span>
                </p>
                <p> </p>
            </section>
        );
    } else if (pausedAt && new Date() > new Date(pausedAt)) {
        if (
            subscriptionData.status === 'incomplete' ||
            subscriptionData.status === 'incomplete_expired' ||
            subscriptionData.status === 'past_due'
        ) {
            return (
                <section className="flex w-full flex-col items-end gap-2">
                    <section className="flex gap-3">
                        <Tablet customStyle="bg-yellow-100 flex items-center gap-2 text-yellow-700 border-yellow-200">
                            <PausedCircleOutline className="h-4 w-4 text-yellow-700" />
                            {t('account.subscription.paused')}
                        </Tablet>
                        <Tablet customStyle="bg-red-100 flex items-center gap-2 text-red-700 border-red-200">
                            <PaymentFailedOutline className="h-4 w-4 text-red-700" />
                            {t('account.planSection.paymentFailed')}
                        </Tablet>
                    </section>
                    <p className="whitespace-nowrap">
                        <span className="font-semibold">{t('account.planSection.paymentDue')}: </span>
                        <span>
                            {new Date(pausedAt).toLocaleDateString(i18n.language, {
                                month: 'short',
                                day: 'numeric',
                            })}
                        </span>
                    </p>
                    <p> </p>
                </section>
            );
        }
        return (
            <section className="flex w-full flex-col items-end gap-2">
                <Tablet customStyle="bg-yellow-100 text-yellow-700 flex items-center gap-2 border-yellow-200">
                    <PausedCircleOutline className="h-4 w-4 text-yellow-700" />
                    {t('account.subscription.paused')}
                </Tablet>
                <p className="whitespace-nowrap">
                    <span className="font-semibold">{t('account.planSection.pausedAt')}: </span>
                    <span>
                        {new Date(pausedAt).toLocaleDateString(i18n.language, {
                            month: 'short',
                            day: 'numeric',
                        })}
                    </span>
                </p>
                <p> </p>
            </section>
        );
    } else if (activeAt && new Date() > new Date(activeAt) && subscriptionData.status === 'active') {
        if (cancelledAt && new Date() < new Date(cancelledAt)) {
            return (
                <section className="flex w-full flex-col items-end gap-2">
                    <section className="flex gap-3">
                        <Tablet customStyle="bg-yellow-100 flex items-center gap-2 text-yellow-700 border-yellow-200">
                            <CheckedCircleOutline className="h-4 w-4 text-yellow-700" />
                            {t('account.subscription.active')}
                        </Tablet>
                        <Tablet customStyle="bg-orange-100 flex items-center gap-2 text-orange-700 border-orange-200">
                            <Hourglass className="h-4 w-4 text-orange-700" />
                            <span>{t('account.planSection.cancelsOn')}: </span>
                            <span>
                                {new Date(cancelledAt).toLocaleDateString(i18n.language, {
                                    month: 'short',
                                    day: 'numeric',
                                })}
                            </span>
                        </Tablet>
                    </section>
                    <p className="whitespace-nowrap font-semibold">{t('account.planSection.noUpcomingPayments')}</p>
                    <p> </p>
                </section>
            );
        }
        return (
            <section className="flex w-full flex-col items-end gap-2">
                <section className="flex gap-3">
                    <Tablet customStyle="bg-green-100 flex items-center gap-2 text-green-700 border-green-200">
                        <CheckedCircleOutline className="h-4 w-4 text-green-700" />
                        {t('account.subscription.active')}
                    </Tablet>
                    <Tablet customStyle="bg-primary-100 flex items-center gap-2 text-primary-700 border-primary-200">
                        <CalendarChecked className="h-4 w-4 text-primary-700" />
                        {t(`account.subscription.${interval}`)}
                    </Tablet>
                </section>
                <p className="whitespace-nowrap">
                    <span className="font-semibold">{t('account.planSection.renewsOn')}: </span>
                    <span>
                        {new Date(subscriptionData.current_period_end * 1000).toLocaleDateString(i18n.language, {
                            month: 'short',
                            day: 'numeric',
                        })}
                    </span>
                </p>
                {!canceledNotExpired ? (
                    <p onClick={handleCancelSubscription} className="cursor-pointer text-sm font-semibold text-red-400">
                        {t('account.subscription.cancelSubscription')}
                    </p>
                ) : (
                    <p> </p>
                )}
            </section>
        );
    } else if (!activeAt && subscriptionData.status === 'trialing' && subscriptionData.trial_end) {
        return (
            <section className="flex w-full flex-col items-end gap-2">
                <Tablet customStyle="bg-navy-100 flex items-center gap-2 text-navy-700 border-navy-200">
                    <ClockCheckedOutline className="h-4 w-4 text-navy-700" />
                    {t('account.subscription.freeTrial')}
                </Tablet>
                <p className="whitespace-nowrap">
                    <span className="font-semibold">{t('account.planSection.trialEnds')}: </span>
                    <span>
                        {new Date(subscriptionData.trial_end * 1000).toLocaleDateString(i18n.language, {
                            month: 'short',
                            day: 'numeric',
                        })}
                    </span>
                </p>
            </section>
        );
    }
    return (
        <section className="flex w-full flex-col items-end gap-2">
            <Tablet customStyle="bg-gray-100 text-gray-700 border-gray-200">
                {t('account.planSection.errorGettingSubscription')}
            </Tablet>
        </section>
    );
};

export const SubscriptionDetails = () => {
    const { subscription, product } = useSubscription();

    const { company, refreshCompany } = useCompany();
    const { t } = useTranslation();
    const { trackEvent } = useRudderstack();

    const [showCancelModal, setShowCancelModal] = useState(false);
    const handleCancelSubscription = async () => {
        setShowCancelModal(true);
        trackEvent(ACCOUNT_SUBSCRIPTION('open cancel subscription modal'));
    };

    // these we get from stripe directly
    // This is just the billing period, not the monthly 'usage' period
    const periodStart = unixEpochToISOString(subscription?.subscriptionData?.current_period_start);
    const periodEnd = unixEpochToISOString(subscription?.subscriptionData?.current_period_end);

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
        <section id="subscription-details" className="w-full">
            <p className="pb-6 font-semibold">{t('account.sidebar.plan')}</p>
            <hr className="pb-5" />
            <section className="flex w-full justify-end">
                <section className="flex w-full flex-col items-end">
                    <div className="flex flex-col space-y-6 rounded-lg border border-gray-200 bg-white p-6 pb-12 lg:w-3/4">
                        <CancelSubscriptionModal
                            visible={showCancelModal}
                            onClose={() => setShowCancelModal(false)}
                            periodEnd={periodEnd}
                        />
                        {company && subscription ? (
                            <>
                                <section className="flex text-sm">
                                    <div className="flex w-full flex-col items-start justify-between">
                                        <h2 className="text-4xl font-semibold text-gray-900">
                                            {product ? (
                                                <span>{t(`account.plans.${product?.name.toLowerCase()}`)}</span>
                                            ) : (
                                                <Skeleton className="h-9 w-48 font-semibold text-gray-900" />
                                            )}
                                        </h2>
                                        <h2 className="whitespace-nowrap text-sm font-normal text-gray-600">
                                            {t(`account.planDescriptions.${product?.name.toLowerCase()}`)}
                                        </h2>
                                    </div>
                                    <PaymentTablets
                                        subscription={subscription}
                                        handleCancelSubscription={handleCancelSubscription}
                                    />
                                </section>

                                <section className="flex flex-col gap-6">
                                    <span>
                                        {usages.profile.current}/{usages.profile.limit}{' '}
                                        {t('account.planSection.reportsCount')}
                                    </span>
                                    <Progress
                                        className="h-3"
                                        value={usages.profile.current}
                                        max={usages.profile.limit}
                                    />
                                    <span>
                                        {usages.search.current}/{usages.search.limit}{' '}
                                        {t('account.planSection.searchesCount')}
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

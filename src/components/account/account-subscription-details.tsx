import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCompany } from 'src/hooks/use-company';
import { useUsages } from 'src/hooks/use-usages';
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
import dayjs from 'dayjs';
import { SubscriptionStatus, type SubscriptionEntity } from 'src/backend/database/subcription/subscription-entity';
import type Stripe from 'stripe';
import toast from 'react-hot-toast';
import { Tooltip } from '../library';

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
    const { subscriptionData, cancelledAt, pausedAt, status } = subscription;

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

    if (status === SubscriptionStatus.CANCELLED) {
        return (
            <section className="flex w-full flex-col items-end gap-2">
                <Tablet customStyle="bg-gray-100 flex items-center gap-2 text-gray-700 border-gray-200">
                    <CrossedCircleOutline className="h-4 w-4 text-gray-700" />
                    {t('account.subscription.canceled')}
                </Tablet>
                <p className="whitespace-nowrap">
                    <span className="font-semibold">{t('account.planSection.canceledOn')}: </span>
                    <span>
                        {new Date(cancelledAt as Date).toLocaleDateString(i18n.language, {
                            month: 'short',
                            day: 'numeric',
                        })}
                    </span>
                </p>
                <p> </p>
            </section>
        );
    } else if (status === SubscriptionStatus.PASS_DUE) {
        return (
            <section className="flex w-full flex-col items-end gap-2">
                <section className="flex gap-3">
                    <Tablet customStyle="bg-yellow-100 flex items-center gap-2 text-yellow-700 border-yellow-200">
                        <PausedCircleOutline className="h-4 w-4 text-yellow-700" />
                        {t('account.subscription.paused')}
                    </Tablet>
                    <Tooltip
                        content={t('account.planSection.paymentFailed')}
                        detail={t('account.planSection.paymentFailedAction')}
                        position={'top-left'}
                        className="w-fit"
                    >
                        <Tablet customStyle="bg-red-100 flex items-center gap-2 text-red-700 border-red-200">
                            <PaymentFailedOutline className="h-4 w-4 text-red-700" />
                            {t('account.planSection.paymentFailed')}
                        </Tablet>
                    </Tooltip>
                </section>
                <p className="whitespace-nowrap">
                    <span className="font-semibold">{t('account.planSection.paymentDue')}: </span>
                    <span>
                        {new Date(pausedAt as Date).toLocaleDateString(i18n.language, {
                            month: 'short',
                            day: 'numeric',
                        })}
                    </span>
                </p>
                <p> </p>
            </section>
        );
    } else if (status === SubscriptionStatus.ACTIVE) {
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
                        {new Date(pausedAt as Date).toLocaleDateString(i18n.language, {
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
    } else if (status === SubscriptionStatus.TRIAL) {
        return (
            <section className="flex w-full flex-col items-end gap-2">
                <Tablet customStyle="bg-navy-100 flex items-center gap-2 text-navy-700 border-navy-200">
                    <ClockCheckedOutline className="h-4 w-4 text-navy-700" />
                    {t('account.subscription.freeTrial')}
                </Tablet>
                <p className="whitespace-nowrap">
                    <span className="font-semibold">{t('account.planSection.trialEnds')}: </span>
                    <span>
                        {new Date(cancelledAt as Date).toLocaleDateString(i18n.language, {
                            month: 'short',
                            day: 'numeric',
                        })}
                    </span>
                </p>
            </section>
        );
    } else if (status === SubscriptionStatus.TRIAL_EXPIRED) {
        return (
            <section className="flex w-full flex-col items-end gap-2">
                <section className="flex gap-3">
                    <Tablet customStyle="bg-yellow-100 min-w-fit flex items-center gap-2 text-yellow-700 border-yellow-200">
                        <PausedCircleOutline className="h-4 w-4 text-yellow-700" />
                        {t('account.subscription.paused')}
                    </Tablet>
                    <Tablet customStyle="bg-navy-100 min-w-fit flex items-center gap-2 text-navy-700 border-navy-200">
                        <ClockCheckedOutline className="h-4 w-4 text-navy-700" />
                        {t('account.subscription.freeTrial')}
                    </Tablet>
                </section>
                <p className="whitespace-nowrap">
                    <span className="font-semibold">{t('account.planSection.trialEnds')}: </span>
                    <span>
                        {new Date(cancelledAt as Date).toLocaleDateString(i18n.language, {
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
    const { subscription, product, resumeSubscription, refreshSubscription } = useSubscription();

    const { company, refreshCompany } = useCompany();
    const { t } = useTranslation();
    const { trackEvent } = useRudderstack();

    const [showCancelModal, setShowCancelModal] = useState(false);
    const handleCancelSubscription = async () => {
        setShowCancelModal(true);
        trackEvent(ACCOUNT_SUBSCRIPTION('open cancel subscription modal'));
    };

    const getPeriods = () => {
        if (subscription?.status === SubscriptionStatus.TRIAL) {
            return {
                periodStart: company?.subscription_current_period_start,
                periodEnd: company?.subscription_current_period_end,
            };
        }
        return {
            periodStart: subscription?.activeAt,
            periodEnd: subscription?.pausedAt,
        };
    };

    // these we get from stripe directly
    // This is just the billing period, not the monthly 'usage' period
    const periodStart = getPeriods().periodStart;
    const periodEnd = getPeriods().periodEnd;

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

    const isAboutToCanceled = () => (dayjs().isBefore(subscription?.cancelledAt) ? subscription?.pausedAt : null);

    const onResumeSubscription = () => {
        resumeSubscription()
            .then(() => {
                trackEvent('Resume Subscription');
                toast.success(t('account.subscription.resumeSubscriptionSuccess'));
                refreshSubscription();
            })
            .catch(() => {
                toast.error(t('account.subscription.resumeSubscriptionError'));
            });
    };

    const usagesSearch = subscription?.status === SubscriptionStatus.CANCELLED ? 0 : usages.search.current;
    const usagesProfiles = subscription?.status === SubscriptionStatus.CANCELLED ? 0 : usages.profile.current;
    const subsStatusMustShowPopup = [
        SubscriptionStatus.CANCELLED,
        SubscriptionStatus.PASS_DUE,
        SubscriptionStatus.TRIAL_EXPIRED,
    ];

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
                            periodEnd={periodEnd as Date}
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

                                <section className="flex flex-col gap-6" id="account-search-and-report">
                                    <span>
                                        {usagesProfiles}/{usages.profile.limit} {t('account.planSection.reportsCount')}
                                    </span>
                                    {subsStatusMustShowPopup.includes(subscription.status) ? (
                                        <Tooltip
                                            content={t('account.planSection.subscriptionExpired')}
                                            detail={t('account.planSection.subscriptionExpiredAction')}
                                            position={'top-left'}
                                            className=""
                                        >
                                            <Link href={'/upgrade'}>
                                                <Progress
                                                    className="h-3"
                                                    value={(usagesProfiles / usages.profile.limit) * 100}
                                                />
                                            </Link>
                                        </Tooltip>
                                    ) : (
                                        <Progress
                                            className="h-3"
                                            value={(usagesProfiles / usages.profile.limit) * 100}
                                        />
                                    )}
                                    <span>
                                        {usagesSearch}/{usages.search.limit} {t('account.planSection.searchesCount')}
                                    </span>
                                    {subsStatusMustShowPopup.includes(subscription.status) ? (
                                        <Tooltip
                                            content={t('account.planSection.subscriptionExpired')}
                                            detail={t('account.planSection.subscriptionExpiredAction')}
                                            position={'top-left'}
                                            className=""
                                        >
                                            <Link href={'/upgrade'}>
                                                <Progress
                                                    className="h-3"
                                                    value={(usagesSearch / usages.search.limit) * 100}
                                                />
                                            </Link>
                                        </Tooltip>
                                    ) : (
                                        <Progress className="h-3" value={(usagesSearch / usages.search.limit) * 100} />
                                    )}
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
                    {isAboutToCanceled() ? (
                        <Button
                            className="mt-11 bg-accent-500 font-semibold text-white hover:bg-accent-300"
                            onClick={() => onResumeSubscription()}
                        >
                            <Rocket className="mr-2 h-4 w-4 text-white" />
                            {t('account.subscription.resumeSubscription')}
                        </Button>
                    ) : (
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
                    )}
                </section>
            </section>
        </section>
    );
};

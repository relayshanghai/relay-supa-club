import Link from 'next/link';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCompany } from 'src/hooks/use-company';
import { useSubscription } from 'src/hooks/use-subscription';
import { useUsages } from 'src/hooks/use-usages';
import { useUser } from 'src/hooks/use-user';
import { buildSubscriptionPortalUrl } from 'src/utils/api/stripe/portal';
import { unixEpochToISOString } from 'src/utils/utils';

import { Button } from '../button';
import { Spinner } from '../icons';
import { CancelSubscriptionModal } from './modal-cancel-subscription';

export const SubscriptionDetails = () => {
    const { subscription } = useSubscription();
    const { usages } = useUsages();
    const { company } = useCompany();
    const { loading: userDataLoading } = useUser();
    const { t, i18n } = useTranslation();
    const profileViewUsages = usages?.filter(({ type }) => type === 'profile');
    const searchUsages = usages?.filter(({ type }) => type === 'search');
    const aiEmailUsages = usages?.filter(({ type }) => type === 'ai_email');

    const [showCancelModal, setShowCancelModal] = useState(false);
    const handleCancelSubscription = async () => setShowCancelModal(true);
    const periodEnd = unixEpochToISOString(subscription?.current_period_end);
    return (
        <div className="flex w-full flex-col items-start space-y-4 rounded-lg bg-white p-4 shadow-lg shadow-gray-200 lg:max-w-2xl">
            <CancelSubscriptionModal
                visible={showCancelModal}
                onClose={() => setShowCancelModal(false)}
            />
            <div className="flex w-full flex-row items-center justify-between">
                <h2 className="text-lg font-bold">{t('account.subscription.title')}</h2>
                <div className="flex flex-row justify-end">
                    {company?.id && (
                        <Link href={buildSubscriptionPortalUrl({ id: company.id })}>
                            <Button variant="secondary">
                                {t('account.subscription.viewBillingPortal')}
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
            {company && searchUsages && profileViewUsages && aiEmailUsages ? (
                <>
                    <div
                        className={`flex flex-row space-x-4 ${userDataLoading ? 'opacity-50' : ''}`}
                    >
                        <div className="flex flex-col space-y-2 ">
                            {subscription && (
                                <div className={`mb-8 w-full space-y-6`}>
                                    <div className="flex flex-col space-y-3">
                                        <div className="text-sm">
                                            {t('account.subscription.plan')}
                                        </div>
                                        <div className="ml-2 text-sm font-bold">
                                            {subscription.name}
                                            {subscription.status === 'trialing' &&
                                                ` - ${t('account.subscription.freeTrial')}`}
                                            {subscription.status === 'canceled' &&
                                                ` - ${t('account.subscription.canceled')}`}
                                        </div>
                                    </div>
                                    <div className="flex flex-col space-y-3">
                                        <div className="text-sm">
                                            {t('account.subscription.paymentCycle')}
                                        </div>
                                        <div className="ml-2 text-sm font-bold">
                                            {t(`account.subscription.${subscription.interval}`)}
                                        </div>
                                    </div>
                                    {subscription.status !== 'canceled' && periodEnd && (
                                        <div className="flex flex-col space-y-3">
                                            <div className="text-sm">
                                                {t('account.subscription.renewsOn')}
                                            </div>
                                            <div className="ml-2 text-sm font-bold">
                                                {new Date(periodEnd).toLocaleDateString(
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
                                </div>
                            )}
                            <table>
                                <thead>
                                    <tr>
                                        <th className="p-2 pl-4 text-left  font-bold">
                                            {t('account.subscription.usageLimits')}
                                        </th>
                                        <th className="px-4 text-right font-medium">
                                            {t('account.subscription.used')}
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
                                            {profileViewUsages.length}
                                        </td>
                                        <td className="border px-4 py-2 text-right">
                                            {company.subscription_status === 'trial'
                                                ? company.trial_profiles_limit
                                                : company.profiles_limit}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border px-4 py-2">
                                            {t('account.subscription.searches')}
                                        </td>
                                        <td className="border px-4 py-2 text-right">
                                            {searchUsages.length}
                                        </td>
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
                                            {aiEmailUsages.length}
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

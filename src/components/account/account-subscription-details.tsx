import Link from 'next/link';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { SECONDS_IN_MILLISECONDS } from 'src/constants/conversions';
import { useSubscription } from 'src/hooks/use-subscription';
import { buildSubscriptionPortalUrl } from 'src/utils/api/stripe/helpers';

import { Button } from '../button';
import { Spinner } from '../icons';
import { AccountContext } from './account-context';

export const SubscriptionDetails = () => {
    const { subscription } = useSubscription();
    const { userDataLoading, company } = useContext(AccountContext);

    const { t, i18n } = useTranslation();
    const profileViewUsages = company?.usages.filter(({ type }) => type === 'profile');
    const searchUsages = company?.usages.filter(({ type }) => type === 'search');

    const handleCancelSubscription = async () => {
        // TODO task V2-26q : implement cancel subscription
    };

    return (
        <div className="flex flex-col items-start space-y-4 p-4 bg-white rounded-lg w-full lg:max-w-2xl shadow-lg shadow-gray-200">
            <div className="flex flex-row justify-between w-full items-center">
                <h2 className="text-lg font-bold">{t('account.subscription.title')}</h2>
                <div className="flex flex-row justify-end">
                    {company?.id && (
                        <Link href={buildSubscriptionPortalUrl({ id: company.id })}>
                            <a>
                                <Button variant="secondary">
                                    {t('account.subscription.viewBillingPortal')}
                                </Button>
                            </a>
                        </Link>
                    )}
                </div>
            </div>{' '}
            {subscription && company && searchUsages && profileViewUsages ? (
                <div className={`flex flex-row space-x-4 ${userDataLoading ? 'opacity-50' : ''}`}>
                    {/* detect if on free plan. */}
                    <div className="flex flex-col space-y-2 ">
                        <div className={`w-full space-y-6 mb-8`}>
                            <div className="flex flex-col space-y-3">
                                <div className="text-sm">{t('account.subscription.plan')}</div>
                                <div className="text-sm font-bold ml-2">
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
                                <div className="text-sm font-bold ml-2">
                                    {t(`account.subscription.${subscription.interval}`)}
                                </div>
                            </div>
                            {subscription.status !== 'canceled' && (
                                <div className="flex flex-col space-y-3">
                                    <div className="text-sm">
                                        {t('account.subscription.renewsOn')}
                                    </div>
                                    <div className="text-sm font-bold ml-2">
                                        {new Date(
                                            subscription.current_period_end *
                                                SECONDS_IN_MILLISECONDS,
                                        ).toLocaleDateString(i18n.language, {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th className="p-2 pl-4 font-bold  text-left">
                                        {t('account.subscription.usageLimits')}
                                    </th>
                                    <th className="px-4 font-medium text-right">
                                        {t('account.subscription.used')}
                                    </th>
                                    <th className="px-4 font-medium text-right">
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
                            </tbody>
                        </table>
                    </div>{' '}
                </div>
            ) : (
                <div className="w-full flex justify-center">
                    {/* TODO task V2-32: make skeleton */}
                    <Spinner className="w-8 h-8 fill-primary-400 text-white" />
                </div>
            )}
            <div className="flex space-x-6 justify-end w-full pt-5">
                <Button onClick={handleCancelSubscription} variant="secondary">
                    {t('account.subscription.cancelSubscription')}
                </Button>
                <Link href="/pricing">
                    <a>
                        <Button>{t('account.subscription.upgradeSubscription')}</Button>
                    </a>
                </Link>
            </div>
        </div>
    );
};

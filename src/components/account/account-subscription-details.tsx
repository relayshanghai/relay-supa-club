import Link from 'next/link';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { SECONDS_IN_MILLISECONDS } from 'src/constants/conversions';
import { useSubscription } from 'src/hooks/use-subscription';

import { Button } from '../button';
import { AccountContext } from './account-context';

export const SubscriptionDetails = () => {
    const { subscription: subscriptionWrongType, paymentMethods } = useSubscription();

    // TODO: investigate why this type doesn't seem to match our code's usage
    const subscription = subscriptionWrongType as any;

    const { userDataLoading, company } = useContext(AccountContext);

    const { t, i18n } = useTranslation();
    const profileViewUsages = company?.usages.filter(({ type }) => type === 'profile_view');
    const searchUsages = company?.usages.filter(({ type }) => type === 'search');
    // TODO: need multiple usage_limits

    return (
        <div className="flex flex-col items-start space-y-4 p-4 bg-white rounded-lg w-full lg:max-w-2xl shadow-lg shadow-gray-200">
            <div className="flex flex-row justify-between w-full items-center">
                <h2 className="text-lg font-bold">{t('account.subscription.title')}</h2>
                <div className="flex flex-row justify-end">
                    <Link
                        href={`/api/subscriptions/portal?${new URLSearchParams({
                            id: company?.id || ''
                        })}`}
                    >
                        <a>
                            <Button variant="secondary">
                                {t('account.subscription.viewBillingPortal')}
                            </Button>
                        </a>
                    </Link>
                </div>
            </div>
            <div className={`flex flex-row space-x-4 ${userDataLoading ? 'opacity-50' : ''}`}>
                {subscription?.product ? (
                    <div className="flex flex-col space-y-2 ">
                        <div className={`w-full space-y-6 mb-8`}>
                            <div className="flex flex-col space-y-3">
                                <div className="text-sm">{t('account.subscription.plan')}</div>
                                <div className="text-sm font-bold ml-2">
                                    {subscription.product.name}
                                </div>
                            </div>
                            <div className="flex flex-col space-y-3">
                                <div className="text-sm">
                                    {t('account.subscription.paymentCycle')}
                                </div>
                                <div className="text-sm font-bold ml-2">
                                    {subscription.plan.interval}
                                </div>
                            </div>
                            <div className="flex flex-col space-y-3">
                                <div className="text-sm">{t('account.subscription.renewsOn')}</div>
                                <div className="text-sm font-bold ml-2">
                                    {new Date(
                                        subscription.current_period_end * SECONDS_IN_MILLISECONDS
                                    ).toLocaleDateString(i18n.language, {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </div>
                            </div>
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
                                        {profileViewUsages?.length}
                                    </td>
                                    <td className="border px-4 py-2 text-right">
                                        {subscription.product.metadata.usage_limit}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border px-4 py-2">
                                        {t('account.subscription.searches')}
                                    </td>
                                    <td className="border px-4 py-2 text-right">
                                        {searchUsages?.length}
                                    </td>
                                    <td className="border px-4 py-2 text-right">
                                        {subscription.product.metadata.usage_limit}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-sm py-2 text-gray-500 mt-5">
                        {t('account.subscription.youHaveNoActiveSubscriptionPleasePurchaseBelow')}
                    </p>
                )}
            </div>
            {paymentMethods?.data?.length === 0 && (
                <div className="w-full">
                    <p>{t('account.subscription.beforePurchasingYouNeedPaymentMethod')}</p>
                    <div className="flex flex-row justify-end">
                        <Link
                            href={`/api/subscriptions/portal?${new URLSearchParams({
                                id: company?.id || ''
                            })}`}
                        >
                            <a>
                                <Button> {t('account.subscription.addPaymentMethod')}</Button>
                            </a>
                        </Link>
                    </div>
                </div>
            )}
            <Link href="/pricing">
                <a>
                    <Button className="mt-5">
                        {' '}
                        {t('account.subscription.upgradeSubscription')}
                    </Button>
                </a>
            </Link>
        </div>
    );
};

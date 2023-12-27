import Link from 'next/link';
import { Button } from '../button';
import { Coins, TimeCrossed } from '../icons';
import type { SubscriptionStatus } from 'types';
import { useTranslation } from 'react-i18next';

export const SearchExpired = ({
    type,
    subscriptionStatus,
}: {
    type: 'credit' | 'plan';
    subscriptionStatus?: SubscriptionStatus;
}) => {
    const { t } = useTranslation();

    const Icon = type === 'credit' ? Coins : TimeCrossed;
    const titleKey = `creators.errorComponent.${type === 'credit' ? 'credit' : 'subscription'}Expired${
        subscriptionStatus === 'trial' ? 'Trial' : ''
    }`;
    const descriptionKey = `creators.errorComponent.${subscriptionStatus === 'trial' ? 'trial' : 'paid'}Description`;

    return (
        <div className="flex flex-col items-end gap-3 rounded-xl bg-white p-5 shadow-xl">
            <div className="flex w-fit gap-3 ">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-50">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
                        <Icon className="h-6 w-6 stroke-primary-600 stroke-1" />
                    </div>
                </div>
                <div className="flex flex-col justify-between">
                    <p className="text-xl font-semibold">{t(titleKey)}</p>
                    <p className="text-sm font-medium leading-3 text-gray-600">{t(descriptionKey)}</p>
                </div>
            </div>
            <Link href="/upgrade" className="items-end">
                <Button className="ml-auto">{t('creators.errorComponent.upgradeAccountButton')}</Button>
            </Link>
        </div>
    );
};

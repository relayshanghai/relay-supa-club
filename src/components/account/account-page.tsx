import { useTranslation } from 'react-i18next';
import { CompanyDetails } from './account-company-details';
import { PersonalDetails } from './account-personal-details';
import { SubscriptionDetails } from './account-subscription-details';

export const AccountPage = () => {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col p-2 space-y-8 items-center lg:p-6">
            <div className="text-2xl font-bold">{t('account.account')}</div>
            <SubscriptionDetails />
            <PersonalDetails />
            <CompanyDetails />
        </div>
    );
};

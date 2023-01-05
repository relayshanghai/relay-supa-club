import { useTranslation } from 'react-i18next';
import { CompanyDetails } from './account-company-details';
import { PersonalDetails } from './account-personal-details';
import { SubscriptionDetails } from './account-subscription-details';

export const AccountPage = () => {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col p-6 space-y-6">
            <div className="text-lg font-bold">{t('account.account')}</div>
            <PersonalDetails />
            <CompanyDetails />
            <SubscriptionDetails />
        </div>
    );
};

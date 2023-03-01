import { useTranslation } from 'react-i18next';
import { CompanyProvider } from 'src/hooks/use-company';
import { CompanyDetails } from './account-company-details';
import { PersonalDetails } from './account-personal-details';
import { SubscriptionDetails } from './account-subscription-details';

export const AccountPage = () => {
    const { t } = useTranslation();
    return (
        <CompanyProvider>
            <div className="flex flex-col items-center space-y-8 p-2 lg:p-6">
                <div className="text-2xl font-bold">{t('account.account')}</div>
                <SubscriptionDetails />
                <PersonalDetails />
                <CompanyDetails />
            </div>
        </CompanyProvider>
    );
};

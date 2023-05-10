import { useTranslation } from 'react-i18next';
import { CompanyDetails } from './account-company-details';
import { PersonalDetails } from './account-personal-details';
import { SubscriptionDetails } from './account-subscription-details';
import { useAtomValue } from 'jotai';
import { clientRoleAtom } from 'src/atoms/client-role-atom';

export const AccountPage = () => {
    const { t } = useTranslation();
    const clientRoleData = useAtomValue(clientRoleAtom);

    return (
        <div className="flex flex-col items-center space-y-8 p-2 lg:p-6">
            <div className="text-2xl font-bold">{t('account.account')}</div>
            <SubscriptionDetails />
            {/* Do not show personal details when acting on behalf of company, because the other two sections are showing the 'manage as' company's info, but PersonalDetails is the relay employee. This could cause confusion. */}
            {!clientRoleData.companyId && <PersonalDetails />}
            <CompanyDetails />
        </div>
    );
};

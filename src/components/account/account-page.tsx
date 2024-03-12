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
        <div className="flex flex-col gap-3 bg-white px-8 lg:px-8">
            <div className="text-base font-semibold text-primary-700">Profile, Company and Subscription</div>
            <div className="text-2xl font-bold">{t('account.account')}</div>
            <div className="mt-12 flex w-full gap-8">
                <nav className="flex flex-col gap-2">
                    <a href="#subscription-details" className="text-sm font-semibold text-primary-700">
                        {t('account.subscriptionDetails')}
                    </a>
                    {!clientRoleData.companyId && (
                        <a href="#personal-details" className="text-sm font-semibold text-primary-700">
                            {t('account.personalDetails')}
                        </a>
                    )}
                    <a href="#company-details" className="text-sm font-semibold text-primary-700">
                        {t('account.companyDetails')}
                    </a>
                </nav>
                <section className="w-full">
                    <SubscriptionDetails />
                    {/* Do not show personal details when acting on behalf of company, because the other two sections are showing the 'manage as' company's info, but PersonalDetails is the relay employee. This could cause confusion. */}
                    {!clientRoleData.companyId && <PersonalDetails />}
                    <CompanyDetails />
                </section>
            </div>
        </div>
    );
};

import { useTranslation } from 'react-i18next';
import { CompanyDetails } from './account-company-details';
import { PersonalDetails } from './account-personal-details';
import { SubscriptionDetails } from './account-subscription-details';
import { useAtomValue } from 'jotai';
import { clientRoleAtom } from 'src/atoms/client-role-atom';
import { TeamDetails } from './account-team-details';
import { Building, PaymentOutline, ProfileOutline, ProfileTeam, Rocket } from '../icons';

export const AccountPage = () => {
    const { t } = useTranslation();
    const clientRoleData = useAtomValue(clientRoleAtom);

    return (
        <div className="flex flex-col gap-3 bg-white px-8 lg:px-8">
            <section className="sticky left-0 top-0">
                <div className="text-base font-semibold text-primary-700">Profile, Company and Subscriptions</div>
                <div className="text-2xl font-bold">{t('account.account')}</div>
            </section>
            <nav className="absolute top-32 mt-12 flex w-full max-w-xs flex-col 2xl:max-w-sm">
                <div className="flex gap-2 p-3 pl-0 text-sm font-semibold text-gray-400 transition-all hover:bg-primary-50 hover:text-primary-700">
                    <Rocket className="h-5 w-5 flex-shrink-0" />
                    <a href="#subscription-details">{t('account.subscriptionDetails')}</a>
                </div>
                <div className="flex gap-2 p-3 pl-0 text-sm font-semibold text-gray-400 transition-all hover:bg-primary-50 hover:text-primary-700">
                    <PaymentOutline className="h-5 w-5 flex-shrink-0" />
                    <a href="#subscription-details">{t('account.billingDetails')}</a>
                </div>
                {!clientRoleData.companyId && (
                    <div className="flex gap-2 p-3 pl-0 text-sm font-semibold text-gray-400 transition-all hover:bg-primary-50 hover:text-primary-700">
                        <ProfileOutline className="h-5 w-5 flex-shrink-0" />
                        <a href="#personal-details">{t('account.personalDetails')}</a>
                    </div>
                )}
                <div className="flex gap-2 p-3 pl-0 text-sm font-semibold text-gray-400 transition-all hover:bg-primary-50 hover:text-primary-700">
                    <Building className="h-5 w-5 flex-shrink-0" />
                    <a href="#company-details">{t('account.companyDetails')}</a>
                </div>
                <div className="flex gap-2 p-3 pl-0 text-sm font-semibold text-gray-400 transition-all hover:bg-primary-50 hover:text-primary-700">
                    <ProfileTeam className="h-5 w-5 flex-shrink-0" />
                    <a href="#team-details">{t('account.teamDetails')}</a>
                </div>
            </nav>
            <div className="mt-12 flex w-full gap-8">
                <div aria-hidden className="display-none h-2 w-full max-w-xs flex-col opacity-0 2xl:max-w-sm" />
                <section className="w-full">
                    <SubscriptionDetails />
                    {/* Do not show personal details when acting on behalf of company, because the other two sections are showing the 'manage as' company's info, but PersonalDetails is the relay employee. This could cause confusion. */}
                    {!clientRoleData.companyId && <PersonalDetails />}
                    <CompanyDetails />
                    <TeamDetails />
                </section>
            </div>
        </div>
    );
};

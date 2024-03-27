import { useTranslation } from 'react-i18next';
import { CompanyDetails } from './account-company-details';
import { PersonalDetails } from './account-personal-details';
import { SubscriptionDetails } from './account-subscription-details';
import { useAtomValue } from 'jotai';
import { clientRoleAtom } from 'src/atoms/client-role-atom';
import { TeamDetails } from './account-team-details';
import { Building, PaymentOutline, ProfileOutline, ProfileTeam, Rocket } from '../icons';
import { PaymentMethodDetails } from './account-payment-method-details';
import { BillingDetails } from './account-billing-details';
import { PasswordDetails } from './account-password-details';
import { useEffect, useState } from 'react';

const AccountPageNavbar = ({ clientRoleCompanyId }: { clientRoleCompanyId: string }) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState(['subscription-details']);

    useEffect(() => {
        const layoutWrapper = document.getElementById('layout-wrapper');
        if (!layoutWrapper) return;
        const handleScroll = () => {
            const subscriptionDetails = document.getElementById('subscription-details');
            const billingDetails = document.getElementById('billing-details');
            const personalDetails = document.getElementById('personal-details');
            const companyDetails = document.getElementById('company-details');
            const teamDetails = document.getElementById('team-details');

            if (!subscriptionDetails || !billingDetails || !personalDetails || !companyDetails || !teamDetails) return;

            const isInViewport = (element: any) => {
                const rect = element.getBoundingClientRect();
                return (
                    rect.top >= layoutWrapper.getBoundingClientRect().top &&
                    rect.bottom <= layoutWrapper.getBoundingClientRect().bottom
                );
            };

            let activeTabs: string[] = [];

            if (isInViewport(subscriptionDetails)) {
                activeTabs.push('subscription-details');
            } else {
                activeTabs = activeTabs.filter((tab) => tab !== 'subscription-details');
            }

            if (isInViewport(billingDetails)) {
                activeTabs.push('billing-details');
            } else {
                activeTabs = activeTabs.filter((tab) => tab !== 'billing-details');
            }

            if (isInViewport(personalDetails)) {
                activeTabs.push('personal-details');
            } else {
                activeTabs = activeTabs.filter((tab) => tab !== 'personal-details');
            }

            if (isInViewport(companyDetails)) {
                activeTabs.push('company-details');
            } else {
                activeTabs = activeTabs.filter((tab) => tab !== 'company-details');
            }

            if (isInViewport(teamDetails)) {
                activeTabs.push('team-details');
            } else {
                activeTabs = activeTabs.filter((tab) => tab !== 'team-details');
            }

            setActiveTab(activeTabs);
        };

        layoutWrapper.addEventListener('scroll', handleScroll);
        return () => layoutWrapper.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`absolute top-32  -ml-2 mt-12 flex w-full max-w-xs flex-col 2xl:max-w-sm`}>
            <a
                href="#subscription-details"
                className={`flex gap-2 ${
                    activeTab.includes('subscription-details') && 'bg-primary-50 text-primary-700'
                } rounded-md py-3 pl-2 text-sm font-semibold text-gray-400 transition-all hover:bg-primary-50 hover:text-primary-700`}
            >
                <Rocket className="h-5 w-5 flex-shrink-0" />
                <p>{t('account.sidebar.plan')}</p>
            </a>
            <a
                href="#billing-details"
                className={`${
                    activeTab.includes('billing-details') && 'bg-primary-50 text-primary-700'
                } flex gap-2 rounded-md py-3 pl-2 text-sm font-semibold text-gray-400 transition-all hover:bg-primary-50 hover:text-primary-700`}
            >
                <PaymentOutline className="h-5 w-5 flex-shrink-0" />
                <p>{t('account.sidebar.billing')}</p>
            </a>
            {!clientRoleCompanyId && (
                <a
                    href="#personal-details"
                    className={`${
                        activeTab.includes('personal-details') && 'bg-primary-50 text-primary-700'
                    } flex gap-2 rounded-md py-3 pl-2 text-sm font-semibold text-gray-400 transition-all hover:bg-primary-50 hover:text-primary-700`}
                >
                    <ProfileOutline className="h-5 w-5 flex-shrink-0" />
                    <p>{t('account.sidebar.profile')}</p>
                </a>
            )}
            <a
                href="#company-details"
                className={`${
                    activeTab.includes('company-details') && 'bg-primary-50 text-primary-700'
                } flex gap-2 rounded-md py-3 pl-2 text-sm font-semibold text-gray-400 transition-all hover:bg-primary-50 hover:text-primary-700`}
            >
                <Building className="h-5 w-5 flex-shrink-0" />
                <p>{t('account.sidebar.company')}</p>
            </a>
            <a
                href="#team-details"
                className={`${
                    activeTab.includes('team-details') && 'bg-primary-50 text-primary-700'
                } flex gap-2 rounded-md py-3 pl-2 text-sm font-semibold text-gray-400 transition-all hover:bg-primary-50 hover:text-primary-700`}
            >
                <ProfileTeam className="h-5 w-5 flex-shrink-0" />
                <p>{t('account.sidebar.team')}</p>
            </a>
        </nav>
    );
};

export const AccountPage = () => {
    const { t } = useTranslation();
    const clientRoleData = useAtomValue(clientRoleAtom);

    return (
        <div className="flex flex-col gap-3 bg-white px-8 lg:px-8">
            <section className="sticky left-0 top-0 flex flex-col gap-3 pb-12">
                <div className="text-base font-semibold text-primary-700">
                    {t('account.paymentCompanySubscription')}
                </div>
                <div className="text-4xl font-bold">{t('account.account')}</div>
            </section>
            <AccountPageNavbar clientRoleCompanyId={clientRoleData.companyId} />
            <div className="mb-[360px] mt-12 flex w-full gap-8">
                <div aria-hidden className="display-none h-2 w-full max-w-xs flex-col opacity-0 2xl:max-w-sm" />
                <section className="flex w-full flex-col gap-8">
                    <SubscriptionDetails />
                    <PaymentMethodDetails />
                    <BillingDetails />
                    {/* Do not show personal details when acting on behalf of company, because the other two sections are showing the 'manage as' company's info, but PersonalDetails is the relay employee. This could cause confusion. */}
                    {!clientRoleData.companyId && <PersonalDetails />}
                    {!clientRoleData.companyId && <PasswordDetails />}
                    <CompanyDetails />
                    <TeamDetails />
                </section>
            </div>
        </div>
    );
};

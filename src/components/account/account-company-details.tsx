import { useContext } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Button } from '../button';
import { Input } from '../input';
import { AccountContext } from './account-context';
import { InviteMembersModal } from './modal-invite-members';

export const CompanyDetails = () => {
    const {
        userDataLoading,
        companyValues,
        setCompanyFieldValues,
        setShowAddMoreMembers,
        profile,
        company,
        updateCompany
    } = useContext(AccountContext);
    const { t } = useTranslation();
    return (
        <div className="flex flex-col items-start space-y-4 p-4 bg-white rounded-lg w-full lg:max-w-2xl">
            <InviteMembersModal />

            <h2 className="">{t('account.company.title')}</h2>
            <div className={`flex flex-row space-x-4 ${userDataLoading ? 'opacity-50' : ''}`}>
                <Input
                    label={t('account.company.companyName')}
                    type="text"
                    value={companyValues.name || ''}
                    required
                    onChange={(e) => setCompanyFieldValues('name', e.target.value)}
                />
                <Input
                    label={t('account.company.website')}
                    type="text"
                    value={companyValues.website || ''}
                    placeholder={t('account.company.websiteAddress') || ''}
                    required
                    onChange={(e) => setCompanyFieldValues('website', e.target.value)}
                />
            </div>
            <div className="w-full">
                <h3 className="pb-4">{t('account.company.members')}</h3>
                <div className="divide-y divide-grey-200">
                    {Array.isArray(company?.profiles) &&
                        company?.profiles.map((profile) => {
                            return (
                                <div
                                    key={profile.id}
                                    className="flex flex-row space-x-8 items-center w-full py-2"
                                >
                                    <p className="w-1/3">
                                        <p className="text-xs text-gray-500">
                                            {t('account.company.fullName')}
                                        </p>
                                        {profile.first_name}
                                        {` `}
                                        {profile.last_name}
                                    </p>
                                    <p className="text-sm font-bold">
                                        <p className="text-xs font-normal text-gray-500">
                                            {t('account.company.role')}
                                        </p>
                                        {profile.admin ? 'Admin' : 'Member'}
                                    </p>
                                </div>
                            );
                        })}
                </div>
                {Array.isArray(company?.invites) && company?.invites.length && (
                    <>
                        <p className="text-sm pt-8 pb-2">
                            {t('account.company.pendingInvitations')}
                        </p>
                        {company?.invites.map((invites) => {
                            return (
                                <div
                                    key={invites.id}
                                    className="flex flex-row space-x-8 items-center border-t border-b border-grey-200 w-full py-2"
                                >
                                    <p className="">
                                        <p className="text-xs text-gray-500">
                                            {t('account.company.email')}
                                        </p>
                                        {invites.email}
                                    </p>
                                </div>
                            );
                        })}
                    </>
                )}
                <div className="pt-4">
                    {profile?.admin && (
                        <Button variant="secondary" onClick={() => setShowAddMoreMembers(true)}>
                            {t('account.company.addMoreMembers')}
                        </Button>
                    )}
                </div>
            </div>
            {profile?.admin && (
                <div className="flex flex-row justify-end w-full">
                    <Button
                        onClick={async () => {
                            try {
                                await updateCompany({
                                    name: companyValues.name,
                                    website: companyValues.website
                                });
                                toast.success('Company profile updated');
                            } catch (e) {
                                toast.error('Ops, something went wrong.');
                            }
                        }}
                    >
                        {t('account.update')}
                    </Button>
                </div>
            )}
        </div>
    );
};

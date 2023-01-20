import { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useFields } from 'src/hooks/use-fields';
import { Button } from '../button';
import { Edit } from '../icons';
import { Input } from '../input';
import { AccountContext } from './account-context';
import { InviteMembersModal } from './modal-invite-members';

export const CompanyDetails = () => {
    const { userDataLoading, profile, company, updateCompany } = useContext(AccountContext);

    const [showAddMoreMembers, setShowAddMoreMembers] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const {
        values: companyValues,
        setFieldValue: setCompanyFieldValues,
        reset: resetCompanyValues,
    } = useFields<{ name: string; website: string }>({
        name: '',
        website: '',
    });
    const [updating, setUpdating] = useState(false);

    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        if (company) {
            resetCompanyValues({ name: company.name || '', website: company.website || '' });
        }
    }, [company, resetCompanyValues]);

    const { t } = useTranslation();

    const handleUpdateCompany = async () => {
        try {
            setUpdating(true);
            await updateCompany({
                name: companyValues.name,
                website: companyValues.website,
            });
            toast.success(t('account.company.companyProfileUpdated'));
            setEditMode(false);
        } catch (e) {
            toast.error(t('account.company.oopsWentWrong'));
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div
            className={`flex flex-col items-start space-y-4 p-4 bg-white rounded-lg w-full lg:max-w-2xl relative ${
                userDataLoading || updating ? 'opacity-50' : ''
            } shadow-lg shadow-gray-200`}
        >
            <InviteMembersModal
                showAddMoreMembers={showAddMoreMembers}
                setShowAddMoreMembers={setShowAddMoreMembers}
                inviteEmail={inviteEmail}
                setInviteEmail={setInviteEmail}
            />

            <h2 className="text-lg font-bold">{t('account.company.title')}</h2>

            {editMode ? (
                <div className={`w-full lg:w-1/2`}>
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
            ) : (
                <div className={`w-full space-y-6`}>
                    <div className="flex flex-col space-y-3">
                        <div className="text-sm">{t('account.company.companyName')}</div>
                        <div className="text-sm font-bold ml-2">{companyValues.name}</div>
                    </div>

                    <div className="flex flex-col space-y-3">
                        <div className="text-sm">{t('account.company.website')}</div>
                        <div className="text-sm font-bold ml-2">{companyValues.website}</div>
                    </div>
                </div>
            )}
            {profile?.admin && (
                <>
                    {editMode ? (
                        <div className="flex flex-row justify-end w-full space-x-4">
                            <Button
                                disabled={userDataLoading || updating}
                                onClick={handleUpdateCompany}
                            >
                                {t('account.update')}
                            </Button>
                            <Button onClick={() => setEditMode(false)} variant="secondary">
                                {t('account.cancel')}
                            </Button>
                        </div>
                    ) : (
                        <Button
                            className={`absolute top-4 right-4 px-3 py-1 disabled:bg-white ${
                                userDataLoading || updating ? 'opacity-75' : ''
                            }`}
                            disabled={userDataLoading || updating}
                            onClick={() => setEditMode(true)}
                            variant="secondary"
                        >
                            <Edit className="text-primary-500 w-4 h-4" />
                        </Button>
                    )}
                </>
            )}
            <hr className="w-full" />
            <div className="w-full pt-5">
                <h3 className="pb-4 font-bold">{t('account.company.members')}</h3>
                <div className="divide-y divide-grey-200">
                    {Array.isArray(company?.profiles) &&
                        company?.profiles.map((profile) => {
                            return (
                                <div
                                    key={profile.id}
                                    className="flex flex-row space-x-8 items-center w-full py-2"
                                >
                                    <div className="w-1/3">
                                        <p className="text-xs text-gray-500">
                                            {t('account.company.fullName')}
                                        </p>
                                        <p>
                                            {' '}
                                            {profile.first_name}
                                            {` `}
                                            {profile.last_name}
                                        </p>
                                    </div>
                                    <div className="text-sm font-bold">
                                        <p className="text-xs font-normal text-gray-500">
                                            {t('account.company.role')}
                                        </p>
                                        <p>
                                            {profile.admin
                                                ? t('account.company.admin')
                                                : t('account.company.member')}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                </div>

                {Array.isArray(company?.invites) && company?.invites.length && (
                    <>
                        <p className="pt-8 pb-2 font-bold">
                            {t('account.company.pendingInvitations')}
                        </p>
                        {company?.invites.map((invites) => {
                            return (
                                <div
                                    key={invites.id}
                                    className="flex flex-row space-x-8 items-center border-t border-b border-grey-200 w-full py-2"
                                >
                                    <div>
                                        <p className="text-xs text-gray-500">
                                            {t('account.company.email')}
                                        </p>
                                        <p>{invites.email}</p>
                                    </div>
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
        </div>
    );
};

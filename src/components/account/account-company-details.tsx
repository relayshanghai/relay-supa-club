import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { updateCompanyErrors } from 'src/errors/company';
import { useFields } from 'src/hooks/use-fields';
import { isAdmin } from 'src/utils/utils';
import { hasCustomError } from 'src/utils/errors';
import { Button } from '../button';
import { Edit } from '../icons';
import { Input } from '../input';
import { InviteMembersModal } from './modal-invite-members';
import { useInvites } from 'src/hooks/use-invites';
import { useTeammates } from 'src/hooks/use-teammates';
import { useCompany } from 'src/hooks/use-company';
import { useUser } from 'src/hooks/use-user';
import { useRudderstack, useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { ACCOUNT_COMPANY_DETAILS } from 'src/utils/rudderstack/event-names';
import { UpdateProfileInfo } from 'src/utils/analytics/events';

export const CompanyDetails = () => {
    const { company, updateCompany, refreshCompany } = useCompany();
    const { loading: userDataLoading, profile } = useUser();
    const { invites, createInvite } = useInvites();
    const { trackEvent } = useRudderstack();
    const { teammates, refreshTeammates } = useTeammates();

    const [showAddMoreMembers, setShowAddMoreMembers] = useState(false);
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
        refreshTeammates();
        refreshCompany();
    }, [company, resetCompanyValues, refreshTeammates, refreshCompany]);

    const { t } = useTranslation();
    const { track } = useRudderstackTrack();

    const handleUpdateCompany = async () => {
        try {
            setUpdating(true);
            const oldCompanyName = company?.name;
            const oldCompanyWebsite = company?.website;
            await updateCompany({
                name: companyValues.name,
                website: companyValues.website,
            });
            toast.success(t('account.company.companyProfileUpdated'));
            setEditMode(false);
            if (companyValues.name !== oldCompanyName) {
                track(UpdateProfileInfo, {
                    info_type: 'Company',
                    info_name: 'Name',
                });
            }
            if (companyValues.website !== oldCompanyWebsite) {
                track(UpdateProfileInfo, {
                    info_type: 'Company',
                    info_name: 'Website',
                });
            }
        } catch (e: any) {
            if (hasCustomError(e, updateCompanyErrors)) {
                // right now we only have the companyWithSameNameExists error that's also used in login
                toast.error(t(`login.${e.message}`));
            } else {
                toast.error(t('account.company.oopsWentWrong'));
            }
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div
            className={`relative flex w-full flex-col items-start space-y-4 rounded-lg bg-white p-4 lg:max-w-2xl ${
                userDataLoading || updating ? 'opacity-50' : ''
            } shadow-lg shadow-gray-200`}
        >
            <InviteMembersModal
                showAddMoreMembers={showAddMoreMembers}
                setShowAddMoreMembers={setShowAddMoreMembers}
                createInvite={createInvite}
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
                        <div className="ml-2 text-sm font-bold">{companyValues.name}</div>
                    </div>

                    <div className="flex flex-col space-y-3">
                        <div className="text-sm">{t('account.company.website')}</div>
                        <div className="ml-2 text-sm font-bold">{companyValues.website}</div>
                    </div>
                </div>
            )}
            {isAdmin(profile?.user_role) && (
                <>
                    {editMode ? (
                        <div className="flex w-full flex-row justify-end space-x-4">
                            <Button disabled={userDataLoading || updating} onClick={handleUpdateCompany}>
                                {t('account.update')}
                            </Button>
                            <Button onClick={() => setEditMode(false)} variant="secondary">
                                {t('account.cancel')}
                            </Button>
                        </div>
                    ) : (
                        <Button
                            className={`absolute right-4 top-4 px-3 py-1 disabled:bg-white ${
                                userDataLoading || updating ? 'opacity-75' : ''
                            }`}
                            disabled={userDataLoading || updating}
                            onClick={() => {
                                setEditMode(true);
                                trackEvent(ACCOUNT_COMPANY_DETAILS('click on Edit'));
                            }}
                            variant="secondary"
                        >
                            <Edit className="h-4 w-4 text-primary-500" />
                        </Button>
                    )}
                </>
            )}
            <hr className="w-full" />
            <div className="w-full pt-5">
                <h3 className="pb-4 font-bold">{t('account.company.members')}</h3>
                <div className="divide-grey-200 divide-y">
                    {Array.isArray(teammates) &&
                        teammates.map((profile) => {
                            return (
                                <div key={profile.id} className="flex w-full flex-row items-center space-x-8 py-2">
                                    <div className="w-1/3">
                                        <p className="text-xs text-gray-500">{t('account.company.fullName')}</p>
                                        <p>
                                            {' '}
                                            {profile.first_name} {profile.last_name}
                                        </p>
                                    </div>
                                    <div className="text-sm font-bold">
                                        <p className="text-xs font-normal text-gray-500">{t('account.company.role')}</p>
                                        <p>
                                            {isAdmin(profile?.user_role)
                                                ? t('account.company.admin')
                                                : t('account.company.member')}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                </div>

                {invites && Array.isArray(invites) && invites.length > 0 && (
                    <>
                        <p className="pb-2 pt-8 font-bold">{t('account.company.pendingInvitations')}</p>
                        {invites.map((invites) => {
                            return (
                                <div
                                    key={invites.id}
                                    className="border-grey-200 flex w-full flex-row items-center space-x-8 border-b border-t py-2"
                                >
                                    <div>
                                        <p className="text-xs text-gray-500">{t('account.company.email')}</p>
                                        <p>{invites.email}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </>
                )}
                {isAdmin(profile?.user_role) && (
                    <div className="pt-4">
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setShowAddMoreMembers(true);
                                trackEvent(ACCOUNT_COMPANY_DETAILS('open addMoreMembers modal'));
                            }}
                        >
                            {t('account.company.addMoreMembers')}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

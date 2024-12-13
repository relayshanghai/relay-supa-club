import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { isAdmin } from 'src/utils/utils';
import { Button } from 'shadcn/components/ui/button';
import { InviteMembersModal } from './modal-invite-members';
import { useInvites } from 'src/hooks/use-invites';
import { useTeammates } from 'src/hooks/use-teammates';
import { useUser } from 'src/hooks/use-user';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from 'shadcn/components/ui/dialog';
import { useRudderstack } from 'src/hooks/use-rudderstack';
import { ACCOUNT_COMPANY_DETAILS } from 'src/utils/rudderstack/event-names';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from 'shadcn/components/ui/dropdown-menu';
import { ChevronDown, ProfilePlus } from '../icons';
import type { CompanyTeammatesGetResponse } from 'pages/api/company/teammates';
import { truncatedText } from 'src/utils/outreach/helpers';
import { Tooltip } from '../library';

export const TeamDetails = () => {
    const { profile } = useUser();
    const { invites, createInvite } = useInvites();
    const { trackEvent } = useRudderstack();
    const { teammates, refreshTeammates, updateTeammate, deleteTeammate } = useTeammates();

    const [showAddMoreMembers, setShowAddMoreMembers] = useState(false);

    useEffect(() => {
        refreshTeammates();
    }, [refreshTeammates]);

    const { t } = useTranslation();

    const handleChangeRole = useCallback(
        async (teammateProfile: CompanyTeammatesGetResponse[number], role: 'company_owner' | 'company_teammate') => {
            if (teammateProfile.user_role === role || !profile?.id) {
                return;
            }
            await updateTeammate(profile?.id, teammateProfile.id, role);
            refreshTeammates();
        },
        [refreshTeammates, updateTeammate, profile?.id],
    );

    const handleDeleteUser = useCallback(
        async (adminId: string, teammateId: string) => {
            await deleteTeammate(adminId, teammateId);
            refreshTeammates();
        },
        [refreshTeammates, deleteTeammate],
    );

    return (
        <section id="team-details" className="w-full">
            <p className="pb-6 font-semibold">{t('account.company.members')}</p>
            <hr className="pb-5" />
            <section className="flex w-full justify-end" id="team-details-section">
                <div className="p-4 text-sm lg:w-3/4">
                    <InviteMembersModal
                        showAddMoreMembers={showAddMoreMembers}
                        setShowAddMoreMembers={setShowAddMoreMembers}
                        createInvite={createInvite}
                    />
                    <div className="divide-grey-200 divide-y py-3">
                        {Array.isArray(teammates) &&
                            teammates.map((teammateProfile) => {
                                return (
                                    <div
                                        key={teammateProfile.id}
                                        className="flex w-full flex-row items-center space-x-8 py-2"
                                    >
                                        <p className="basis-1/5 whitespace-nowrap text-sm font-medium">
                                            <Tooltip
                                                content={teammateProfile.first_name + ' ' + teammateProfile.last_name}
                                                position="top-left"
                                            >
                                                {truncatedText(
                                                    teammateProfile.first_name + ' ' + teammateProfile.last_name,
                                                    15,
                                                )}
                                            </Tooltip>
                                        </p>
                                        <p className="flex w-full basis-2/5 justify-start whitespace-nowrap text-start text-sm font-normal">
                                            <Tooltip
                                                content={teammateProfile.email || ''}
                                                position="top-left"
                                                className="text-start"
                                            >
                                                {truncatedText(teammateProfile.email || '', 23)}
                                            </Tooltip>
                                        </p>
                                        {isAdmin(profile?.user_role) ? (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger>
                                                    <section className="flex w-32 flex-shrink-0 flex-grow-0 basis-1/5 items-center justify-between gap-3 rounded-lg border px-2 py-1 font-semibold shadow">
                                                        {isAdmin(teammateProfile?.user_role)
                                                            ? t('account.company.admin')
                                                            : t('account.company.member')}
                                                        <ChevronDown className="h-4 w-4 text-black" />
                                                    </section>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="text-sm">
                                                    <DropdownMenuItem
                                                        onSelect={() => {
                                                            handleChangeRole(teammateProfile, 'company_owner');
                                                        }}
                                                        className="text-sm"
                                                    >
                                                        {t('account.company.admin')}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onSelect={() => {
                                                            handleChangeRole(teammateProfile, 'company_teammate');
                                                        }}
                                                        className="text-sm"
                                                    >
                                                        {t('account.company.member')}
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        ) : (
                                            <p className="basis-1/5 text-sm font-semibold">
                                                {isAdmin(teammateProfile?.user_role)
                                                    ? t('account.company.admin')
                                                    : t('account.company.member')}
                                            </p>
                                        )}
                                        {isAdmin(profile?.user_role) && !isAdmin(teammateProfile?.user_role) ? (
                                            <Dialog>
                                                <DialogTrigger className="basis-1/5">
                                                    <button className="font-semibold text-red-400">Remove</button>
                                                </DialogTrigger>
                                                <DialogContent className="flex flex-col items-center">
                                                    <p>
                                                        Are you sure you want to delete this teammate? They will lose
                                                        their account but their sequences will get ported over to you
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                        <DialogClose>
                                                            <Button
                                                                variant="destructive"
                                                                className="text-sm font-medium text-red-500 hover:bg-red-600 hover:text-white"
                                                                onClick={() =>
                                                                    handleDeleteUser(
                                                                        profile?.id ?? '',
                                                                        teammateProfile.id,
                                                                    )
                                                                }
                                                            >
                                                                Yes, remove
                                                            </Button>
                                                        </DialogClose>
                                                        <DialogClose className="text-sm font-medium text-accent-500">
                                                            <Button>Cancel</Button>
                                                        </DialogClose>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        ) : (
                                            <div className="basis-1/5" />
                                        )}
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
                                            <p className="text-sm">{invites.email}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </>
                    )}
                    {isAdmin(profile?.user_role) && (
                        <div className="flex w-full justify-end pt-4">
                            <Button
                                className="flex items-center gap-2 bg-navy-50 font-semibold text-navy-500 hover:bg-navy-100 disabled:bg-gray-100 disabled:text-gray-500"
                                onClick={() => {
                                    setShowAddMoreMembers(true);
                                    trackEvent(ACCOUNT_COMPANY_DETAILS('open addMoreMembers modal'));
                                }}
                            >
                                <ProfilePlus className="h-4 w-4 flex-shrink-0" />
                                {t('account.company.inviteTeammate')}
                            </Button>
                        </div>
                    )}
                </div>
            </section>
        </section>
    );
};

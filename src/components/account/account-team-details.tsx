import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { isAdmin } from 'src/utils/utils';
import { Button } from 'shadcn/components/ui/button';
import { InviteMembersModal } from './modal-invite-members';
import { useInvites } from 'src/hooks/use-invites';
import { useTeammates } from 'src/hooks/use-teammates';
import { useUser } from 'src/hooks/use-user';
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

export const TeamDetails = () => {
    const { profile } = useUser();
    const { invites, createInvite } = useInvites();
    const { trackEvent } = useRudderstack();
    const { teammates, refreshTeammates, updateTeammate } = useTeammates();

    const [showAddMoreMembers, setShowAddMoreMembers] = useState(false);

    useEffect(() => {
        refreshTeammates();
    }, [refreshTeammates]);

    const { t } = useTranslation();

    const handleChangeRole = useCallback(
        async (teammateProfile: CompanyTeammatesGetResponse[number], role: 'company_owner' | 'company_teammate') => {
            if (teammateProfile.user_role === role) {
                return;
            }
            await updateTeammate(teammateProfile.id, role);
            refreshTeammates();
        },
        [refreshTeammates, updateTeammate],
    );

    return (
        <section id="team-details" className="w-full">
            <p className="pb-6 font-semibold">{t('account.company.members')}</p>
            <hr className="pb-5" />
            <section className="flex w-full justify-end">
                <div className="p-4 lg:w-3/4">
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
                                        <p className="basis-1/5 text-sm font-medium">
                                            {teammateProfile.first_name} {teammateProfile.last_name}
                                        </p>
                                        <p className="basis-2/5 font-normal">{teammateProfile.email}</p>
                                        {isAdmin(profile?.user_role) ? (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger>
                                                    <section className="flex basis-1/5 items-center gap-3 rounded-lg border px-2 py-1 font-semibold shadow">
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
                                        {isAdmin(profile?.user_role) && !isAdmin(teammateProfile?.user_role) && (
                                            <button className="font-semibold text-red-400">Remove</button>
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
                                            <p>{invites.email}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </>
                    )}
                    {isAdmin(profile?.user_role) && (
                        <div className="flex w-full justify-end pt-4">
                            <Button
                                className="flex items-center gap-2 bg-blue-200 font-semibold text-blue-500 hover:bg-blue-300"
                                onClick={() => {
                                    setShowAddMoreMembers(true);
                                    trackEvent(ACCOUNT_COMPANY_DETAILS('open addMoreMembers modal'));
                                }}
                            >
                                <ProfilePlus className="h-4 w-4 flex-shrink-0" />
                                {t('account.company.addMoreMembers')}
                            </Button>
                        </div>
                    )}
                </div>
            </section>
        </section>
    );
};

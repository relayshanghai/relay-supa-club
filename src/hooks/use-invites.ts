import type { CompanyCreateInvitePostBody, CompanyCreateInvitePostResponse } from 'pages/api/invites/create';
import { nextFetch, nextFetchWithQueries } from 'src/utils/fetcher';
import { useUser } from './use-user';
import { useCallback, useEffect, useState } from 'react';
import type { InvitesGetQueries, InvitesGetResponse } from 'pages/api/invites';
import type {
    CompanyAcceptInviteGetQueries,
    CompanyAcceptInviteGetResponse,
    CompanyAcceptInvitePostBody,
    CompanyAcceptInvitePostResponse,
} from 'pages/api/invites/accept';
import { useCompany } from './use-company';

export const useInvites = () => {
    const { profile } = useUser();
    const { company } = useCompany();

    const [invites, setInvites] = useState<InvitesGetResponse>([]);

    const refreshInvites = useCallback(async () => {
        if (!company?.id) {
            return;
        }
        const res = await nextFetchWithQueries<InvitesGetQueries, InvitesGetResponse>('invites', {
            id: company?.id,
        });
        setInvites(res.filter((d) => !d.used));
    }, [company?.id]);

    useEffect(() => {
        refreshInvites();
    }, [refreshInvites]);

    const createInvite = useCallback(
        async (email: string, companyOwner: boolean) => {
            if (!profile?.id) throw new Error('No profile found');
            if (!company?.id) throw new Error('No company found');
            const body: CompanyCreateInvitePostBody = {
                email: email,
                company_id: company?.id,
                name: `${profile.first_name} ${profile.last_name}`,
                companyOwner,
            };
            return await nextFetch<CompanyCreateInvitePostResponse>(`invites/create`, {
                method: 'post',
                body,
            });
        },
        [profile, company],
    );

    const getInviteStatus = useCallback(async (token: string) => {
        const tokenStatus = await nextFetchWithQueries<CompanyAcceptInviteGetQueries, CompanyAcceptInviteGetResponse>(
            'invites/accept',
            { token },
        );
        return tokenStatus;
    }, []);

    const acceptInvite = useCallback(async (body: CompanyAcceptInvitePostBody) => {
        const res = await nextFetch<CompanyAcceptInvitePostResponse>('invites/accept', {
            method: 'post',
            body,
        });
        return res;
    }, []);

    return {
        invites,
        createInvite,
        getInviteStatus,
        acceptInvite,
    };
};

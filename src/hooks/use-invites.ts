import type { CompanyCreateInvitePostBody, CompanyCreateInvitePostResponse } from 'pages/api/invites/create';
import { nextFetch, nextFetchWithQueries } from 'src/utils/fetcher';
import useSWR from 'swr';
import { useUser } from './use-user';
import { useCallback } from 'react';
import type { InvitesGetQueries, InvitesGetResponse } from 'pages/api/invites';
import type {
    CompanyAcceptInviteGetQueries,
    CompanyAcceptInviteGetResponse,
    CompanyAcceptInvitePostBody,
    CompanyAcceptInvitePostResponse,
} from 'pages/api/invites/accept';

export const useInvites = () => {
    const { profile } = useUser();
    const { data: invites, mutate: refreshUsages } = useSWR(profile?.company_id ? 'invites' : null, (path) =>
        nextFetchWithQueries<InvitesGetQueries, InvitesGetResponse>(path, {
            id: profile?.company_id ?? '',
        }),
    );

    const createInvite = useCallback(
        async (email: string, companyOwner: boolean) => {
            if (!profile?.company_id) throw new Error('No profile found');
            const body: CompanyCreateInvitePostBody = {
                email: email,
                company_id: profile.company_id,
                name: `${profile.first_name} ${profile.last_name}`,
                companyOwner,
            };
            return await nextFetch<CompanyCreateInvitePostResponse>(`invites/create`, {
                method: 'post',
                body,
            });
        },
        [profile],
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
        refreshUsages,
        createInvite,
        getInviteStatus,
        acceptInvite,
    };
};

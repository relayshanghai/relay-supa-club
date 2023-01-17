import { CompanyGetQueries, CompanyPostBody, CompanyPostResponse } from 'pages/api/company';
import { CompanyCreatePostBody, CompanyCreatePostResponse } from 'pages/api/company/create';
import {
    CompanyCreateInvitePostBody,
    CompanyCreateInvitePostResponse
} from 'pages/api/company/create-invite';
import { useCallback } from 'react';
import { CompanyWithProfilesInvitesAndUsage } from 'src/utils/api/db/calls/company';
import { CompanyDBInsert } from 'src/utils/api/db/types';
import { nextFetch, nextFetchWithQueries } from 'src/utils/fetcher';
import useSWR from 'swr';
import { useUser } from './use-user';

export const useCompany = () => {
    const { profile, user } = useUser();
    const { data: company, mutate: refreshCompany } = useSWR(
        profile?.company_id ? `company${new URLSearchParams({ id: profile.company_id })}` : null,
        nextFetchWithQueries<CompanyGetQueries, CompanyWithProfilesInvitesAndUsage>
    );

    const updateCompany = useCallback(
        async (input: CompanyPostBody) => {
            return await nextFetch<CompanyPostResponse>(`company`, {
                method: 'post',
                body: JSON.stringify({
                    ...input,
                    id: profile?.company_id
                })
            });
        },
        [profile]
    );

    const createInvite = useCallback(
        async (email: string) => {
            if (!profile?.company_id) throw new Error('No profile found');
            const body: CompanyCreateInvitePostBody = {
                email: email,
                company_id: profile.company_id,
                name: `${profile.first_name} ${profile.last_name}`
            };
            return await nextFetch<CompanyCreateInvitePostResponse>(`company/create-invite`, {
                method: 'post',
                body
            });
        },
        [profile]
    );

    const createCompany = useCallback(
        async (input: CompanyDBInsert) => {
            if (!user) throw new Error('No user found');
            const body: CompanyCreatePostBody = {
                ...input,
                user_id: user?.id
            };
            return await nextFetch<CompanyCreatePostResponse>(`company/create`, {
                method: 'post',
                body
            });
        },
        [user]
    );

    return {
        company,
        updateCompany,
        createInvite,
        createCompany,
        refreshCompany
    };
};

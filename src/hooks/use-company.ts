import { CompanyCreatePostBody, CompanyCreatePostResponse } from 'pages/api/company/create';
import { useCallback } from 'react';
import { CompanyWithProfilesInvitesAndUsage } from 'src/utils/api/db/calls/company';
import { CompanyDBInsert, CompanyDBUpdate } from 'src/utils/api/db/types';
import { nextFetch } from 'src/utils/fetcher';
import useSWR from 'swr';
import { useUser } from './use-user';

export const useCompany = () => {
    const { profile, user } = useUser();
    const { data: company, mutate: refreshCompany } = useSWR(
        profile?.company_id ? `company?id=${profile.company_id}` : null,
        nextFetch<CompanyWithProfilesInvitesAndUsage>
    );

    const updateCompany = useCallback(
        async (input: CompanyDBUpdate) => {
            return await nextFetch(`company`, {
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
        async (email: any) => {
            if (!profile) throw new Error('No profile found');
            return await nextFetch(`company/create-invite`, {
                method: 'post',
                body: JSON.stringify({
                    email: email,
                    company_id: profile.company_id,
                    name: `${profile.first_name} ${profile.last_name}`
                })
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

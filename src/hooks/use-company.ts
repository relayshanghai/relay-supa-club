import { useCallback } from 'react';
import { nextFetch } from 'src/utils/fetcher';
import useSWR from 'swr';
import { CompanyWithProfilesInvitesAndUsage } from 'types';
import { useUser } from './use-user';

export const useCompany = () => {
    const { profile, user } = useUser();
    const { data: company, mutate: refreshCompany } = useSWR(
        profile?.company_id ? `company?id=${profile.company_id}` : null,
        nextFetch<CompanyWithProfilesInvitesAndUsage>
    );

    const updateCompany = useCallback(
        async (input: any) => {
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
        async (input: any) => {
            return await nextFetch(`company/create`, {
                method: 'post',
                body: JSON.stringify({
                    ...input,
                    user_id: user?.id
                })
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

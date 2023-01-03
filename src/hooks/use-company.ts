import { useCallback } from 'react';
import { fetcher } from 'src/utils/fetcher';
import useSWR from 'swr';
import { CompanyWithProfilesInvitesAndUsage } from 'types';
import { useUser } from './use-user';

export const useCompany = () => {
    const { profile, user } = useUser();
    const { data: company, mutate: refreshCompany } = useSWR<CompanyWithProfilesInvitesAndUsage>(
        profile?.company_id ? `/api/company?id=${profile.company_id}` : null,
        fetcher
    );

    const updateCompany = useCallback(
        async (input: any) => {
            await fetch(`/api/company`, {
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
            await fetch(`/api/company/create-invite`, {
                method: 'post',
                body: JSON.stringify({
                    email: email,
                    company_id: profile?.company_id
                })
            });
        },
        [profile]
    );

    const createCompany = useCallback(
        async (input: any) => {
            await fetch(`/api/company/create`, {
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

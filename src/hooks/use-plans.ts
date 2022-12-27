import { useCallback } from 'react';
import { fetcher } from 'src/utils/fetcher';
import useSWR from 'swr';
import { useUser } from './use-user';

export const usePlans = () => {
    const { profile, user } = useUser();
    const { data } = useSWR(
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
        company: data,
        updateCompany,
        createCompany
    };
};

import { useCallback, useState } from 'react';
import { fetcher } from 'src/utils/fetcher';
import useSWR from 'swr';
import { useUser } from './use-user';

export const useCompany = () => {
    const { profile, user } = useUser();
    const { data, error } = useSWR(
        profile?.company_id ? `/api/company?id=${profile.company_id}` : null,
        fetcher
    );

    const updateCompany = useCallback(async (input: any) => {
        await fetch(`/api/company`, {
            method: 'post',
            body: JSON.stringify(input)
        });
    }, []);

    return {
        company: data,
        updateCompany
    };
};

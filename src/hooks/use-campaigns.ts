import { useCallback, useState } from 'react';
import { fetcher } from 'src/utils/fetcher';
import useSWR from 'swr';
import { useUser } from './use-user';

export const useCampaigns = () => {
    const { profile, user } = useUser();
    const { data } = useSWR(
        profile?.company_id ? `/api/campaigns?id=${profile.company_id}` : null,
        fetcher
    );

    const createCampaign = useCallback(
        async (input: any) => {
            await fetch(`/api/campaigns/create`, {
                method: 'post',
                body: JSON.stringify({
                    ...input,
                    company_id: profile?.company_id
                })
            });
        },
        [profile]
    );

    return {
        campaigns: data,
        createCampaign
    };
};

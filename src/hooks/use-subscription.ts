import { useCallback, useState } from 'react';
import { fetcher } from 'src/utils/fetcher';
import useSWR from 'swr';
import { useUser } from './use-user';

export const useSubscription = () => {
    const { profile } = useUser();
    const { data, mutate } = useSWR(
        profile?.company ? `/api/subscriptions?id=${profile?.company.id}` : null,
        fetcher
    );
    const { data: plans } = useSWR(`/api/subscriptions/plans`, fetcher);

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

    const createSubscriptions = useCallback(
        async (planId: any) => {
            await fetch(`/api/subscriptions/create`, {
                method: 'post',
                body: JSON.stringify({
                    plan_id: planId,
                    company_id: profile.company_id
                })
            });
            mutate();
        },
        [profile, mutate]
    );

    return {
        subscription: data,
        plans,
        updateCompany,
        createSubscriptions
    };
};

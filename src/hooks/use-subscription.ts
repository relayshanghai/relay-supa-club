import type { SubscriptionGetQueries, SubscriptionGetResponse } from 'pages/api/subscriptions';
import type { SubscriptionCancelPostBody, SubscriptionCancelPostResponse } from 'pages/api/subscriptions/cancel';
import type { SubscriptionCreatePostBody, SubscriptionCreatePostResponse } from 'pages/api/subscriptions/create';
import type {
    SubscriptionDiscountRenewPostBody,
    SubscriptionDiscountRenewPostResponse,
} from 'pages/api/subscriptions/discount-renew';
import { useCallback } from 'react';
import { nextFetch, nextFetchWithQueries } from 'src/utils/fetcher';
import useSWR from 'swr';
import { useCompany } from './use-company';

export const useSubscription = () => {
    const { company } = useCompany();
    const { data: subscription, mutate } = useSWR(
        company?.id ? [company.id, 'subscriptions'] : null,
        async ([id, path]) => await nextFetchWithQueries<SubscriptionGetQueries, SubscriptionGetResponse>(path, { id }),
    );

    const upgradeSubscription = useCallback(
        async (priceId: string) => {
            const res = await nextFetch<SubscriptionCreatePostResponse>('subscriptions/upgrade', {
                method: 'post',
                body: JSON.stringify({
                    priceId,
                }),
            });
            mutate();
            return res;
        },
        [mutate],
    );

    const createSubscription = useCallback(
        async (priceId: string, couponId?: string) => {
            if (!company?.id) throw new Error('No company found');
            const body: SubscriptionCreatePostBody = {
                price_id: priceId,
                company_id: company?.id,
                coupon_id: couponId,
            };
            const res = await nextFetch<SubscriptionCreatePostResponse>('subscriptions/create', {
                method: 'post',
                body: JSON.stringify(body),
            });
            mutate();
            return res;
        },
        [company?.id, mutate],
    );

    const createDiscountRenew = useCallback(async () => {
        if (!company?.id) throw new Error('No company found');
        const body: SubscriptionDiscountRenewPostBody = {
            company_id: company?.id,
        };
        const res = await nextFetch<SubscriptionDiscountRenewPostResponse>('subscriptions/discount-renew', {
            method: 'post',
            body: JSON.stringify(body),
        });
        mutate();
        return res;
    }, [company?.id, mutate]);

    const cancelSubscription = useCallback(async () => {
        if (!subscription) throw new Error('No subscription found');
        if (!company?.id) throw new Error('No company found');
        const body: SubscriptionCancelPostBody = {
            company_id: company?.id,
        };
        const res = await nextFetch<SubscriptionCancelPostResponse>('subscriptions/cancel', {
            method: 'post',
            body: JSON.stringify(body),
        });

        mutate({ ...subscription });

        return res;
    }, [company?.id, mutate, subscription]);

    return {
        subscription,
        refreshSubscription: mutate,
        createSubscription,
        createDiscountRenew,
        cancelSubscription,
        upgradeSubscription,
    };
};

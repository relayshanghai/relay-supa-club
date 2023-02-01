import { SubscriptionGetQueries, SubscriptionGetResponse } from 'pages/api/subscriptions';
import {
    SubscriptionCancelPostBody,
    SubscriptionCancelPostResponse,
} from 'pages/api/subscriptions/cancel';
import {
    SubscriptionCreatePostBody,
    SubscriptionCreatePostResponse,
} from 'pages/api/subscriptions/create';
import {
    SubscriptionCreateTrialPostBody,
    SubscriptionCreateTrialResponse,
} from 'pages/api/subscriptions/create-trial';
import {
    SubscriptionDiscountRenewPostBody,
    SubscriptionDiscountRenewPostResponse,
} from 'pages/api/subscriptions/discount-renew';
import {
    PaymentMethodGetQueries,
    PaymentMethodGetResponse,
} from 'pages/api/subscriptions/payment-method';
import { useCallback } from 'react';
import { nextFetch, nextFetchWithQueries } from 'src/utils/fetcher';
import useSWR from 'swr';
import { useUser } from './use-user';

export const useSubscription = () => {
    const { profile } = useUser();
    const { data: subscription, mutate } = useSWR(
        profile?.company_id ? 'subscriptions' : null,
        async (path) =>
            await nextFetchWithQueries<SubscriptionGetQueries, SubscriptionGetResponse>(path, {
                id: profile?.company_id ?? '',
            }),
    );
    const { data: paymentMethods, mutate: refreshPaymentMethods } = useSWR(
        profile?.company_id ? 'subscriptions/payment-method' : null,
        async (path) =>
            await nextFetchWithQueries<PaymentMethodGetQueries, PaymentMethodGetResponse>(path, {
                id: profile?.company_id ?? '',
            }),
    );

    const createTrial = useCallback(async () => {
        if (!profile?.company_id) throw new Error('No profile found');
        const body: SubscriptionCreateTrialPostBody = {
            company_id: profile?.company_id,
        };
        const res = await nextFetch<SubscriptionCreateTrialResponse>('subscriptions/create-trial', {
            method: 'post',
            body: JSON.stringify(body),
        });
        mutate();
        return res;
    }, [profile, mutate]);

    const createSubscription = useCallback(
        async (priceId: string) => {
            if (!profile?.company_id) throw new Error('No profile found');
            const body: SubscriptionCreatePostBody = {
                price_id: priceId,
                company_id: profile?.company_id,
            };
            const res = await nextFetch<SubscriptionCreatePostResponse>('subscriptions/create', {
                method: 'post',
                body: JSON.stringify(body),
            });
            mutate();
            return res;
        },
        [profile, mutate],
    );

    const createDiscountRenew = useCallback(async () => {
        if (!profile?.company_id) throw new Error('No profile found');
        const body: SubscriptionDiscountRenewPostBody = {
            company_id: profile?.company_id,
        };
        const res = await nextFetch<SubscriptionDiscountRenewPostResponse>(
            'subscriptions/discount-renew',
            {
                method: 'post',
                body: JSON.stringify(body),
            },
        );
        mutate();
        return res;
    }, [profile, mutate]);

    const cancelSubscription = useCallback(async () => {
        if (!profile?.company_id) throw new Error('No profile found');
        const body: SubscriptionCancelPostBody = {
            company_id: profile?.company_id,
        };
        const res = await nextFetch<SubscriptionCancelPostResponse>('subscriptions/cancel', {
            method: 'post',
            body: JSON.stringify(body),
        });
        mutate();
        return res;
    }, [profile, mutate]);

    return {
        subscription,
        paymentMethods,
        refreshPaymentMethods,
        createSubscription,
        createTrial,
        createDiscountRenew,
        cancelSubscription,
    };
};

import type { SubscriptionGetQueries, SubscriptionGetResponse } from 'pages/api/subscriptions';
import type { SubscriptionCancelPostBody, SubscriptionCancelPostResponse } from 'pages/api/subscriptions/cancel';
import type { SubscriptionCreatePostBody, SubscriptionCreatePostResponse } from 'pages/api/subscriptions/create';
import type {
    SubscriptionCreateTrialPostBody,
    SubscriptionCreateTrialResponse,
} from 'pages/api/subscriptions/create-trial-legacy';
import type {
    SubscriptionDiscountRenewPostBody,
    SubscriptionDiscountRenewPostResponse,
} from 'pages/api/subscriptions/discount-renew';
import type { PaymentMethodGetQueries, PaymentMethodGetResponse } from 'pages/api/subscriptions/payment-method';
import { useCallback } from 'react';
import { nextFetch, nextFetchWithQueries } from 'src/utils/fetcher';
import useSWR from 'swr';
import { useCompany } from './use-company';

export const useSubscription = () => {
    const { company } = useCompany();
    const { data: subscription, mutate } = useSWR(
        company?.id ? 'subscriptions' : null,
        async (path) =>
            await nextFetchWithQueries<SubscriptionGetQueries, SubscriptionGetResponse>(path, {
                id: company?.id ?? '',
            }),
    );
    const { data: paymentMethods, mutate: refreshPaymentMethods } = useSWR(
        company?.id ? 'subscriptions/payment-method' : null,
        async (path) =>
            await nextFetchWithQueries<PaymentMethodGetQueries, PaymentMethodGetResponse>(path, {
                id: company?.id ?? '',
            }),
    );

    const createTrialLegacy = useCallback(async () => {
        if (!company?.id) throw new Error('No company found');
        const body: SubscriptionCreateTrialPostBody = {
            company_id: company?.id,
        };
        const res = await nextFetch<SubscriptionCreateTrialResponse>('subscriptions/create-trial-legacy', {
            method: 'post',
            body: JSON.stringify(body),
        });
        mutate();
        return res;
    }, [company?.id, mutate]);

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

        const status: SubscriptionGetResponse['status'] = 'canceled';
        mutate({ ...subscription, status });

        return res;
    }, [company?.id, mutate, subscription]);

    return {
        subscription,
        paymentMethods,
        refreshPaymentMethods,
        refreshSubscription: mutate,
        createSubscription,
        createTrialLegacy,
        createDiscountRenew,
        cancelSubscription,
    };
};

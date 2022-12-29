import { useCallback } from 'react';
import { fetcher } from 'src/utils/fetcher';
import Stripe from 'stripe';
import useSWR from 'swr';
import { StripePaymentMethods, StripePlansWithPrice } from 'types';
import { useUser } from './use-user';

export const useSubscription = () => {
    const { profile } = useUser();
    const { data: subscription, mutate } = useSWR<Stripe.Subscription>(
        profile?.company_id ? `/api/subscriptions?id=${profile?.company_id}` : null,
        fetcher
    );
    const { data: plans } = useSWR<StripePlansWithPrice>(`/api/subscriptions/plans`, fetcher);
    const { data: paymentMethods } = useSWR<StripePaymentMethods>(
        profile?.company_id ? `/api/subscriptions/payment-method?id=${profile.company_id}` : null,
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

    const createSubscriptions = useCallback(
        async (priceId: any) => {
            await fetch(`/api/subscriptions/create`, {
                method: 'post',
                body: JSON.stringify({
                    price_id: priceId,
                    company_id: profile?.company_id
                })
            });
            mutate();
        },
        [profile, mutate]
    );

    return {
        subscription,
        paymentMethods,
        plans,
        updateCompany,
        createSubscriptions
    };
};

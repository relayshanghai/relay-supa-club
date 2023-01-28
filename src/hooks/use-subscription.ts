import { useCallback } from 'react';
import { nextFetch } from 'src/utils/fetcher';
import Stripe from 'stripe';
import useSWR from 'swr';
import { StripePaymentMethods } from 'types';
import { useUser } from './use-user';

export const useSubscription = () => {
    const { profile } = useUser();
    // TODO: investigate why this type doesn't seem to match our code's usage
    const { data: subscription, mutate } = useSWR(
        profile?.company_id ? `subscriptions?id=${profile?.company_id}` : null,
        nextFetch<Stripe.Subscription>
    );

    const { data: paymentMethods } = useSWR(
        profile?.company_id ? `subscriptions/payment-method?id=${profile.company_id}` : null,
        nextFetch<StripePaymentMethods>
    );

    const updateCompany = useCallback(
        async (input: any) => {
            await nextFetch('company', {
                method: 'post',
                body: JSON.stringify({
                    ...input,
                    id: profile?.company_id,
                }),
            });
            mutate();
        },
        [profile, mutate]
    );

    const createSubscriptions = useCallback(
        async (priceId: any) => {
            await nextFetch('subscriptions/create', {
                method: 'post',
                body: JSON.stringify({
                    price_id: priceId,
                    company_id: profile?.company_id,
                }),
            });
            mutate();
        },
        [profile, mutate]
    );

    return {
        subscription,
        paymentMethods,
        updateCompany,
        createSubscriptions,
    };
};

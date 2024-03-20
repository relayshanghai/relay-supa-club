import type { AxiosResponse } from 'axios';
import type { CreatePaymentMethodRequest } from 'pages/api/v2/subscriptions/request';
import { useApiClient } from 'src/utils/api-client/request';
import awaitToError from 'src/utils/await-to-error';
import type Stripe from 'stripe';
import useSWR from 'swr';

export type CreateSubscriptionPayload = { priceId: string; quantity: number };
export type CreateSubscriptionResponse = {
    providerSubscriptionId: string;
    clientSecret: string;
    ipAddress: string;
};

export const STRIPE_SUBSCRIBE_RESPONSE = 'boostbot_stripe_secret_response';
export const stripeSubscribeResponseInitialValue = { clientSecret: '', ipAddress: '', plan: '' };

export const useSubscriptionV2 = () => {
    const { apiClient, loading, error } = useApiClient();
    const createSubscription = async (payload: CreateSubscriptionPayload) => {
        const [err, res] = await awaitToError(apiClient.post<CreateSubscriptionResponse>('/v2/subscriptions', payload));
        if (err) return;
        return res.data;
    };
    const { data: subscription, mutate: refreshSubscription } = useSWR('/v2/subscriptions', async () => {
        const [err, res] = await awaitToError(
            apiClient.get<Stripe.Subscription>('/v2/subscriptions').then((res) => res.data),
        );

        if (err) return;

        return res;
    });
    const addPaymentMethod = async ({
        paymentMethodId,
        paymentMethodType,
        currency = 'cny',
    }: {
        paymentMethodId: string;
        paymentMethodType: 'card' | 'alipay';
        currency?: string;
    }) => {
        const [err, res] = await awaitToError(
            apiClient.post<CreatePaymentMethodRequest, AxiosResponse<Stripe.SetupIntent>>(
                '/v2/subscriptions/payment-method',
                {
                    paymentMethodId,
                    paymentMethodType,
                    userAgent: window.navigator.userAgent,
                    currency,
                },
            ),
        );
        if (err) return;

        return res.data;
    };

    return { loading, error, createSubscription, subscription, refreshSubscription, addPaymentMethod };
};

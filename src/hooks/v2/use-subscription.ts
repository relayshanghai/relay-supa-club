import { useApiClient } from 'src/utils/api-client/request';
import awaitToError from 'src/utils/await-to-error';

export type CreateSubscriptionPayload = { priceId: string; quantity: number };
export type CreateSubscriptionResponse = {
    providerSubscriptionId: string;
    clientSecret: string;
    ipAddress: string;
};
export type ApplyCouponPayload = { coupon: string };
export type ApplyCouponResponse = {
    id: string;
    amount_off: null;
    percent_off: number;
    duration_in_months: number;
    name: string;
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
    return { loading, error, createSubscription };
};

export const useCouponV2 = () => {
    const { apiClient, loading, error } = useApiClient();
    const applyCoupon = async (subscriptionId: string, payload: ApplyCouponPayload) => {
        const [err, res] = await awaitToError(
            apiClient.put<ApplyCouponResponse>(`/v2/subscriptions/${subscriptionId}/apply-promo`, payload),
        );
        if (err) return;
        return res.data;
    };
    return { loading, error, applyCoupon };
};

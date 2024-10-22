import type { SubscriptionEntity } from 'src/backend/database/subcription/subscription-entity';
import type { AxiosResponse } from 'axios';
import type {
    CreatePaymentMethodRequest,
    GetProductRequest,
    RemovePaymentMethodRequest,
    UpdateDefaultPaymentMethodRequest,
    UpdateSubscriptionRequest,
} from 'pages/api/v2/subscriptions/request';
import { useCallback } from 'react';
import { useApiClient } from 'src/utils/api-client/request';
import awaitToError from 'src/utils/await-to-error';
import type Stripe from 'stripe';
import useSWR from 'swr';
import { useCompany } from '../use-company';
import { useLocalStorage } from '../use-localstorage';
import { create } from 'zustand';
import type { Nullable } from 'vitest';

export type CreateSubscriptionPayload = { priceId: string; quantity: number };
export type CreateSubscriptionResponse = {
    providerSubscriptionId: string;
    clientSecret: string;
    ipAddress: string;
    coupon?: string;
};

export type PaymentMethodResponse = {
    paymentMethods?: Stripe.PaymentMethod[];
    defaultPaymentMethod: string;
};
export type Coupon = {
    id: string;
    amount_off: null;
    percent_off: number;
    duration_in_months: number;
    name: string;
};
export type ApplyCouponPayload = { coupon: string };
export type ApplyCouponResponse = CreateSubscriptionResponse & {
    plan?: string;
    coupon: Coupon;
};

export const STRIPE_SUBSCRIBE_RESPONSE = 'boostbot_stripe_secret_response';
export const stripeSubscribeResponseInitialValue: {
    clientSecret: string;
    ipAddress: string;
    plan: string;
    coupon?: string;
} = { clientSecret: '', ipAddress: '', plan: '', coupon: undefined };

export const useLocalStorageSubscribeResponse = () =>
    useLocalStorage(STRIPE_SUBSCRIBE_RESPONSE, stripeSubscribeResponseInitialValue);
export const useSubscription = () => {
    const { apiClient, loading, error } = useApiClient();
    const { company } = useCompany();
    const {
        data: customer,
        mutate: refreshCustomer,
        isLoading: customerLoading,
        isValidating: customerValidating,
    } = useSWR('/v2/subscriptions/customer', async () => {
        const [err, res] = await awaitToError(
            apiClient.get<any, AxiosResponse<Stripe.Customer>>('/v2/subscriptions/customer'),
        );
        if (err) return;
        return res.data;
    });
    const {
        data: paymentMethodInfo,
        mutate: refreshPaymentMethodInfo,
        isLoading: paymentMethodInfoLoading,
        isValidating: paymentMethodInfoValidating,
    } = useSWR('/v2/subscriptions/payment-methods', async () => {
        const [err, res] = await awaitToError(
            apiClient.get<any, AxiosResponse<PaymentMethodResponse>>('/v2/subscriptions/payment-method'),
        );
        if (err) return;
        return res.data;
    });
    const createSubscription = async (payload: CreateSubscriptionPayload) => {
        const [err, res] = await awaitToError(apiClient.post<CreateSubscriptionResponse>('/v2/subscriptions', payload));
        if (err) throw err;
        return res.data;
    };
    const changeSubscription = async (payload: CreateSubscriptionPayload) => {
        const [err, res] = await awaitToError(
            apiClient.patch<CreateSubscriptionResponse>('/v2/subscriptions', payload),
        );
        if (err) throw err;
        return res.data;
    };
    const { data: subscription, mutate: refreshSubscription } = useSWR('/v2/subscriptions', async () => {
        const [err, res] = await awaitToError(
            apiClient
                .get<SubscriptionEntity<Stripe.Subscription & { plan: Stripe.Plan }>>('/v2/subscriptions')
                .then((res) => res.data),
        );

        if (err) return;

        return res;
    });
    const cancelSubscription = async () => {
        const [err, res] = await awaitToError(apiClient.delete('/v2/subscriptions'));
        if (err) throw err;
        return res.data;
    };
    const resumeSubscription = async () => {
        const [err, res] = await awaitToError(apiClient.put('/v2/subscriptions/resume'));
        if (err) throw err;
        return res.data;
    };
    const addPaymentMethod = async ({
        paymentMethodId,
        paymentMethodType,
        currency = 'cny',
        isDefault,
    }: {
        paymentMethodId: string;
        paymentMethodType: 'card' | 'alipay';
        currency?: string;
        isDefault?: boolean;
    }) => {
        const [err, res] = await awaitToError(
            apiClient.post<CreatePaymentMethodRequest, AxiosResponse<Stripe.SetupIntent>>(
                '/v2/subscriptions/payment-method',
                {
                    paymentMethodId,
                    paymentMethodType,
                    userAgent: window.navigator.userAgent,
                    currency,
                    isDefault,
                },
            ),
        );
        if (err) return;

        return res.data;
    };

    const { data: product, mutate: refreshProduct } = useSWR(
        subscription ? '/v2/subscriptions/product' : null,
        async () => {
            const productId = subscription?.subscriptionData.items.data[0].price.product as string;
            const [err, res] = await awaitToError(
                apiClient.get<GetProductRequest, AxiosResponse<Stripe.Product>>(
                    `/v2/subscriptions/product?productId=${productId}`,
                ),
            );
            if (err) return;
            return res.data;
        },
    );

    const updateDefaultInvoiceEmail = useCallback(
        async (email: string) => {
            if (!company?.id) throw new Error('No company found');
            const [err, res] = await awaitToError(
                apiClient.put<
                    UpdateSubscriptionRequest,
                    AxiosResponse<
                        Stripe.Customer & {
                            ipAddress: string;
                        }
                    >
                >('/v2/subscriptions/customer', {
                    email,
                }),
            );
            if (err) return;
            return res.data;
        },
        [company?.id, apiClient],
    );

    const removePaymentMethod = useCallback(
        async (paymentMethodId: string) => {
            const [err, res] = await awaitToError(
                apiClient.delete<RemovePaymentMethodRequest, AxiosResponse<Stripe.PaymentMethod>>(
                    `/v2/subscriptions/payment-method`,
                    {
                        data: {
                            paymentMethodId,
                        },
                    },
                ),
            );
            if (err) return;
            return res.data;
        },
        [apiClient],
    );

    const updateDefaultPaymentMethod = useCallback(
        async (paymentMethodId: string) => {
            const [err, res] = await awaitToError(
                apiClient.put<UpdateDefaultPaymentMethodRequest, AxiosResponse<Stripe.Customer>>(
                    '/v2/subscriptions/payment-method',
                    {
                        paymentMethodId,
                    },
                ),
            );
            if (err) return;
            return res.data;
        },
        [apiClient],
    );

    return {
        loading,
        error,
        createSubscription,
        subscription,
        refreshSubscription,
        updateDefaultInvoiceEmail,
        addPaymentMethod,
        customer,
        refreshCustomer,
        removePaymentMethod,
        updateDefaultPaymentMethod,
        paymentMethods: paymentMethodInfo?.paymentMethods,
        defaultPaymentMethod: paymentMethodInfo?.defaultPaymentMethod,
        refreshPaymentMethodInfo,
        customerLoading,
        customerValidating,
        paymentMethodInfoLoading,
        paymentMethodInfoValidating,
        product,
        refreshProduct,
        cancelSubscription,
        changeSubscription,
        resumeSubscription,
    };
};

interface ApplyCouponStore {
    applyCouponResponse: Nullable<ApplyCouponResponse>;
    setApplyCouponResponse: (response: ApplyCouponResponse) => void;
    resetApplyCouponResponse: () => void;
}
export const useApplyCouponResponseStore = create<ApplyCouponStore>((set) => ({
    applyCouponResponse: null,
    setApplyCouponResponse: (response: ApplyCouponResponse) => set({ applyCouponResponse: response }),
    resetApplyCouponResponse: () => set({ applyCouponResponse: null }),
}));
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

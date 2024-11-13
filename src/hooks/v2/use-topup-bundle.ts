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

export const STRIPE_SELECTED_TOPUP_BUNDLE = 'boostbot_stripe_bundle_response';
export const stripeSubscribeResponseInitialValue: {
    clientSecret: string;
    ipAddress: string;
    plan: string;
    coupon?: string;
} = { clientSecret: '', ipAddress: '', plan: '', coupon: undefined };

export const useLocalSelectedTopupBundle = () =>
    useLocalStorage(STRIPE_SELECTED_TOPUP_BUNDLE, stripeSubscribeResponseInitialValue);
export const useTopUpPlan = () => {
    const { apiClient, loading, error } = useApiClient();
    const { company } = useCompany();

    return {}
};

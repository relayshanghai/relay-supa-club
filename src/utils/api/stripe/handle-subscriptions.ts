import type {
    SubscriptionCancelPostRequestBody,
    SubscriptionCancelPostResponseBody,
} from 'pages/api/subscriptions/cancel-with-subscription-id';
import type { CreateSetUpIntentPostBody } from 'pages/api/subscriptions/create-setup-intent';
import type {
    SubscriptionUpgradePostRequestBody,
    SubscriptionUpgradePostResponse,
} from 'pages/api/subscriptions/create-subscription-with-payment-intent';
import type { PromotionCodesListResponse } from 'pages/api/subscriptions/promo-codes';
import { nextFetch } from 'src/utils/fetcher';

export const upgradeSubscriptionWithPaymentIntent = async (
    companyId: string,
    cusId: string,
    priceId: string,
    couponId?: string,
) => {
    const body: SubscriptionUpgradePostRequestBody = {
        companyId,
        cusId,
        priceId,
        couponId,
    };
    const res = await nextFetch<SubscriptionUpgradePostResponse>(
        'subscriptions/create-subscription-with-payment-intent',
        {
            method: 'post',
            body: JSON.stringify(body),
        },
    );
    return res;
};

export const cancelSubscriptionWithSubscriptionId = async (subscriptionId: string) => {
    const body: SubscriptionCancelPostRequestBody = {
        subscriptionId,
    };
    const res = await nextFetch<SubscriptionCancelPostResponseBody>('subscriptions/cancel-with-subscription-id', {
        method: 'post',
        body: JSON.stringify(body),
    });
    return res;
};

export const createSetupIntentForAlipay = async (
    companyId: string,
    customerId: string,
    priceId: string,
    currency: string,
    priceTier: string,
) => {
    const body: CreateSetUpIntentPostBody = {
        companyId,
        customerId,
        paymentMethodTypes: ['alipay'],
        priceId,
        currency,
        priceTier,
    };

    const res = await nextFetch('subscriptions/create-setup-intent', {
        method: 'post',
        body: JSON.stringify(body),
    });
    return res;
};

export const upgradeSubscriptionWithAlipay = async (companyId: string, cusId: string, priceId: string) => {
    const body: SubscriptionUpgradePostRequestBody = {
        companyId,
        cusId,
        priceId,
    };
    const res = await nextFetch('subscriptions/create-subscription-with-alipay', {
        method: 'post',
        body: JSON.stringify(body),
    });
    return res;
};

export const getSetupIntents = async (cusId: string) => {
    const setupIntents = await nextFetch(`subscriptions/setup-intents?cusId=${cusId}`, {
        method: 'get',
    });
    return setupIntents;
};

export const getAllPromoCodes = async () => {
    const { data: promoCodes } = await nextFetch<PromotionCodesListResponse>('subscriptions/promo-codes', {
        method: 'get',
    });
    return promoCodes;
};

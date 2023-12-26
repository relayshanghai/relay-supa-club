import type {
    SubscriptionCancelPostRequestBody,
    SubscriptionCancelPostResponseBody,
} from 'pages/api/subscriptions/cancel-with-subscription-id';
import type {
    CreateSetUpIntentForAlipayPostBody,
    CreateSetUpIntentForAlipayPostResponse,
} from 'pages/api/subscriptions/create-setup-intent-with-alipay';
import type {
    SubscriptionUpgradeWithAlipayPostRequestBody,
    SubscriptionUpgradeWithAlipayPostResponse,
} from 'pages/api/subscriptions/create-subscription-with-alipay';
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
            body,
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
        body,
    });
    return res;
};

export const createSetupIntentForAlipay = async ({
    companyId,
    customerId,
    priceId,
    currency,
    priceTier,
    couponId,
}: {
    companyId: string;
    customerId: string;
    priceId: string;
    currency: string;
    priceTier: string;
    couponId?: string;
}) => {
    const body: CreateSetUpIntentForAlipayPostBody = {
        companyId,
        customerId,
        paymentMethodTypes: ['alipay'],
        priceId,
        currency,
        priceTier,
        couponId,
    };

    const res = await nextFetch<CreateSetUpIntentForAlipayPostResponse>(
        'subscriptions/create-setup-intent-with-alipay',
        {
            method: 'post',
            body,
        },
    );
    return res;
};

export const upgradeSubscriptionWithAlipay = async ({
    companyId,
    cusId,
    priceId,
    couponId,
}: {
    companyId: string;
    cusId: string;
    priceId: string;
    couponId?: string;
}) => {
    const body: SubscriptionUpgradeWithAlipayPostRequestBody = {
        companyId,
        cusId,
        priceId,
        couponId,
    };
    const res = await nextFetch<SubscriptionUpgradeWithAlipayPostResponse>(
        'subscriptions/create-subscription-with-alipay',
        {
            method: 'post',
            body,
        },
    );
    return res;
};

export const getSetupIntents = async (cusId: string) => {
    const setupIntents = await nextFetch(`subscriptions/setup-intents?cusId=${cusId}`);
    return setupIntents;
};

export const getAllPromoCodes = async () => {
    const { data: promoCodes } = await nextFetch<PromotionCodesListResponse>('subscriptions/promo-codes');
    return promoCodes;
};

import type {
    SubscriptionCancelPostRequestBody,
    SubscriptionCancelPostResponseBody,
} from 'pages/api/subscriptions/cancel-with-subscription-id';
import type {
    SubscriptionUpgradePostRequestBody,
    SubscriptionUpgradePostResponse,
} from 'pages/api/subscriptions/create-subscription-with-payment-intent';
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

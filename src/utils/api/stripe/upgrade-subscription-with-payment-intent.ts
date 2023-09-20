import type {
    SubscriptionUpgradePostBody,
    SubscriptionUpgradePostResponse,
} from 'pages/api/subscriptions/create-subscription-with-payment-intent';
import { nextFetch } from 'src/utils/fetcher';

export const UpgradeSubscriptionWithPaymentIntent = async (
    companyId: string,
    cusId: string,
    priceId: string,
    couponId?: string,
) => {
    const body: SubscriptionUpgradePostBody = {
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

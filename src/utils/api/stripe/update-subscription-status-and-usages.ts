import { stripeClient } from './stripe-client';
import type { RelayPlanStripeProduct } from 'types';
import { nextFetch } from 'src/utils/fetcher';

export const UpdateSubscriptionStatusAndUsages = async (companyId: string, subscriptionId: string, priceId: string) => {
    const subscription = await stripeClient.subscriptions.retrieve(subscriptionId);
    const price = await stripeClient.prices.retrieve(priceId);
    const product = (await stripeClient.products.retrieve(price.product as string)) as RelayPlanStripeProduct;

    const body = {
        subscription,
        price,
        product,
        companyId,
    };
    const res = await nextFetch('subscriptions/create-subscription-with-payment-intent', {
        method: 'post',
        body: JSON.stringify(body),
    });
    return res;
};

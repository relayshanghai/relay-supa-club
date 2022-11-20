import { stripeClient } from 'src/utils/stripe-client';

export const searchSubscription = async ({ company_id }: any) => {
    return await stripeClient.subscriptions.search({
        query: `status:'active' AND metadata["company_id"]:"${company_id}"`
    });
};

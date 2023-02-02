import { SubscriptionPortalGetQueries } from 'pages/api/subscriptions/portal';
import { getCompanyCusId } from 'src/utils/api/db';

import { stripeClient } from 'src/utils/api/stripe/stripe-client';
import Stripe from 'stripe';

/** @param id company ID */
export const buildSubscriptionPortalUrl = ({ id, returnUrl }: SubscriptionPortalGetQueries) => {
    const url = new URL('/api/subscriptions/portal', window.location.origin);

    url.searchParams.append('id', id);
    if (returnUrl) url.searchParams.append('returnUrl', returnUrl);

    return url.toString();
};

export interface ExpandedPlanWithProduct extends Stripe.Plan {
    product: Stripe.Product;
}
// Due to some poor typing in the Stripe SDK, we need to manually type this.
export interface StripeSubscriptionWithPlan extends Stripe.Subscription {
    plan: ExpandedPlanWithProduct;
}

export const getSubscription = async (companyId: string) => {
    const { data, error } = await getCompanyCusId(companyId);
    const cusId = data?.cus_id;
    if (error) throw error;
    if (!cusId) throw new Error('No data');

    const subscriptions = await stripeClient.subscriptions.list({
        customer: cusId,
        status: 'active',
        expand: ['data.plan.product'],
    });
    let subscription = subscriptions.data[0] as StripeSubscriptionWithPlan | undefined;
    if (!subscription) {
        const trial = await stripeClient.subscriptions.list({
            customer: cusId,
            status: 'trialing',
            expand: ['data.plan.product'],
        });
        subscription = trial.data[0] as StripeSubscriptionWithPlan | undefined;
    }
    return subscription;
};

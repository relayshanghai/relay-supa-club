import { getCompanyCusId } from 'src/utils/api/db';
import { stripeClient } from 'src/utils/api/stripe/stripe-client';
import type Stripe from 'stripe';
import type { SubscriptionStatus } from 'types';

export interface ExpandedPlanWithProduct extends Stripe.Plan {
    product: Stripe.Product;
}
// Due to some poor typing in the Stripe SDK, we need to manually type this.
export interface StripeSubscriptionWithPlan extends Stripe.Subscription {
    plan: ExpandedPlanWithProduct;
}

/** gets the subscription regardless of whether it is an active or trial subscription */
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
    if (!subscription) {
        const paused = await stripeClient.subscriptions.list({
            customer: cusId,
            status: 'paused',
            expand: ['data.plan.product'],
        });
        subscription = paused.data[0] as StripeSubscriptionWithPlan | undefined;
    }
    return subscription;
};

//We had our own subscription status types, so we need to convert the stripe status to our own. Gradually, we should use Stripe's status types to cover all needed use cases.
export const transformStripeStatus = (stripeStatus: Stripe.Subscription.Status): SubscriptionStatus => {
    switch (stripeStatus) {
        case 'trialing':
            return 'trial';
        case 'active':
            return 'active';
        case 'canceled':
            return 'canceled';
        case 'paused':
            return 'paused';
        case 'incomplete':
        case 'incomplete_expired':
            return 'awaiting_payment_method';
        default:
            throw new Error(`Unhandled stripe status: ${stripeStatus}`);
    }
};

import { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { getCompanyCusId } from 'src/utils/api/db';
import { serverLogger } from 'src/utils/logger';

import { stripeClient } from 'src/utils/api/stripe/stripe-client';
import Stripe from 'stripe';

export type SubscriptionGetQueries = {
    /** company id */
    id: string;
};
export type SubscriptionGetResponse = {
    name: string;
    /** monthly, quarterly, yearly */
    interval: string;
    /** date in seconds */
    current_period_end: number;
};

interface ExpandedPlanWithProduct extends Stripe.Plan {
    product: Stripe.Product;
}
// Due to some poor typing in the Stripe SDK, we need to manually type this.
interface StripeSubscriptionWithPlan extends Stripe.Subscription {
    plan: ExpandedPlanWithProduct;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const { id: companyId } = req.query as SubscriptionGetQueries;
        try {
            if (!companyId || typeof companyId !== 'string') throw new Error('No company id');
            const { data, error } = await getCompanyCusId(companyId);
            const cusId = data?.cus_id;
            if (error) throw error;
            if (!cusId) throw new Error('No data');

            const subscriptions = await stripeClient.subscriptions.list({
                customer: cusId,
                status: 'active',
            });
            let subscription = subscriptions.data[0] as StripeSubscriptionWithPlan;
            if (!subscription) {
                const trial = await stripeClient.subscriptions.list({
                    customer: cusId,
                    status: 'trialing',
                    expand: ['data.plan.product'],
                });
                subscription = trial.data[0] as StripeSubscriptionWithPlan;
                if (!subscription)
                    return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({
                        error: 'No subscription data',
                    });
            }

            const returnData: SubscriptionGetResponse = {
                name: subscription.plan.product.name,
                interval:
                    subscription.plan.interval === 'month'
                        ? subscription.plan.interval_count === 3
                            ? 'quarterly'
                            : 'monthly'
                        : subscription.plan.interval,

                current_period_end: subscription.current_period_end,
            };

            return res.status(httpCodes.OK).json(returnData);
        } catch (error) {
            serverLogger(error, 'error');
            return res
                .status(httpCodes.INTERNAL_SERVER_ERROR)
                .json({ error: 'unable to get subscription' });
        }
    }

    return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
}

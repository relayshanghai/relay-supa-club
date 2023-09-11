import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { serverLogger } from 'src/utils/logger-server';

import type Stripe from 'stripe';
import type { SubscriptionPeriod } from 'types';
import { getSubscription } from 'src/utils/api/stripe/helpers';

export type SubscriptionGetQueries = {
    /** company id */
    id: string;
};
export type SubscriptionGetResponse = {
    name: string;
    interval: SubscriptionPeriod;
    /** date in seconds */
    current_period_end: number;
    current_period_start: number;
    status: Stripe.Subscription.Status;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const { id: companyId } = req.query as SubscriptionGetQueries;
        try {
            if (!companyId || typeof companyId !== 'string') throw new Error('No company id');

            const subscription = await getSubscription(companyId);
            if (!subscription)
                return res.status(httpCodes.NOT_FOUND).json({
                    error: 'No subscription data',
                });
            const intervalCount = subscription.plan.interval_count;
            if (intervalCount !== 1 && intervalCount !== 3) {
                throw new Error('Invalid interval count');
            }
            const interval =
                subscription.plan.interval === 'month'
                    ? intervalCount === 3
                        ? 'quarterly'
                        : 'monthly'
                    : subscription.plan.interval === 'year'
                    ? 'annually'
                    : null;
            if (!interval) {
                throw new Error('Invalid interval');
            }

            const returnData: SubscriptionGetResponse = {
                name: subscription.plan.product.name,
                interval,
                current_period_end: subscription.current_period_end,
                current_period_start: subscription.current_period_start,
                status: subscription.status,
            };

            return res.status(httpCodes.OK).json(returnData);
        } catch (error) {
            serverLogger(error);
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
        }
    }

    return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
}

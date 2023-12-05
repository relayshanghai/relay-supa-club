import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import type { SubscriptionPeriod, SubscriptionStatus } from 'types';
import { getSubscription, transformStripeStatus } from 'src/utils/api/stripe/helpers';
import { ApiHandler } from 'src/utils/api-handler';

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
    status: SubscriptionStatus;
};

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
    const { id: companyId } = req.query as SubscriptionGetQueries;
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
        status: transformStripeStatus(subscription.status),
    };

    return res.status(httpCodes.OK).json(returnData);
}

export default ApiHandler({
    getHandler,
});

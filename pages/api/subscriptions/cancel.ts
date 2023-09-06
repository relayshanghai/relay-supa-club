import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { updateCompanySubscriptionStatus } from 'src/utils/api/db';
import { getSubscription } from 'src/utils/api/stripe/helpers';
import { stripeClient } from 'src/utils/api/stripe/stripe-client';
import { isCompanyOwnerOrRelayEmployee } from 'src/utils/auth';
import { serverLogger } from 'src/utils/logger-server';
import { unixEpochToISOString } from 'src/utils/utils';
import type Stripe from 'stripe';

export type SubscriptionCancelPostBody = {
    company_id: string;
};
export type SubscriptionCancelPostResponse = Stripe.Response<Stripe.Subscription>;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { company_id } = req.body as SubscriptionCancelPostBody;
        if (!company_id) return res.status(httpCodes.BAD_REQUEST).json({ error: 'Missing company id' });

        if (!(await isCompanyOwnerOrRelayEmployee(req, res))) {
            return res.status(httpCodes.UNAUTHORIZED).json({ error: 'This action is limited to company admins' });
        }

        try {
            const activeSubscription = await getSubscription(company_id);
            if (!activeSubscription)
                return res.status(httpCodes.NOT_FOUND).json({
                    error: 'No active subscription to cancel',
                });

            const subscription: SubscriptionCancelPostResponse = await stripeClient.subscriptions.update(
                activeSubscription.id,
                {
                    cancel_at_period_end: true,
                },
            );

            await updateCompanySubscriptionStatus({
                subscription_status: 'canceled',
                id: company_id,
                subscription_end_date: unixEpochToISOString(subscription.current_period_end),
            });

            return res.status(httpCodes.OK).json(subscription);
        } catch (error) {
            serverLogger(error);
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
        }
    }

    return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
}

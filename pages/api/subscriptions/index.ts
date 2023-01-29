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
export type SubscriptionGetResponse = Stripe.Subscription;

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
            const subscription = subscriptions.data[0];
            if (!subscription) {
                const trial = await stripeClient.subscriptions.list({
                    customer: cusId,
                    status: 'trialing',
                });
                if (trial.data[0]) return res.status(httpCodes.OK).json(trial.data[0]);

                return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({
                    error: 'No subscription data',
                });
            }

            // data the frontend needs:
            // name of subscription plan,
            // payment interval.
            // current period end (renew date)
            // usage limits
            // if on trial

            // console.log({ subscription });

            return res.status(httpCodes.OK).json(subscription);
        } catch (error) {
            serverLogger(error, 'error');
            return res
                .status(httpCodes.INTERNAL_SERVER_ERROR)
                .json({ error: 'unable to get subscription' });
        }
    }

    return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
}

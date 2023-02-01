import { NextApiRequest, NextApiResponse } from 'next';
import { SECONDS_IN_MILLISECONDS } from 'src/constants/conversions';
import httpCodes from 'src/constants/httpCodes';
import { getCompanyCusId, updateCompanySubscriptionStatus } from 'src/utils/api/db';
import { stripeClient } from 'src/utils/api/stripe/stripe-client';
import { serverLogger } from 'src/utils/logger';
import Stripe from 'stripe';

export type SubscriptionCancelPostBody = {
    company_id: string;
};
export type SubscriptionCancelPostResponse = Stripe.Response<Stripe.Subscription>;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { company_id } = JSON.parse(req.body) as SubscriptionCancelPostBody;
        if (!company_id)
            return res.status(httpCodes.BAD_REQUEST).json({ error: 'Missing company id' });

        try {
            const { data: companyData } = await getCompanyCusId(company_id);
            const cusId = companyData?.cus_id;
            if (!companyData || !cusId) {
                serverLogger(new Error('Missing company data'), 'error');
                return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
            }

            const subscriptions = await stripeClient.subscriptions.list({
                customer: cusId,
                status: 'active',
            });
            let activeSubscription = subscriptions.data[0];

            if (!activeSubscription) {
                const trialSubscriptions = await stripeClient.subscriptions.list({
                    customer: cusId,
                    status: 'trialing',
                });
                activeSubscription = trialSubscriptions.data[0];
                if (!activeSubscription) {
                    return res
                        .status(httpCodes.NOT_FOUND)
                        .json({ error: 'No active subscription to cancel' });
                }
            }

            const subscription: SubscriptionCancelPostResponse =
                await stripeClient.subscriptions.update(activeSubscription.id, {
                    cancel_at_period_end: true,
                });

            await updateCompanySubscriptionStatus({
                subscription_status: 'canceled',
                id: company_id,
                subscription_end_date: new Date(
                    subscription.current_period_end * SECONDS_IN_MILLISECONDS,
                ).toISOString(),
            });

            return res.status(httpCodes.OK).json(subscription);
        } catch (error) {
            serverLogger(error, 'error');
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
        }
    }

    return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
}

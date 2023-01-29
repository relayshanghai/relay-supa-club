import { NextApiRequest, NextApiResponse } from 'next';
import { updateCompanySubscriptionStatus, updateCompanyUsageLimits } from 'src/utils/api/db';
import { stripeClient } from 'src/utils/api/stripe/stripe-client';
import { serverLogger } from 'src/utils/logger';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const sig = req.headers['stripe-signature'];
            if (!sig) return res.status(400).json(null);

            const body = req.body;
            // need to test in production if the webhook is actually called after trial ends.
            // console.dir({ stripeHook: body }, { depth: null });
            // stripe should send this when the trial period ends
            if (body.type === 'invoice.created') {
                // will this include the plan id?
                await updateCompanySubscriptionStatus({
                    subscription_status: 'active',
                    id: body.data.object.customer,
                });
            }

            if (body.type === 'customer.subscription.updated') {
                const plan = await stripeClient.products.retrieve(body.data.object.plan.product);
                await updateCompanyUsageLimits({
                    profiles_limit: plan.metadata.profiles,
                    searches_limit: plan.metadata.searches,
                    id: body.data.object.customer,
                });
                if (body.data.object.status !== 'trialing') {
                    await updateCompanySubscriptionStatus({
                        subscription_status: 'active',
                        id: body.data.object.customer,
                    });
                }

                return res.status(200).json({});
            }
        } catch (error) {
            serverLogger(error, 'error');
            return res.status(400).json({ error: 'error handling Stripe webhook' });
        }
    }

    return res.status(400).json(null);
}

import { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
// import { updateCompanySubscriptionStatus, updateCompanyUsageLimits } from 'src/utils/api/db';
// import { stripeClient } from 'src/utils/api/stripe/stripe-client';
import { serverLogger } from 'src/utils/logger';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const sig = req.headers['stripe-signature'];
            if (!sig) return res.status(httpCodes.BAD_REQUEST).json(null);

            const body = req.body;
            // TODO task V2-26o: test in production (Staging) if the webhook is actually called after trial ends.
            //eslint-disable-next-line no-console
            console.dir({ stripeHook: body }, { depth: null });
            // stripe should send this when the trial period ends
            // if (body.type === 'invoice.created') {
            //     // will this include the plan id?
            //     await updateCompanySubscriptionStatus({
            //         subscription_status: 'active',
            //         id: body.data.object.customer,
            //     });
            // }

            // if (body.type === 'customer.subscription.updated') {
            //     const plan = await stripeClient.products.retrieve(body.data.object.plan.product);
            //     await updateCompanyUsageLimits({
            //         profiles_limit: plan.metadata.profiles,
            //         searches_limit: plan.metadata.searches,
            //         id: body.data.object.customer,
            //     });
            //     if (body.data.object.status !== 'trialing') {
            //         await updateCompanySubscriptionStatus({
            //             subscription_status: 'active',
            //             id: body.data.object.customer,
            //         });
            //     }

            //     return res.status(httpCodes.OK).json({});
            // }
        } catch (error) {
            serverLogger(error, 'error');
            return res
                .status(httpCodes.INTERNAL_SERVER_ERROR)
                .json({ error: 'error handling Stripe webhook' });
        }
    }

    return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
}

import { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { getCompanyCusId } from 'src/utils/api/db';
import { serverLogger } from 'src/utils/logger';

import { stripeClient } from 'src/utils/api/stripe/stripe-client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const companyId = req.query.id;

        try {
            if (!companyId || typeof companyId !== 'string') throw new Error('No company id');
            const { data, error } = await getCompanyCusId(companyId);

            if (error) throw error;
            if (!data || !data.cus_id) throw new Error('No data');

            const subscriptions = await stripeClient.subscriptions.list({
                customer: data.cus_id,
                status: 'active',
            });
            // return res.json({}); // turn off this endpoint while in progress to clean up console errors
            const subscription = subscriptions.data[0];
            if (!subscription)
                return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({
                    error: 'No subscription data',
                });
            const product = await stripeClient.products.retrieve(
                // TODO: fix this, investigate what we are really getting/sending, and make custom type for frontend to receive.
                (subscription as any).plan.product
            );
            (subscription as any).product = product;

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

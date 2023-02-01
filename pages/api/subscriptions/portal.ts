import { NextApiRequest, NextApiResponse } from 'next';
import { APP_URL } from 'src/constants';
import httpCodes from 'src/constants/httpCodes';
import { stripeClient } from 'src/utils/api/stripe/stripe-client';
import { supabase } from 'src/utils/supabase-client';

export type SubscriptionPortalGetQueries = {
    id: string;
    returnUrl?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const { id, returnUrl } = req.query as SubscriptionPortalGetQueries;
        if (!id)
            return res.status(httpCodes.BAD_REQUEST).send({ message: 'No company id provided' });

        const { data: company, error } = await supabase
            .from('companies')
            .select('cus_id, name, id')
            .eq('id', id)
            .single();

        if (error || !company.cus_id) {
            return res
                .status(httpCodes.INTERNAL_SERVER_ERROR)
                .json({ error: 'Error finding company' });
        }

        const portal = await stripeClient.billingPortal.sessions.create({
            customer: company.cus_id,
            return_url: returnUrl ?? `${APP_URL}/account`,
        });
        return res.redirect(307, portal.url);
    }

    return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
}

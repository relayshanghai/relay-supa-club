import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import { stripeClient } from 'src/utils/api/stripe/stripe-client';
import { isCompanyOwnerOrRelayEmployee } from 'src/utils/auth';
import { getHostnameFromRequest } from 'src/utils/get-host';
import { supabase } from 'src/utils/supabase-client';

export type SubscriptionPortalGetQueries = {
    id: string;
    returnUrl?: string;
};

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
    const { appUrl } = getHostnameFromRequest(req);
    const { id, returnUrl } = req.query as SubscriptionPortalGetQueries;
    if (!id) return res.status(httpCodes.BAD_REQUEST).send({ message: 'No company id provided' });
    if (!(await isCompanyOwnerOrRelayEmployee(req, res))) {
        return res.status(httpCodes.UNAUTHORIZED).json({ error: 'This action is limited to company admins' });
    }
    const { data: company, error } = await supabase.from('companies').select('cus_id, name, id').eq('id', id).single();

    if (error || !company.cus_id) {
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error finding company' });
    }

    const portal = await stripeClient.billingPortal.sessions.create({
        customer: company.cus_id,
        return_url: returnUrl ?? `${appUrl}/account`,
    });
    return res.redirect(307, portal.url);
}

export default ApiHandler({
    getHandler,
});

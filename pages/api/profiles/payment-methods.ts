import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { getProfileByIdCall } from 'src/utils/api/db/calls/profiles';
import { getCustomerPaymentMethods } from 'src/utils/api/stripe/payment-method';
import { getSession } from 'src/utils/auth';
import { db } from 'src/utils/supabase-client';

export const getHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession(req, res);
    if (!session.data.session?.user.id) {
        throw new Error('Not logged in');
    }
    const { data: manager, error: getManagerError } = await db(getProfileByIdCall)(session.data.session.user.id);
    if (!manager?.company?.cus_id) {
        throw getManagerError;
    }
    const paymentMethods = await getCustomerPaymentMethods(manager.company?.cus_id);
    res.send(paymentMethods);
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        return getHandler(req, res);
    }
    return res.status(404).send('Not found');
}

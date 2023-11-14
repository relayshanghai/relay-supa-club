import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import { stripeClient } from 'src/utils/api/stripe/stripe-client';
import { supabase } from 'src/utils/supabase-client';
import type Stripe from 'stripe';

export type PaymentMethodGetQueries = {
    /** company id */
    id: string;
};

export type PaymentMethodGetResponse = Stripe.PaymentMethod[];

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query as PaymentMethodGetQueries;

    const { data, error } = await supabase.from('companies').select('cus_id, name').eq('id', id).single();

    if (error) {
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json(error);
    }
    if (!data || !data.cus_id) {
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({
            error: 'No payment method data',
        });
    }

    const result = await stripeClient.customers.listPaymentMethods(data.cus_id);

    return res.status(httpCodes.OK).json(result.data);
}

export default ApiHandler({
    getHandler,
});

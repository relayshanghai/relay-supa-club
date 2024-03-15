import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { ApiHandler } from 'src/utils/api-handler';
import { stripeClient } from 'src/utils/api/stripe/stripe-client';
import { supabase } from 'src/utils/supabase-client';
import type Stripe from 'stripe';
import SubscriptionV2Service from 'src/backend/domain/subscription/subscription-v2-service';
import { z } from 'zod';

export type PaymentMethodGetQueries = {
    /** company id */
    id: string;
};

export type PaymentMethodGetResponse = {
    paymentMethods: Stripe.PaymentMethod[];
    defaultPaymentMethod: string | null | Stripe.PaymentMethod;
    defaultInvoiceEmail: string;
};

export const PutBodySchema = z.object({
    companyId: z.string(),
    paymentMethodId: z.string(),
});

export const DeleteBodySchema = z.object({
    paymentMethodId: z.string(),
});

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
    const defaultPaymentMethod = await SubscriptionV2Service.getService().getDefaultPaymentMethod(data.cus_id);
    const defaultInvoiceEmail = await SubscriptionV2Service.getService().getDefaultInvoiceEmail(data.cus_id);

    return res.status(httpCodes.OK).json({ paymentMethods: result.data, defaultPaymentMethod, defaultInvoiceEmail });
}

async function putHandler(req: NextApiRequest, res: NextApiResponse) {
    const body = PutBodySchema.safeParse(req.body);
    if (!body.success) {
        return res.status(httpCodes.BAD_REQUEST).json({ error: 'Invalid request body' });
    }
    const { companyId, paymentMethodId } = body.data;

    const { data, error } = await supabase.from('companies').select('cus_id, name').eq('id', companyId).single();
    if (error) {
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json(error);
    }
    if (!data || !data.cus_id) {
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({
            error: 'No payment method data',
        });
    }

    try {
        await SubscriptionV2Service.getService().setDefaultPaymentMethod(data.cus_id, paymentMethodId);
    } catch (error) {
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json(error);
    }

    return res.status(httpCodes.OK).json({ message: 'Default payment method updated successfully' });
}

async function deleteHandler(req: NextApiRequest, res: NextApiResponse) {
    const body = DeleteBodySchema.safeParse(req.body);
    if (!body.success) {
        return res.status(httpCodes.BAD_REQUEST).json({ error: 'Invalid request body' });
    }
    const { paymentMethodId } = body.data;
    try {
        await SubscriptionV2Service.getService().removePaymentMethod(paymentMethodId);
    } catch (error) {
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json(error);
    }
    return res.status(httpCodes.OK).json({ message: 'Payment method deleted successfully' });
}

export default ApiHandler({
    getHandler,
    putHandler,
    deleteHandler,
});

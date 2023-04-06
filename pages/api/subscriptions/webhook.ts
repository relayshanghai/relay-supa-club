import httpCodes from 'src/constants/httpCodes';

import { STRIPE_PRODUCT_ID_VIP } from 'src/utils/api/stripe/constants';
import { serverLogger } from 'src/utils/logger-server';

import type { NextApiRequest, NextApiResponse } from 'next';
import type { CustomerSubscriptionCreated } from 'types';
import type { InvoicePaymentFailed } from 'types/stripe/invoice-payment-failed-webhook';
import { handleVIPSubscription } from 'src/utils/api/stripe/handle-vip-webhook';
import { handleInvoicePaymentFailed } from 'src/utils/api/stripe/handle-payment-failed-webhook';
import { supabaseLogger } from 'src/utils/api/db';

const handledWebhooks = {
    customerSubscriptionCreated: 'customer.subscription.created',
    invoicePaymentFailed: 'invoice.payment_failed',
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const sig = req.headers['stripe-signature'];
            if (!sig) {
                supabaseLogger({ type: 'stripe-webhook', message: 'no signature' });
                return res.status(httpCodes.BAD_REQUEST).json({});
            }
            const ourSig = process.env.STRIPE_SIGNING_SECRET;
            if (!ourSig) {
                supabaseLogger({ type: 'stripe-webhook', message: 'no signing secret' });
                return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
            }
            if (sig !== ourSig) {
                supabaseLogger({ type: 'stripe-webhook', message: 'signatures do not match' });
                return res.status(httpCodes.FORBIDDEN).json({});
            }

            // TODO task V2-26o: test in production (Staging) if the webhook is actually called after trial ends.

            const body = req.body;
            if (!body || !body.type) {
                supabaseLogger({
                    type: 'stripe-webhook',
                    message: 'no body or body.type',
                    data: body,
                });

                return res.status(httpCodes.BAD_REQUEST).json({});
            }
            supabaseLogger({ type: 'stripe-webhook', message: body.type, data: body });

            if (!Object.values(handledWebhooks).includes(body.type)) {
                return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
            }

            if (body.type === handledWebhooks.customerSubscriptionCreated) {
                const invoiceBody = body as CustomerSubscriptionCreated;
                const price = invoiceBody.data.object.items.data[0].price;
                const productID = price.product;
                if (productID === STRIPE_PRODUCT_ID_VIP) {
                    return handleVIPSubscription(res, invoiceBody);
                } else {
                    return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
                }
            }
            if (body.type === handledWebhooks.invoicePaymentFailed) {
                const invoiceBody = body as InvoicePaymentFailed;
                return handleInvoicePaymentFailed(res, invoiceBody);
            }
        } catch (error: any) {
            serverLogger(error, 'error');
            supabaseLogger({
                type: 'stripe-webhook',
                message: error.message ?? 'error',
                data: JSON.parse(JSON.stringify(error)),
            });
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
        }
    }

    return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
}

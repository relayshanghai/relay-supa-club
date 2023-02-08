import httpCodes from 'src/constants/httpCodes';

import { STRIPE_PRODUCT_ID_VIP } from 'src/utils/api/stripe/constants';
import { serverLogger } from 'src/utils/logger';

import type { NextApiRequest, NextApiResponse } from 'next';
import type { CustomerSubscriptionCreated } from 'types';
import { InvoicePaymentFailed } from 'types/stripe/invoice-payment-failed-webhook';
import { handleVIPSubscription } from 'src/utils/api/stripe/handle-vip-webhook';
import { handleInvoicePaymentFailed } from 'src/utils/api/stripe/handle-payment-failed-webhook';

const handledWebhooks = {
    customerSubscriptionCreated: 'customer.subscription.created',
    invoicePaymentFailed: 'invoice.payment_failed',
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const sig = req.headers['stripe-signature'];
            if (!sig) {
                return res.status(httpCodes.BAD_REQUEST).json({});
            }

            // TODO task V2-26o: test in production (Staging) if the webhook is actually called after trial ends.

            const body = req.body;
            if (!body || !body.type) {
                return res.status(httpCodes.BAD_REQUEST).json({});
            }
            if (!Object.values(handledWebhooks).includes(body.type)) {
                return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
            }

            if (body.type === handledWebhooks.customerSubscriptionCreated) {
                const invoiceBody = body as CustomerSubscriptionCreated;
                const price = invoiceBody.data.object.items.data[0].price;
                const productID = price.product;
                if (productID === STRIPE_PRODUCT_ID_VIP) {
                    handleVIPSubscription(req, res, invoiceBody);
                } else {
                    return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
                }
            }
            if (body.type === handledWebhooks.invoicePaymentFailed) {
                const invoiceBody = body as InvoicePaymentFailed;
                return handleInvoicePaymentFailed(req, res, invoiceBody);
            }
        } catch (error) {
            serverLogger(error, 'error');
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
        }
    }

    return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
}

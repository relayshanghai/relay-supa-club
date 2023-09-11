import httpCodes from 'src/constants/httpCodes';

import { STRIPE_PRODUCT_ID_VIP } from 'src/utils/api/stripe/constants';
import { serverLogger } from 'src/utils/logger-server';

import type { NextApiRequest, NextApiResponse } from 'next';
import type { CustomerSubscriptionCreated } from 'types';
import type { InvoicePaymentFailed } from 'types/stripe/invoice-payment-failed-webhook';
import { handleVIPSubscription } from 'src/utils/api/stripe/handle-vip-webhook';
import { handleInvoicePaymentFailed } from 'src/utils/api/stripe/handle-payment-failed-webhook';
import { supabaseLogger } from 'src/utils/api/db';
import { stripeClient } from 'src/utils/api/stripe/stripe-client';
import type Stripe from 'stripe';

const handledWebhooks = {
    customerSubscriptionCreated: 'customer.subscription.created',
    invoicePaymentFailed: 'invoice.payment_failed',
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const theirSig = req.headers['stripe-signature'];
            if (!theirSig) {
                await supabaseLogger({ type: 'stripe-webhook', message: 'no signature' });
                return res.status(httpCodes.BAD_REQUEST).json({ message: 'no signature' });
            }
            const ourSig = process.env.STRIPE_SIGNING_SECRET;
            if (!ourSig) {
                await supabaseLogger({ type: 'stripe-webhook', message: 'no signing secret' });
                return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ message: 'no signing secret' });
            }
            let event: Stripe.Event;

            try {
                const body = await buffer(req);
                event = stripeClient.webhooks.constructEvent(body, theirSig, ourSig);
            } catch (error: any) {
                await supabaseLogger({
                    type: 'stripe-webhook',
                    message: 'signatures do not match',
                    data: { theirSig, ourSig, error },
                });
                return res.status(httpCodes.FORBIDDEN).json({ message: 'signatures do not match' });
            }

            // TODO task V2-26o: test in production (Staging) if the webhook is actually called after trial ends.

            if (!event || !event.type) {
                await supabaseLogger({
                    type: 'stripe-webhook',
                    message: 'no body or body.type',
                    data: event as any,
                });

                return res.status(httpCodes.BAD_REQUEST).json({ message: 'no body or body.type' });
            }
            await supabaseLogger({ type: 'stripe-webhook', message: event.type, data: event as any });

            if (!Object.values(handledWebhooks).includes(event.type)) {
                return res.status(httpCodes.METHOD_NOT_ALLOWED).json({
                    message: 'body.type not in handledWebhooks. handledWebhooks: ' + JSON.stringify(handledWebhooks),
                });
            }

            if (event.type === handledWebhooks.customerSubscriptionCreated) {
                const invoiceBody = event as CustomerSubscriptionCreated;
                const price = invoiceBody.data.object.items.data[0].price;
                const productID = price.product;
                if (productID === STRIPE_PRODUCT_ID_VIP) {
                    return handleVIPSubscription(res, invoiceBody);
                } else {
                    await supabaseLogger({
                        type: 'stripe-webhook',
                        message: 'productID does not match handled projectIDs: STRIPE_PRODUCT_ID_VIP',
                        data: { productID, STRIPE_PRODUCT_ID_VIP },
                    });
                    return res
                        .status(httpCodes.NO_CONTENT)
                        .json({ message: 'productID does not match handled projectIDs: STRIPE_PRODUCT_ID_VIP' });
                }
            }
            if (event.type === handledWebhooks.invoicePaymentFailed) {
                const invoiceBody = event as InvoicePaymentFailed;
                return handleInvoicePaymentFailed(res, invoiceBody);
            }
        } catch (error: any) {
            serverLogger(error);
            await supabaseLogger({
                type: 'stripe-webhook',
                message: error.message ?? 'error',
                data: JSON.parse(JSON.stringify(error)),
            });
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ message: 'caught error. check supabase logs' });
        }
    }

    return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
}

export const config = {
    api: {
        bodyParser: false,
    },
};

/** from https://github.com/stripe/stripe-node/blob/master/examples/webhook-signing/nextjs/pages/api/webhooks.ts */
const buffer = (req: NextApiRequest) => {
    return new Promise<Buffer>((resolve, reject) => {
        const chunks: Buffer[] = [];

        req.on('data', (chunk: Buffer) => {
            chunks.push(chunk);
        });

        req.on('end', () => {
            resolve(Buffer.concat(chunks));
        });

        req.on('error', reject);
    });
};

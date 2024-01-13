import httpCodes from 'src/constants/httpCodes';
import { STRIPE_PRODUCT_ID_VIP } from 'src/utils/api/stripe/constants';
import { serverLogger } from 'src/utils/logger-server';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { CustomerSubscriptionCreated } from 'types';
import type { InvoicePaymentFailed } from 'types/stripe/invoice-payment-failed-webhook';
import { handleVIPSubscription } from 'src/utils/api/stripe/handle-vip-webhook';
import { handleInvoicePaymentFailed } from 'src/utils/api/stripe/handle-payment-failed-webhook';
import { getCompanyByCusId } from 'src/utils/api/db';
import { stripeClient } from 'src/utils/api/stripe/stripe-client';
import type Stripe from 'stripe';
import type { StripeWebhookIncomingPayload } from 'src/utils/analytics/events/stripe/stripe-webhook-incoming';
import { StripeWebhookIncoming } from 'src/utils/analytics/events/stripe/stripe-webhook-incoming';
import { getFirstUserByCompanyIdCall } from 'src/utils/api/db/calls/profiles';
import { db } from 'src/utils/supabase-client';
import { rudderstack, track } from 'src/utils/rudderstack/rudderstack';
import { StripeWebhookError } from 'src/utils/analytics/events/stripe/stripe-webhook-error';
import type { SetupIntentSucceeded } from 'types/stripe/setup-intent-succeeded-webhook';
import { handleSetupIntentSucceeded } from 'src/utils/api/stripe/handle-setup-intent-succeeded-webhook';
import type { InvoicePaymentSucceeded } from 'types/stripe/invoice-payment-succeeded-webhook';
import { handleInvoicePaymentSucceeded } from 'src/utils/api/stripe/handle-invoice-payment-succeeded';
import type { SetupIntentFailed } from 'types/stripe/setup-intent-failed-webhook';
import { handleSetupIntentFailed } from 'src/utils/api/stripe/handle-setup-intent-failed-webhook';
import type { CustomerSubscriptionPaused } from 'types/stripe/customer-subscription-paused-webhook';
import { handleCustomerSubscriptionPaused } from 'src/utils/api/stripe/handle-customer-subscription-paused';
import { ApiHandler } from 'src/utils/api-handler';

const handledWebhooks = {
    customerSubscriptionCreated: 'customer.subscription.created',
    invoicePaymentFailed: 'invoice.payment_failed',
    invoicePaymentSucceeded: 'invoice.payment_succeeded',
    setupIntentSucceeded: 'setup_intent.succeeded',
    setupIntentFailed: 'setup_intent.setup_failed',
    customerSubscriptionPaused: 'customer.subscription.paused',
};

export type HandledEvent =
    | CustomerSubscriptionCreated
    | InvoicePaymentFailed
    | InvoicePaymentSucceeded
    | SetupIntentSucceeded
    | SetupIntentFailed
    | CustomerSubscriptionPaused;

const identifyWebhook = async (
    event:
        | CustomerSubscriptionCreated
        | InvoicePaymentFailed
        | InvoicePaymentSucceeded
        | SetupIntentSucceeded
        | SetupIntentFailed
        | CustomerSubscriptionPaused,
) => {
    const customerId = event.data?.object?.customer;
    if (!customerId) {
        throw new Error('Missing customer ID in invoice body');
    }
    const { data: company, error: companyError } = await getCompanyByCusId(customerId);
    if (companyError || !company?.id) {
        throw new Error(companyError?.message || 'Unable to find company by customer ID');
    }
    const profile = await db(getFirstUserByCompanyIdCall)(company.id);

    if (!profile) {
        throw new Error('Unable to find profile by company ID');
    }
    rudderstack.identifyWithProfile(profile.id);
};

const handleStripeWebhook = async (event: HandledEvent, res: NextApiResponse) => {
    switch (event.type) {
        case handledWebhooks.setupIntentFailed:
            return await handleSetupIntentFailed(res, event as SetupIntentFailed);
        case handledWebhooks.setupIntentSucceeded:
            return await handleSetupIntentSucceeded(res, event as SetupIntentSucceeded);
        case handledWebhooks.invoicePaymentSucceeded:
            return await handleInvoicePaymentSucceeded(res, event as InvoicePaymentSucceeded);
        case handledWebhooks.customerSubscriptionCreated:
            const price = (event as CustomerSubscriptionCreated).data.object.items.data[0].price;
            const productID = price.product;
            if (productID === STRIPE_PRODUCT_ID_VIP) {
                return await handleVIPSubscription(res, event as CustomerSubscriptionCreated);
            }
        case handledWebhooks.invoicePaymentFailed:
            return await handleInvoicePaymentFailed(res, event as InvoicePaymentFailed);
        case handledWebhooks.customerSubscriptionPaused:
            return await handleCustomerSubscriptionPaused(res, event as CustomerSubscriptionPaused);
        default:
            throw new Error('Unhandled event type');
    }
};

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
    let trackData: StripeWebhookIncomingPayload = {
        type: 'unknown',
        extra_info: { event: null, error: null },
    };
    try {
        const theirSig = req.headers['stripe-signature'];
        if (!theirSig) {
            serverLogger('stripe no signature', { level: 'error' });
            return res.status(httpCodes.BAD_REQUEST).json({ message: 'no signature' });
        }
        const ourSig = process.env.STRIPE_SIGNING_SECRET;
        if (!ourSig) {
            serverLogger('stripe no signing secret', { level: 'error' });
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ message: 'no signing secret' });
        }
        let event: Stripe.Event;

        try {
            const body = await buffer(req);
            event = stripeClient.webhooks.constructEvent(body, theirSig, ourSig);
        } catch (error: any) {
            serverLogger('stripe signatures do not match', { level: 'error' });
            return res.status(httpCodes.FORBIDDEN).json({ message: 'signatures do not match' });
        }
        // TODO task V2-26o: test in production (Staging) if the webhook is actually called after trial ends.
        if (!event || !event.type) {
            serverLogger('stripe no event or event type', { level: 'error' });
            return res.status(httpCodes.BAD_REQUEST).json({ message: 'no body or body.type' });
        }

        if (!Object.values(handledWebhooks).includes(event.type)) {
            serverLogger('stripe unhandled event type', { level: 'error' });
            return res.status(httpCodes.METHOD_NOT_ALLOWED).json({
                message: 'body.type not in handledWebhooks. handledWebhooks: ' + JSON.stringify(handledWebhooks),
            });
        }

        await identifyWebhook(event as HandledEvent);

        trackData = {
            type: event.type,
            extra_info: { event },
        };

        track(rudderstack.getClient(), rudderstack.getIdentity())(StripeWebhookIncoming, trackData);
        return await handleStripeWebhook(event as HandledEvent, res);
    } catch (error: any) {
        serverLogger('stripe caught error', (scope) => {
            return scope.setContext('Stripe Error', { stack: error.stack, error: error.message });
        });
        try {
            trackData.extra_info.error = error;
            track(rudderstack.getClient(), rudderstack.getIdentity())(StripeWebhookError, trackData);
        } catch (error) {
            serverLogger('stripe endpoint rudderstack log error. Likely a problem with identify', { level: 'error' });
        }
        return res.status(httpCodes.NO_CONTENT).json({ message: 'caught error. check rudderstack or Sentry logs' });
    }
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

export default ApiHandler({
    postHandler,
});

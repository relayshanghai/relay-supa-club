import type { EventPayload, TriggerEvent } from '../../types';

export const STRIPE_WEBHOOK_INCOMING = 'Stripe Webhook Incoming';

export type StripeWebhookIncomingPayload = EventPayload<{
    type: string;

    extra_info?: any;
}>;

export const StripeWebhookIncoming = (
    trigger: TriggerEvent<StripeWebhookIncomingPayload>,
    payload?: StripeWebhookIncomingPayload,
) => trigger(STRIPE_WEBHOOK_INCOMING, payload);

// @note we cast the eventName to a string literal since we are going to reference it back from TriggerEvent callbacks
StripeWebhookIncoming.eventName = <typeof STRIPE_WEBHOOK_INCOMING>STRIPE_WEBHOOK_INCOMING;

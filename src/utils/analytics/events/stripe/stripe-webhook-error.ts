import type { EventPayload, TriggerEvent } from '../../types';

export const STRIPE_WEBHOOK_ERROR = 'Stripe Webhook Error';

export type StripeWebhookErrorPayload = EventPayload<{
    type: string;
    extra_info?: any;
}>;

export const StripeWebhookError = (
    trigger: TriggerEvent<StripeWebhookErrorPayload>,
    payload?: StripeWebhookErrorPayload,
) => trigger(STRIPE_WEBHOOK_ERROR, payload);

// @note we cast the eventName to a string literal since we are going to reference it back from TriggerEvent callbacks
StripeWebhookError.eventName = <typeof STRIPE_WEBHOOK_ERROR>STRIPE_WEBHOOK_ERROR;

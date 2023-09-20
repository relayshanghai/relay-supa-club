import type { EventPayload, TriggerEvent } from '../../types';

export const STRIPE_WEBHOOK_PAYMENT_FAILED = 'Stripe Webhook Payment Failed';

export type StripeWebhookPaymentFailedPayload = EventPayload<{
    type: string;
    extra_info?: any;
    is_success?: boolean;
}>;

export const StripeWebhookPaymentFailed = (
    trigger: TriggerEvent<StripeWebhookPaymentFailedPayload>,
    payload?: StripeWebhookPaymentFailedPayload,
) => trigger(STRIPE_WEBHOOK_PAYMENT_FAILED, payload);

// @note we cast the eventName to a string literal since we are going to reference it back from TriggerEvent callbacks
StripeWebhookPaymentFailed.eventName = <typeof STRIPE_WEBHOOK_PAYMENT_FAILED>STRIPE_WEBHOOK_PAYMENT_FAILED;

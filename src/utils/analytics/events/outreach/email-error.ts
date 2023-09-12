import type { WebhookEvent } from 'pages/api/email-engine/webhook';
import type { EventPayload, TriggerEvent } from '../../types';

export const OUTREACH_EMAIL_ERROR = 'outreach-webhook_error';

export type WebhookErrorPayload = EventPayload<{
    body: WebhookEvent;
    error: any;
}>;

/** the catchall email webhook error handler */
export const WebhookError = (trigger: TriggerEvent<WebhookErrorPayload>, payload?: WebhookErrorPayload) =>
    trigger(OUTREACH_EMAIL_ERROR, payload);

WebhookError.eventName = <typeof OUTREACH_EMAIL_ERROR>OUTREACH_EMAIL_ERROR;

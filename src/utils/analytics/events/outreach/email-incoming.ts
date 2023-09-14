import type { WebhookEvent } from 'pages/api/email-engine/webhook';
import type { EventPayload, TriggerEvent } from '../../types';

export const OUTREACH_EMAIL_INCOMING = 'outreach-email_incoming_webhook';

export type IncomingWebhookPayload = EventPayload<WebhookEvent>;

/** The catchall incoming Email Engine webhook events handler */
export const IncomingWebhook = (trigger: TriggerEvent<IncomingWebhookPayload>, payload?: IncomingWebhookPayload) =>
    trigger(OUTREACH_EMAIL_INCOMING, payload);

IncomingWebhook.eventName = <typeof OUTREACH_EMAIL_INCOMING>OUTREACH_EMAIL_INCOMING;

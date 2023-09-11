import type { EventPayload, TriggerEvent } from '../../types';

export const OUTREACH_EMAIL_SENT = 'outreach-email_sent';

export type EmailSentPayload = EventPayload<{
    account_id: string;
    influencer_id: string | null;
    sequence_id: string | null;
    // @note sequence_step seems to mean the number of times outreach is retried
    sequence_step: number | null;
    sequence_influencer_id: string | null;
    sequence_email_id: string | null;
    is_success: boolean;
    extra_info?: any;
}>;

export const EmailSent = (trigger: TriggerEvent<EmailSentPayload>, payload?: EmailSentPayload) =>
    trigger(OUTREACH_EMAIL_SENT, payload);

// @note we cast the eventName to a string literal since we are going to reference it back from TriggerEvent callbacks
EmailSent.eventName = <typeof OUTREACH_EMAIL_SENT>OUTREACH_EMAIL_SENT;

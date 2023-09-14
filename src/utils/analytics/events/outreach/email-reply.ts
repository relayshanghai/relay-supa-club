import type { EventPayload, TriggerEvent } from '../../types';

export const OUTREACH_EMAIL_REPLY = 'outreach-email_reply';

export type EmailReplyPayload = EventPayload<{
    account_id: string;
    sequence_influencer_id: string;
    sequence_emails_pre_delete: string[];
    sequence_emails_after_delete: string[];
    email_updates: string[];
    scheduled_emails: string[];
    deleted_emails: string[];
    is_success: boolean;
    extra_info?: any;
}>;

export const EmailReply = (trigger: TriggerEvent<EmailReplyPayload>, payload?: EmailReplyPayload) =>
    trigger(OUTREACH_EMAIL_REPLY, payload);

// @note we cast the eventName to a string literal since we are going to reference it back from TriggerEvent callbacks
EmailReply.eventName = <typeof OUTREACH_EMAIL_REPLY>OUTREACH_EMAIL_REPLY;

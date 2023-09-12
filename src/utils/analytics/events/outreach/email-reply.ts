import type { SequenceEmail, SequenceEmailUpdate, SequenceInfluencer } from 'src/utils/api/db';
import type { EventPayload, TriggerEvent } from '../../types';
import type { OutboxGetMessage } from 'types/email-engine/outbox-get';

export const OUTREACH_EMAIL_REPLY = 'outreach-email_reply';

export type EmailReplyPayload = EventPayload<{
    account_id: string;
    sequence_influencer: SequenceInfluencer;
    sequenceEmailsPreDelete: SequenceEmail[];
    sequenceEmailsAfterDelete: SequenceEmail[];
    emailUpdates: SequenceEmailUpdate[];
    scheduledEmails: OutboxGetMessage[];
    deletedEmails: OutboxGetMessage[];
    is_success: boolean;
    extra_info?: any;
}>;

export const EmailReply = (trigger: TriggerEvent<EmailReplyPayload>, payload?: EmailReplyPayload) =>
    trigger(OUTREACH_EMAIL_REPLY, payload);

// @note we cast the eventName to a string literal since we are going to reference it back from TriggerEvent callbacks
EmailReply.eventName = <typeof OUTREACH_EMAIL_REPLY>OUTREACH_EMAIL_REPLY;

import type { TriggerEvent } from '../types';

export const SEND_EMAIL_REPLY = 'Send Email Reply';

export type SendEmailReplyPayload = {
    sequence_email_address: string;
    email_thread_id: string;
    attachment: boolean;
    attachment_types: string[];
    cc: boolean;
    cc_emails: string[];
};

export const SendEmailReply = (trigger: TriggerEvent, value?: SendEmailReplyPayload) =>
    trigger(SEND_EMAIL_REPLY, { ...value });

SendEmailReply.eventName = <typeof SEND_EMAIL_REPLY>SEND_EMAIL_REPLY;

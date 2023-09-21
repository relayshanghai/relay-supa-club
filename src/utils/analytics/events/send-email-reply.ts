import type { TriggerEvent } from '../types';

export const SEND_EMAIL_REPLY = 'Send Email Reply';

export type SendEmailReplyPayload = {
    sequenceEmailAddress: string;
    emailThreadId: string;
    attachment: boolean;
    attachmentTypes: string[];
    cc: boolean;
    ccEmails: string[];
};

export const SendEmailReply = (trigger: TriggerEvent, value?: SendEmailReplyPayload) =>
    trigger(SEND_EMAIL_REPLY, { ...value });

SendEmailReply.eventName = <typeof SEND_EMAIL_REPLY>SEND_EMAIL_REPLY;

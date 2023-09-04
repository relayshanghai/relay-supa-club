import type { EventPayload, TriggerEvent } from '../../types';

export const OUTREACH_EMAIL_COMPLAINT = 'outreach-email_complaint';

export type EmailComplaintPayload = EventPayload<{
    extra_info?: any;
}>;

export const EmailComplaint = (trigger: TriggerEvent<EmailComplaintPayload>, payload?: EmailComplaintPayload) =>
    trigger(OUTREACH_EMAIL_COMPLAINT, payload);

EmailComplaint.eventName = <typeof OUTREACH_EMAIL_COMPLAINT>OUTREACH_EMAIL_COMPLAINT;

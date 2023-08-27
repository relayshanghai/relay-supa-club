import type { EventPayload, TriggerEvent } from '../../types';

export const OUTREACH_EMAIL_FAILED = 'TEST:outreach-EMAIL_FAILED';

export type EmailFailedPayload = EventPayload<{
    account_id: string
    sequence_email_id: string | null
    extra_info?: any
}>;

export const EmailFailed = (trigger: TriggerEvent<EmailFailedPayload>, payload?: EmailFailedPayload) =>
    trigger(OUTREACH_EMAIL_FAILED, payload);

EmailFailed.eventName = <typeof OUTREACH_EMAIL_FAILED>OUTREACH_EMAIL_FAILED;

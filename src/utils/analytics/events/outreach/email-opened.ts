import type { EventPayload, TriggerEvent } from '../../types';

export const OUTREACH_EMAIL_OPENED = 'outreach-email_opened';

export type EmailOpenedPayload = EventPayload<{
    account_id: string;
    sequence_email_id: string | null;
    extra_info?: any;
    is_success: boolean;
}>;

export const EmailOpened = (trigger: TriggerEvent<EmailOpenedPayload>, payload?: EmailOpenedPayload) =>
    trigger(OUTREACH_EMAIL_OPENED, payload);

EmailOpened.eventName = <typeof OUTREACH_EMAIL_OPENED>OUTREACH_EMAIL_OPENED;

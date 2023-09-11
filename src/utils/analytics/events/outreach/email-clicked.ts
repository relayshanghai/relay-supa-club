import type { EventPayload, TriggerEvent } from '../../types';

export const OUTREACH_EMAIL_CLICKED = 'outreach-email_clicked';

export type EmailClickedPayload = EventPayload<{
    account_id: string;
    sequence_email_id: string | null;
    extra_info?: any;
}>;

export const EmailClicked = (trigger: TriggerEvent<EmailClickedPayload>, payload?: EmailClickedPayload) =>
    trigger(OUTREACH_EMAIL_CLICKED, payload);

EmailClicked.eventName = <typeof OUTREACH_EMAIL_CLICKED>OUTREACH_EMAIL_CLICKED;

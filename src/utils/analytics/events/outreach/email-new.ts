import type { EventPayload, TriggerEvent } from '../../types';

export const OUTREACH_EMAIL_NEW = 'outreach-email_new';

export type EmailNewPayload = EventPayload<{
    account_id: string;
    profile_id: string | null;
    is_success: boolean;
    extra_info?: any;
}>;

/** Gets called with success if it is just handling a new email that isn't a reply. gets called with failure if it receives an email for an address we don't have an account for */
export const EmailNew = (trigger: TriggerEvent<EmailNewPayload>, payload?: EmailNewPayload) =>
    trigger(OUTREACH_EMAIL_NEW, payload);

// @note we cast the eventName to a string literal since we are going to reference it back from TriggerEvent callbacks
EmailNew.eventName = <typeof OUTREACH_EMAIL_NEW>OUTREACH_EMAIL_NEW;

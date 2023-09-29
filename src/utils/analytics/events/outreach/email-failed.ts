import type { EventPayload, TriggerEvent } from '../../types';

export const OUTREACH_EMAIL_FAILED = 'outreach-email_failed';

export type EmailFailedPayload = EventPayload<{
    account_id: string;
    sequence_email_id: string | null;
    // Error types:
    //  - quit: https://emailengine.app/webhooks#messagefailed
    //  - failed: https://emailengine.app/webhooks#messageDeliveryError
    //  - bounced: https://emailengine.app/webhooks#messageBounce
    error_type: 'quit' | 'bounced' | 'failed';
    extra_info?: any;
    sequence_influencer_id?: string | null;
    sequence_emails_pre_delete?: string[];
    sequence_emails_after_delete?: string[];
    scheduled_emails?: string[];
    deleted_emails?: string[];
    email_updates?: string[];
    is_success?: boolean;
}>;

export const EmailFailed = (trigger: TriggerEvent<EmailFailedPayload>, payload?: EmailFailedPayload) =>
    trigger(OUTREACH_EMAIL_FAILED, payload);

EmailFailed.eventName = <typeof OUTREACH_EMAIL_FAILED>OUTREACH_EMAIL_FAILED;

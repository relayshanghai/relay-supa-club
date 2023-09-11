import type { EventPayload, TriggerEvent } from '../../types';

export const OUTREACH_OPEN_INBOX_PAGE = 'outreach-open_inbox_page';

export type OpenInboxPagePayload = EventPayload<{
    extra_info?: any;
}>;

export const OpenInboxPage = (trigger: TriggerEvent<OpenInboxPagePayload>, payload?: OpenInboxPagePayload) =>
    trigger(OUTREACH_OPEN_INBOX_PAGE, payload);

// @note we cast the eventName to a string literal since we are going to reference it back from TriggerEvent callbacks
OpenInboxPage.eventName = <typeof OUTREACH_OPEN_INBOX_PAGE>OUTREACH_OPEN_INBOX_PAGE;

import type { EventPayload, TriggerEvent } from '../../types';

export const SEARCH_INBOX = 'Search Inbox';

export type SearchInboxPayload = EventPayload<{
    sequence_email_address: string;
    search_query: string;
    total_results: number;
}>;

export const SearchInbox = (trigger: TriggerEvent, value?: SearchInboxPayload) => trigger(SEARCH_INBOX, value);

export type SearchInbox = typeof SearchInbox;

SearchInbox.eventName = <typeof SEARCH_INBOX>SEARCH_INBOX;

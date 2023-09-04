import type { EventPayload, TriggerEvent } from '../../types';

export const OUTREACH_OPEN_SEQUENCES_PAGE = 'outreach-open_sequences_page';

export type OpenSequencesPagePayload = EventPayload<{
    extra_info?: any;
}>;

export const OpenSequencesPage = (
    trigger: TriggerEvent<OpenSequencesPagePayload>,
    payload?: OpenSequencesPagePayload,
) => trigger(OUTREACH_OPEN_SEQUENCES_PAGE, payload);

// @note we cast the eventName to a string literal since we are going to reference it back from TriggerEvent callbacks
OpenSequencesPage.eventName = <typeof OUTREACH_OPEN_SEQUENCES_PAGE>OUTREACH_OPEN_SEQUENCES_PAGE;

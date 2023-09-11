import type { EventPayload, TriggerEvent } from '../../types';

export const OUTREACH_OPEN_INFLUENCER_MANAGER_PAGE = 'outreach-open_influencer_manager_page';

export type OpenInfluencerManagerPagePayload = EventPayload<{
    extra_info?: any;
}>;

export const OpenInfluencerManagerPage = (
    trigger: TriggerEvent<OpenInfluencerManagerPagePayload>,
    payload?: OpenInfluencerManagerPagePayload,
) => trigger(OUTREACH_OPEN_INFLUENCER_MANAGER_PAGE, payload);

// @note we cast the eventName to a string literal since we are going to reference it back from TriggerEvent callbacks
OpenInfluencerManagerPage.eventName = <typeof OUTREACH_OPEN_INFLUENCER_MANAGER_PAGE>(
    OUTREACH_OPEN_INFLUENCER_MANAGER_PAGE
);

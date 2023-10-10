import type { CommonStatusType } from 'src/components/library';
import type { EventPayload, TriggerEvent } from '../../types';

export const FILTER_INFLUENCER_MANAGER = 'Filter Influencer Manager';

export type FilterInfluencerManagerPayload = EventPayload<{
    filter_type: string;
    selected_statuses: CommonStatusType[];
    view_mine_enabled: boolean;
    total_managed_influencers: number;
    total_filter_results: number;
}>;

export const FilterInfluencerManager = (
    trigger: TriggerEvent<FilterInfluencerManagerPayload>,
    payload?: FilterInfluencerManagerPayload,
) => trigger(FILTER_INFLUENCER_MANAGER, payload);

// @note we cast the eventName to a string literal since we are going to reference it back from TriggerEvent callbacks
FilterInfluencerManager.eventName = <typeof FILTER_INFLUENCER_MANAGER>FILTER_INFLUENCER_MANAGER;

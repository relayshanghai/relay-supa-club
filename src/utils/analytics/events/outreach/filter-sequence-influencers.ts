import type { EventPayload, TriggerEvent } from '../../types';

export const FILTER_SEQUENCE_INFLUENCERS = 'Filter Sequence Influencers';

export type FilterSequenceInfluencersPayload = EventPayload<{
    filter_type: string;
    current_tab: string;
    total_sequence_influencers: number;
    total_filter_results: number;
    sequence_id: string;
    sequence_name: string;
}>;

export const FilterSequenceInfluencers = (
    trigger: TriggerEvent<FilterSequenceInfluencersPayload>,
    payload?: FilterSequenceInfluencersPayload,
) => trigger(FILTER_SEQUENCE_INFLUENCERS, payload);

// @note we cast the eventName to a string literal since we are going to reference it back from TriggerEvent callbacks
FilterSequenceInfluencers.eventName = <typeof FILTER_SEQUENCE_INFLUENCERS>FILTER_SEQUENCE_INFLUENCERS;

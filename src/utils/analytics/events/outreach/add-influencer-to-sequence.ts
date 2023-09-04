import type { EventPayload, TriggerEvent } from '../../types';

export const OUTREACH_ADD_INFLUENCER_TO_SEQUENCE = 'outreach-add_influencer_to_sequence';

export type AddInfluencerToSequencePayload = EventPayload<{
    influencer_id: string | null;
    sequence_id: string | null;
    sequence_influencer_id: string | null;
    is_success: boolean;
    is_sequence_autostart: boolean | null;
    extra_info?: any;
}>;

export const AddInfluencerToSequence = (
    trigger: TriggerEvent<AddInfluencerToSequencePayload>,
    payload?: AddInfluencerToSequencePayload,
) => trigger(OUTREACH_ADD_INFLUENCER_TO_SEQUENCE, payload);

// @note we cast the eventName to a string literal since we are going to reference it back from TriggerEvent callbacks
AddInfluencerToSequence.eventName = <typeof OUTREACH_ADD_INFLUENCER_TO_SEQUENCE>OUTREACH_ADD_INFLUENCER_TO_SEQUENCE;

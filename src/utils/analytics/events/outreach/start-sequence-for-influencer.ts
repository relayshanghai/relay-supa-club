import type { SendResult } from 'pages/api/sequence/send';
import type { EventPayload, TriggerEvent } from '../../types';

export const OUTREACH_START_SEQUENCE_FOR_INFLUENCER = 'outreach-start_sequence_for_influencer';

export type StartSequenceForInfluencerPayload = EventPayload<{
    influencer_id: string | null;
    sequence_id: string | null;
    sequence_name: string | null;
    sequence_influencer_id: string | null;
    is_success: boolean;
    sent_success?: SendResult[];
    sent_success_count?: number;
    sent_failed?: SendResult[];
    sent_failed_count?: number;
    extra_info?: any;
    batch_id: string | number;
}>;

export const StartSequenceForInfluencer = (
    trigger: TriggerEvent<StartSequenceForInfluencerPayload>,
    payload?: StartSequenceForInfluencerPayload,
) => trigger(OUTREACH_START_SEQUENCE_FOR_INFLUENCER, payload);

// @note we cast the eventName to a string literal since we are going to reference it back from TriggerEvent callbacks
StartSequenceForInfluencer.eventName = <typeof OUTREACH_START_SEQUENCE_FOR_INFLUENCER>(
    OUTREACH_START_SEQUENCE_FOR_INFLUENCER
);

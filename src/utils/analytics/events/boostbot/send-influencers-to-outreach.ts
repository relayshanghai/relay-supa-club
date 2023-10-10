import type { TriggerEvent } from '../../types';
import type { CurrentPageEvent } from '../current-pages';

// Event names:
// - boostbot-send_influencers_to_outreach
export const BOOSTBOT_SEND_INFLUENCERS_TO_OUTREACH = 'Add to Sequence';

export type SendInfluencersToOutreachPayload = {
    currentPage: CurrentPageEvent;
    /**
     * For now, influencer_ids are reference_ids
     * the current implementation does not rely on using our own influencer_ids
     */
    influencer_ids: string[] | null;
    sequence_influencer_ids: string[] | null;
    topics: string[] | null;
    /**
     * I will assume that there will be a time that
     * the user will want to send a single influencer
     *
     * Current implementation does not provide initial info
     * whether event is for multiple influencers or a single influencer
     */
    is_multiple: boolean | null;
    is_success: boolean;
    extra_info?: any;
    // @note legacy props after AddInfluencerToSequence got merged here
    sequence_id: string | null;
    sequence_influencer_id: string | null;
    is_sequence_autostart: boolean | null;
};

export const SendInfluencersToOutreach = (
    trigger: TriggerEvent<SendInfluencersToOutreachPayload>,
    payload?: SendInfluencersToOutreachPayload,
) => trigger(BOOSTBOT_SEND_INFLUENCERS_TO_OUTREACH, payload);

SendInfluencersToOutreach.eventName = <typeof BOOSTBOT_SEND_INFLUENCERS_TO_OUTREACH>(
    BOOSTBOT_SEND_INFLUENCERS_TO_OUTREACH
);

import type { TriggerEvent } from '../../types';
import { CurrentPageEvent } from '../current-pages';

export const BOOSTBOT_SEND_INFLUENCERS_TO_OUTREACH = 'boostbot-send_influencers_to_outreach';

export type SendInfluencersToOutreachPayload = {
    currentPage: CurrentPageEvent;
    /**
     * For now, influencer_ids are reference_ids
     * the current implementation does not rely on using our own influencer_ids
     */
    influencer_ids: string[];
    topics: string[];
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
};

export const SendInfluencersToOutreach = (
    trigger: TriggerEvent<SendInfluencersToOutreachPayload>,
    payload?: SendInfluencersToOutreachPayload,
) => trigger(BOOSTBOT_SEND_INFLUENCERS_TO_OUTREACH, payload);

SendInfluencersToOutreach.eventName = <typeof BOOSTBOT_SEND_INFLUENCERS_TO_OUTREACH>(
    BOOSTBOT_SEND_INFLUENCERS_TO_OUTREACH
);

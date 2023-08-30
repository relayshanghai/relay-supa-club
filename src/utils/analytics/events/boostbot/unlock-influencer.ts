import type { EventPayload, TriggerEvent } from '../../types';

export const BOOSTBOT_UNLOCK_INFLUENCERS = 'TEST:boostbot-unlock_influencers';

export type UnlockInfluencersPayload = EventPayload<{
    /**
     * For now, influencer_ids are reference_ids
     * the current implementation does not rely on using our own influencer_ids
     */
    influencer_ids: string[];
    topics: string[];
    is_multiple: boolean;
    is_success: boolean;
    extra_info?: any;
}>;

export const UnlockInfluencers = (
    trigger: TriggerEvent<UnlockInfluencersPayload>,
    payload?: UnlockInfluencersPayload,
) => trigger(BOOSTBOT_UNLOCK_INFLUENCERS, payload);

UnlockInfluencers.eventName = <typeof BOOSTBOT_UNLOCK_INFLUENCERS>BOOSTBOT_UNLOCK_INFLUENCERS;

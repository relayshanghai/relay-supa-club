import type { EventPayload, TriggerEvent } from '../../types';

export const BOOSTBOT_UNLOCK_INFLUENCERS = 'TEST:boostbot-unlock_influencers';

export type UnlockInfluencersPayload = EventPayload<{
    influencer_ids: string[];
    topics: string[];
    is_all: boolean;
    is_success: boolean;
    extra_info?: any;
}>;

export const UnlockInfluencers = (
    trigger: TriggerEvent<UnlockInfluencersPayload>,
    payload?: UnlockInfluencersPayload,
) => trigger(BOOSTBOT_UNLOCK_INFLUENCERS, payload);

UnlockInfluencers.eventName = <typeof BOOSTBOT_UNLOCK_INFLUENCERS>BOOSTBOT_UNLOCK_INFLUENCERS;

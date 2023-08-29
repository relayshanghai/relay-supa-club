import type { TriggerEvent } from '../types';

export const BOOSTBOT_RECOMMEND_INFLUENCERS = 'TEST:boostbot-recommend_influencers';

export type RecommendInfluencersPayload = {
    query: string,
    topics_generated: string[],
    valid_topics: string[],
    recommended_influencers: string[],
    is_success: boolean,
    extra_info?: any,
};

export const RecommendInfluencers = (trigger: TriggerEvent, value?: RecommendInfluencersPayload) =>
    trigger(BOOSTBOT_RECOMMEND_INFLUENCERS, value);

export type RecommendInfluencers = typeof RecommendInfluencers;

RecommendInfluencers.eventName = BOOSTBOT_RECOMMEND_INFLUENCERS;

import type { TriggerEvent } from '../../types';
import { CurrentPageEvent } from '../current-pages';

export const BOOSTBOT_RECOMMEND_INFLUENCERS = 'boostbot-recommend_influencers';

export type RecommendInfluencersPayload = {
    currentPage: CurrentPageEvent;
    query: string;
    topics_generated: string[];
    valid_topics: string[];
    recommended_influencers: string[];
    is_success: boolean;
    extra_info?: any;
};

export const RecommendInfluencers = (trigger: TriggerEvent, value?: RecommendInfluencersPayload) =>
    trigger(BOOSTBOT_RECOMMEND_INFLUENCERS, value);

export type RecommendInfluencers = typeof RecommendInfluencers;

RecommendInfluencers.eventName = <typeof BOOSTBOT_RECOMMEND_INFLUENCERS>BOOSTBOT_RECOMMEND_INFLUENCERS;

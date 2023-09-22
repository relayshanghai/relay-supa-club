import type { CreatorPlatform } from 'types';
import type { EventPayload, TriggerEvent } from '../../types';

export const ADD_INFLUENCER_POST = 'Add Influencer Post';

export type AddInfluencerPostPayload = EventPayload<{
    /** reference to the table influencer_social_profile.id */
    influencer_id: string;
    post_links: string[];
    platform: CreatorPlatform;
    total_profile_posts: number;
}>;

export const AddInfluencerPost = (trigger: TriggerEvent, payload?: AddInfluencerPostPayload) =>
    trigger(ADD_INFLUENCER_POST, payload);

// @note we cast the eventName to a string literal since we are going to reference it back from TriggerEvent callbacks
AddInfluencerPost.eventName = <typeof ADD_INFLUENCER_POST>ADD_INFLUENCER_POST;

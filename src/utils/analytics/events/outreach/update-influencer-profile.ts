import type { EventPayload, TriggerEvent } from '../../types';

export const UPDATE_INFLUENCER_PROFILE = 'Update Influencer Profile';

export type UpdateInfluencerProfilePayload = EventPayload<{
    influencer_id: string; // REFERENCE TO THE INFLUENCER_SOCIAL_PROFILE TABLE'S ID
    updated_field: string;
    previously_empty: boolean;
    batch_id: string;
}>;

export const UpdateInfluencerProfile = (trigger: TriggerEvent, payload?: UpdateInfluencerProfilePayload) =>
    trigger(UPDATE_INFLUENCER_PROFILE, payload);

// @note we cast the eventName to a string literal since we are going to reference it back from TriggerEvent callbacks
UpdateInfluencerProfile.eventName = <typeof UPDATE_INFLUENCER_PROFILE>UPDATE_INFLUENCER_PROFILE;

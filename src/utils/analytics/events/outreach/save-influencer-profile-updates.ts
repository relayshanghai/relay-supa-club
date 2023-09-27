import type { EventPayload, TriggerEvent } from '../../types';

export const SAVE_INFLUENCER_PROFILE_UPDATES = 'Save Influencer Profile Updates';

export type SaveInfluencerProfileUpdatesPayload = EventPayload<{
    /** reference to the table influencer_social_profile.id */
    influencer_id: string;
    batch_id: number;
    action_type: 'Button' | 'Off Modal Click' | 'X';
}>;

export const SaveInfluencerProfileUpdates = (trigger: TriggerEvent, payload?: SaveInfluencerProfileUpdatesPayload) =>
    trigger(SAVE_INFLUENCER_PROFILE_UPDATES, payload);

// @note we cast the eventName to a string literal since we are going to reference it back from TriggerEvent callbacks
SaveInfluencerProfileUpdates.eventName = <typeof SAVE_INFLUENCER_PROFILE_UPDATES>SAVE_INFLUENCER_PROFILE_UPDATES;

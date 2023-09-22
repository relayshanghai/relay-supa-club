import type { EventPayload, TriggerEvent } from '../../types';

export const ADD_NOTE_TO_INFLUENCER_PROFILE = 'Add Note To Influencer Profile';

export type AddNoteToInfluencerProfilePayload = EventPayload<{
    /** references the `influencer_social_profile.id` */
    influencer_id: string;
    note: string;
}>;

export const AddNoteToInfluencerProfile = (trigger: TriggerEvent, payload?: AddNoteToInfluencerProfilePayload) =>
    trigger(ADD_NOTE_TO_INFLUENCER_PROFILE, payload);

// @note we cast the eventName to a string literal since we are going to reference it back from TriggerEvent callbacks
AddNoteToInfluencerProfile.eventName = <typeof ADD_NOTE_TO_INFLUENCER_PROFILE>ADD_NOTE_TO_INFLUENCER_PROFILE;

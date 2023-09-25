import type { EventPayload, TriggerEvent } from '../../types';

export const VIEW_INFLUENCER_PROFILE_NOTES = 'View Influencer Profile Notes';

export type ViewInfluencerProfileNotesPayload = EventPayload<{
    influencer_id: string;
    total_notes: number;
}>;

export const ViewInfluencerProfileNotes = (
    trigger: TriggerEvent<ViewInfluencerProfileNotesPayload>,
    payload?: ViewInfluencerProfileNotesPayload,
) => trigger(VIEW_INFLUENCER_PROFILE_NOTES, payload);

ViewInfluencerProfileNotes.eventName = <typeof VIEW_INFLUENCER_PROFILE_NOTES>VIEW_INFLUENCER_PROFILE_NOTES;

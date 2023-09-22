import type { FunnelStatus } from 'src/utils/api/db';
import type { EventPayload, TriggerEvent } from '../../types';

export const UPDATE_INFLUENCER_STATUS = 'Update Influencer Status';

export type UpdateInfluencerStatusPayload = EventPayload<{
    /** references the `influencer_social_profile.id` */
    influencer_id: string;
    current_status: FunnelStatus;
    selected_status: FunnelStatus;
}>;

export const UpdateInfluencerStatus = (trigger: TriggerEvent, payload?: UpdateInfluencerStatusPayload) =>
    trigger(UPDATE_INFLUENCER_STATUS, payload);

// @note we cast the eventName to a string literal since we are going to reference it back from TriggerEvent callbacks
UpdateInfluencerStatus.eventName = <typeof UPDATE_INFLUENCER_STATUS>UPDATE_INFLUENCER_STATUS;

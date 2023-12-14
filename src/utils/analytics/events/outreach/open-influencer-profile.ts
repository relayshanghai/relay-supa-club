import type { FunnelStatus } from 'src/utils/api/db';
import type { EventPayload, TriggerEvent } from '../../types';

export const OPEN_INFLUENCER_PROFILE = 'Open Influencer Profile';

export type OpenInfluencerProfilePayload = EventPayload<{
    /** references table influencer_social_profile.id */
    influencer_id: string;
    current_status: FunnelStatus;
    is_users_influencer: boolean;
}>;

export const OpenInfluencerProfile = (trigger: TriggerEvent, payload?: OpenInfluencerProfilePayload) =>
    trigger(OPEN_INFLUENCER_PROFILE, payload);

// @note we cast the eventName to a string literal since we are going to reference it back from TriggerEvent callbacks
OpenInfluencerProfile.eventName = <typeof OPEN_INFLUENCER_PROFILE>OPEN_INFLUENCER_PROFILE;

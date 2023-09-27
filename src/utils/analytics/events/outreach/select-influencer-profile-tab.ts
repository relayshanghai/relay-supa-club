import type { FunnelStatus } from './../../../api/db/types';
import type { EventPayload, TriggerEvent } from '../../types';

export const SELECT_INFLUENCER_PROFILE_TAB = 'Select Influencer Profile Tab';

export type SelectInfluencerProfileTabPayload = EventPayload<{
    influencer_id: string;
    influencer_current_status: FunnelStatus;
    current_tab?: 'notes' | 'shipping-details';
    selected?: 'notes' | 'shipping-details';
}>;

export const SelectInfluencerProfileTab = (
    trigger: TriggerEvent<SelectInfluencerProfileTabPayload>,
    payload?: SelectInfluencerProfileTabPayload,
) => trigger(SELECT_INFLUENCER_PROFILE_TAB, payload);

// @note we cast the eventName to a string literal since we are going to reference it back from TriggerEvent callbacks
SelectInfluencerProfileTab.eventName = <typeof SELECT_INFLUENCER_PROFILE_TAB>SELECT_INFLUENCER_PROFILE_TAB;

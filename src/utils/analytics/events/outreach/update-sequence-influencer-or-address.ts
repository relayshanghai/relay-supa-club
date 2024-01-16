import type { EventPayload, TriggerEvent } from '../../types';

export const UPDATE_INFLUENCER_OR_ADDRESS = 'Update Influencer or Address';

export type UpdateInfluencerOrAddressPayload = EventPayload<{
    influencer_id: string; // REFERENCE TO THE INFLUENCER_SOCIAL_PROFILE TABLE'S ID
    updated_field: string;
    updated_value: string;
    batch_id: number;
}>;

export const UpdateInfluencerOrAddress = (trigger: TriggerEvent, payload?: UpdateInfluencerOrAddressPayload) =>
    trigger(UPDATE_INFLUENCER_OR_ADDRESS, payload);

// @note we cast the eventName to a string literal since we are going to reference it back from TriggerEvent callbacks
UpdateInfluencerOrAddress.eventName = <typeof UPDATE_INFLUENCER_OR_ADDRESS>UPDATE_INFLUENCER_OR_ADDRESS;

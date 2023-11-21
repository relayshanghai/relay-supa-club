import type { CreatorPlatform } from 'types';
import type { EventPayload, TriggerEvent } from '../../types';

export const OPEN_INFLUENCER_CARD = 'open-influencer_card';

export type OpenInfluencerCardPayload = EventPayload<{
    influencer_id: string;
    platform: CreatorPlatform;
    index_position: number;
}>;

export const OpenInfluencerCard = (
    trigger: TriggerEvent<OpenInfluencerCardPayload>,
    payload?: OpenInfluencerCardPayload,
) => trigger(OPEN_INFLUENCER_CARD, payload);

OpenInfluencerCard.eventName = <typeof OPEN_INFLUENCER_CARD>OPEN_INFLUENCER_CARD;

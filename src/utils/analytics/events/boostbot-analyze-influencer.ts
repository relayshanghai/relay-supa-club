import type { EventPayload, TriggerEvent } from '../types';

export const BOOSTBOT_ANALYZE_INFLUENCER = 'boostbot-analyze_influencer';

export type BoostbotAnalyzeInfluencerPayload = EventPayload;

export const BoostbotAnalyzeInfluencer = (trigger: TriggerEvent, value?: BoostbotAnalyzeInfluencerPayload) =>
    trigger(BOOSTBOT_ANALYZE_INFLUENCER, value);

export type BoostbotAnalyzeInfluencer = typeof BoostbotAnalyzeInfluencer;

BoostbotAnalyzeInfluencer.eventName = <typeof BOOSTBOT_ANALYZE_INFLUENCER>BOOSTBOT_ANALYZE_INFLUENCER;

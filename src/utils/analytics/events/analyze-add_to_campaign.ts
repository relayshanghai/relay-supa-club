import type { UserProfile } from 'types';
import type { EventPayload, TriggerEvent } from '../types';

export const ANALYZE_ADD_TO_CAMPAIGN = 'analyze-add_to_campaign';

export type AnalyzeAddToCampaignPayload = EventPayload<{
    creator: UserProfile;
    campaign: string;
}>;

export const AnalyzeAddToCampaign = (trigger: TriggerEvent, value?: AnalyzeAddToCampaignPayload) =>
    trigger(ANALYZE_ADD_TO_CAMPAIGN, value);

export type AnalyzeAddToCampaign = typeof AnalyzeAddToCampaign;

AnalyzeAddToCampaign.eventName = <typeof ANALYZE_ADD_TO_CAMPAIGN>ANALYZE_ADD_TO_CAMPAIGN;

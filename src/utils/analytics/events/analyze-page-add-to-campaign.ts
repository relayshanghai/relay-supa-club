import type { CreatorPlatform } from 'types';
import type { TriggerEvent } from '../types';

export const ANALYZE_PAGE_ADD_TO_CAMPAIGN = 'Analyze Page, add to campaign';

export type AnalyzePageAddToCampaignPayload = {
    platform: CreatorPlatform;
    user_id: string;
};

export const AnalyzePageAddToCampaign = (trigger: TriggerEvent, value?: AnalyzePageAddToCampaignPayload) =>
    trigger(ANALYZE_PAGE_ADD_TO_CAMPAIGN, { ...value });

AnalyzePageAddToCampaign.eventName = <typeof ANALYZE_PAGE_ADD_TO_CAMPAIGN>ANALYZE_PAGE_ADD_TO_CAMPAIGN;

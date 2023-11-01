import type { CreatorPlatform } from 'types';
import type { TriggerEvent } from '../types';

export const OPEN_SIMILAR_INFLUENCER_REPORT = 'Analyze Page, Similar Influencer Section, open report';

export type OpenSimilarInfluencerReportPayload = {
    platform: CreatorPlatform;
    user_id: string;
};

export const OpenSimilarInfluencerReport = (trigger: TriggerEvent, value?: OpenSimilarInfluencerReportPayload) =>
    trigger(OPEN_SIMILAR_INFLUENCER_REPORT, { ...value });

OpenSimilarInfluencerReport.eventName = <typeof OPEN_SIMILAR_INFLUENCER_REPORT>OPEN_SIMILAR_INFLUENCER_REPORT;

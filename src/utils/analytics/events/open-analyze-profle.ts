import type { CreatorPlatform } from 'types';
import type { TriggerEvent } from '../types';
import type { CurrentPageEvent } from './current-pages';

export const OPEN_ANALYZE_PROFILE = 'Open Analyze Profile';

export type OpenAnalyzeProfilePayload = {
    currentPage: CurrentPageEvent;
    platform: CreatorPlatform;
    user_id: string;
};

export const OpenAnalyzeProfile = (trigger: TriggerEvent, value?: OpenAnalyzeProfilePayload) =>
    trigger(OPEN_ANALYZE_PROFILE, { ...value });

export type OpenAnalyzeProfile = typeof OpenAnalyzeProfile;

OpenAnalyzeProfile.eventName = <typeof OPEN_ANALYZE_PROFILE>OPEN_ANALYZE_PROFILE;

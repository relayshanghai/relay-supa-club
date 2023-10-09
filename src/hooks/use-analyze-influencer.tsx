import { useCallback } from 'react';
import { useRudderstack } from './use-rudderstack';
import type { CreatorPlatform } from 'types';

export type analyzeInfluencerParams = {
    platform: CreatorPlatform;
    user_id: string;
    searchId: string;
    initiator: string;
    openType: string;
    batchId: number;
    page: number;
    resultIndex: number;
};

export const useAnalyzeInfluencer = () => {
    const { trackEvent } = useRudderstack();

    const analyzeInfluencer = useCallback(
        (args: analyzeInfluencerParams) => {
            const { platform, user_id } = args;
            // @note previous name: Search Result Row, open report
            trackEvent('Open Report', {
                platform,
                user_id,
                // @note total_reports is an incrementable property
                total_reports: 1,
                search_id: args.searchId,
                initiator: args.initiator,
                open_type: args.openType,
                batch_id: args.batchId,
                // credit_cost: null,
                search_results_page: args.page,
                search_results_index: args.resultIndex,
            });
        },
        [trackEvent],
    );

    return analyzeInfluencer;
};

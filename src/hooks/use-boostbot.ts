import { useCallback } from 'react';
import type { CreatorPlatform } from 'types';
import type { CreatorsReportGetQueries, CreatorsReportGetResponse } from 'pages/api/creators/report';
import { useUser } from './use-user';
import { useCompany } from './use-company';
import { nextFetchWithQueries } from 'src/utils/fetcher';
import { clientLogger } from 'src/utils/logger-client';
import { limiter } from 'src/utils/limiter';
import type { eventKeys } from 'src/utils/analytics/events';
import { SearchAnalyzeInfluencer } from 'src/utils/analytics/events';

export const useBoostbot = () => {
    const { profile } = useUser();
    const { company } = useCompany();

    const unlockInfluencers = useCallback(
        async (influencerIds: string[]) => {
            try {
                if (!company?.id || !profile?.id) throw new Error('No company or profile found');

                const influencersPromises = influencerIds.map((influencerId) => {
                    const reportQuery = {
                        // TODO: Right now only handling instagram, make platform dynamic
                        platform: 'instagram' as CreatorPlatform,
                        creator_id: influencerId,
                        company_id: company.id,
                        user_id: profile.id,
                        track: SearchAnalyzeInfluencer.eventName as eventKeys,
                    };

                    return limiter.schedule(() =>
                        nextFetchWithQueries<CreatorsReportGetQueries, CreatorsReportGetResponse>(
                            'creators/report',
                            reportQuery,
                        ),
                    );
                });

                const influencersResult = await Promise.all(influencersPromises);

                return influencersResult;
            } catch (error) {
                clientLogger(error, 'error');
                throw error;
            }
        },
        [profile, company],
    );

    return {
        unlockInfluencers,
    };
};

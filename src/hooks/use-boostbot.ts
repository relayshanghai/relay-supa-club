import { useCallback } from 'react';
import type { CreatorPlatform } from 'types';
import type { CreatorsReportGetQueries, CreatorsReportGetResponse } from 'pages/api/creators/report';
import { useUser } from './use-user';
import { useCompany } from './use-company';
import { nextFetch, nextFetchWithQueries } from 'src/utils/fetcher';
import { clientLogger } from 'src/utils/logger-client';
import { limiter } from 'src/utils/limiter';
import type { eventKeys } from 'src/utils/analytics/events';
import { SearchAnalyzeInfluencer } from 'src/utils/analytics/events';
import type { GetTopicsBody, GetTopicsResponse } from 'pages/api/boostbot/get-topics';
import type { GetRelevantTopicsBody, GetRelevantTopicsResponse } from 'pages/api/boostbot/get-relevant-topics';
import type { GetTopicClustersBody, GetTopicClustersResponse } from 'pages/api/boostbot/get-topic-clusters';
import type { GetInfluencersBody, GetInfluencersResponse } from 'pages/api/boostbot/get-influencers';

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

                return await Promise.all(influencersPromises);
            } catch (error) {
                clientLogger(error, 'error');
                throw error;
            }
        },
        [profile, company],
    );

    const performFetch = async <T, B>(endpoint: string, body: B): Promise<T> => {
        try {
            const response = await nextFetch<T>(`boostbot/${endpoint}`, { method: 'POST', body });

            // TODO: remove log when done testing
            // eslint-disable-next-line no-console
            console.log('endpoint, response :>> ', endpoint, response);
            return response;
        } catch (error) {
            clientLogger(error, 'error');
            throw error;
        }
    };

    const getTopics = useCallback(async (productDescription: string) => {
        const { topics } = await performFetch<GetTopicsResponse, GetTopicsBody>('get-topics', {
            productDescription,
        });

        return topics;
    }, []);

    const getRelevantTopics = useCallback(
        async ({ topics, platform }: { topics: string[]; platform: CreatorPlatform }) => {
            const { relevantTopics } = await performFetch<GetRelevantTopicsResponse, GetRelevantTopicsBody>(
                'get-relevant-topics',
                { topics, platform },
            );

            return relevantTopics;
        },
        [],
    );

    const getTopicClusters = useCallback(
        async ({ productDescription, topics }: { productDescription: string; topics: string[] }) => {
            const { topicClusters } = await performFetch<GetTopicClustersResponse, GetTopicClustersBody>(
                'get-topic-clusters',
                { productDescription, topics },
            );

            return topicClusters;
        },
        [],
    );

    const getInfluencers = useCallback(
        async ({ topicClusters, platform }: { topicClusters: string[][]; platform: CreatorPlatform }) => {
            const { influencers } = await performFetch<GetInfluencersResponse, GetInfluencersBody>('get-influencers', {
                topicClusters,
                platform,
            });

            return influencers;
        },
        [],
    );

    return {
        getTopics,
        getRelevantTopics,
        getTopicClusters,
        getInfluencers,
        unlockInfluencers,
    };
};

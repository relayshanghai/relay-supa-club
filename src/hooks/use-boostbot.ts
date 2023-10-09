import { useCallback } from 'react';
import type { CreatorPlatform } from 'types';
import type { CreatorsReportGetQueries, CreatorsReportGetResponse } from 'pages/api/creators/report';
import { useUser } from './use-user';
import { useCompany } from './use-company';
import { nextFetch, nextFetchWithQueries } from 'src/utils/fetcher';
import { clientLogger } from 'src/utils/logger-client';
import { limiter } from 'src/utils/limiter';
import { SearchAnalyzeInfluencer } from 'src/utils/analytics/events';
import type { GetTopicsBody, GetTopicsResponse } from 'pages/api/boostbot/get-topics';
import type { GetRelevantTopicsBody, GetRelevantTopicsResponse } from 'pages/api/boostbot/get-relevant-topics';
import type { GetTopicClustersBody, GetTopicClustersResponse } from 'pages/api/boostbot/get-topic-clusters';
import type { GetInfluencersBody, GetInfluencersResponse } from 'pages/api/boostbot/get-influencers';
import type { SearchInfluencersPayloadRequired } from 'src/utils/api/iqdata/influencers/search-influencers-payload';
import type { Influencer } from 'pages/boostbot';
import { getFulfilledData } from 'src/utils/utils';

type UseBoostbotProps = {
    abortSignal?: AbortController['signal'];
};

// Majority of these requests will eventually move to the backend to be safer (not abusable) and faster. https://toil.kitemaker.co/0JhYl8-relayclub/8sxeDu-v2_project/items/828
export const useBoostbot = ({ abortSignal }: UseBoostbotProps) => {
    const { profile } = useUser();
    const { company } = useCompany();

    const unlockInfluencers = useCallback(
        async (influencersToUnlock: Influencer[], freeOfCharge = false) => {
            if (!company?.id || !profile?.id) throw new Error('No company or profile found');

            const influencersPromises = influencersToUnlock.map(({ user_id, url }) => {
                const platforms: CreatorPlatform[] = ['youtube', 'tiktok', 'instagram'];
                const platform = platforms.find((platform) => url.includes(platform)) || 'instagram';

                const reportQuery: CreatorsReportGetQueries = {
                    platform: platform,
                    creator_id: user_id,
                    company_id: company.id,
                    user_id: profile.id,
                    track: SearchAnalyzeInfluencer.eventName,
                    source: freeOfCharge ? 'boostbot' : 'default',
                };

                return limiter.schedule(() =>
                    nextFetchWithQueries<CreatorsReportGetQueries, CreatorsReportGetResponse>(
                        'creators/report',
                        reportQuery,
                    ),
                );
            });

            const influencersResults = await Promise.allSettled(influencersPromises);

            return getFulfilledData(influencersResults);
        },
        [profile, company],
    );

    const performFetch = useCallback(
        async <T, B>(endpoint: string, body: B): Promise<T> => {
            try {
                const response = await nextFetch<T>(`boostbot/${endpoint}`, {
                    signal: abortSignal,
                    method: 'POST',
                    body,
                });

                return response;
            } catch (error) {
                clientLogger(error, 'error');
                throw error;
            }
        },
        [abortSignal],
    );

    const getTopics = useCallback(
        async (productDescription: string) =>
            await performFetch<GetTopicsResponse, GetTopicsBody>('get-topics', {
                productDescription,
            }),
        [performFetch],
    );

    const getRelevantTopics = useCallback(
        async ({ topics, platform }: { topics: string[]; platform: CreatorPlatform }) =>
            await performFetch<GetRelevantTopicsResponse, GetRelevantTopicsBody>('get-relevant-topics', {
                topics,
                platform,
            }),
        [performFetch],
    );

    const getTopicClusters = useCallback(
        async ({ productDescription, topics }: { productDescription: string; topics: string[] }) =>
            await performFetch<GetTopicClustersResponse, GetTopicClustersBody>('get-topic-clusters', {
                productDescription,
                topics,
            }),
        [performFetch],
    );

    const getInfluencers = useCallback(
        async (searchPayloads: SearchInfluencersPayloadRequired[]) => {
            if (!company?.id || !profile?.id) throw new Error('No company or profile found');

            return await performFetch<GetInfluencersResponse, GetInfluencersBody>('get-influencers', {
                searchPayloads,
                user_id: profile.id,
                company_id: company.id,
            });
        },
        [performFetch, company, profile],
    );

    return {
        getTopics,
        getRelevantTopics,
        getTopicClusters,
        getInfluencers,
        unlockInfluencers,
    };
};

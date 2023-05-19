import type {
    PostsPerformanceByCampaignGetQuery,
    PostsPerformanceByCampaignGetResponse,
} from 'pages/api/post-performance/by-campaign';
import type { SetStateAction } from 'react';
import { useState } from 'react';
import type { CampaignDB, ProfileDB } from 'src/utils/api/db';
import { nextFetchWithQueries } from 'src/utils/fetcher';
import { clientLogger } from 'src/utils/logger-client';
import type {
    PostsPerformanceByPostGetResponse,
    PostsPerformanceByPostGetQuery,
} from 'pages/api/post-performance/by-post';
import { useUser } from './use-user';
import useSWR from 'swr';

export type PostPerformanceByCampaign = { [campaignId: string]: PostsPerformanceByCampaignGetResponse };

const pollForFreshData = async ({
    post,
    profile,
    campaignId,
    oneDayAgo,
    setPerformanceData,
}: {
    post: PostsPerformanceByPostGetResponse;
    campaignId: string;
    profile: ProfileDB;
    oneDayAgo: Date;
    setPerformanceData: (value: SetStateAction<PostPerformanceByCampaign | null>) => void;
}) => {
    const interval = setInterval(async () => {
        try {
            const updatedData = await nextFetchWithQueries<
                PostsPerformanceByPostGetQuery,
                PostsPerformanceByPostGetResponse
            >('post-performance/by-post', {
                id: post.id,
                profileId: profile.id,
            });

            if (new Date(updatedData.updatedAt) > oneDayAgo) {
                setPerformanceData((prev) => {
                    if (!prev) return prev;
                    const updated = prev[campaignId].map((prevPost) => {
                        if (prevPost.url === post.url) return updatedData;
                        return prevPost;
                    });
                    return { ...prev, [campaignId]: updated };
                });
                clearInterval(interval);
            }
        } catch (error) {
            clientLogger(error, 'error');
        }
    }, 10000);
};

const usePostPerformance = (campaignIds: string[] = []) => {
    const [performanceData, setPerformanceData] = useState<PostPerformanceByCampaign | null>(null);
    const { profile } = useUser();
    const [selectedCampaign, setSelectedCampaign] = useState<CampaignDB | null>(null);

    const fetcher = async (campaignIds: string[]) => {
        if (!profile?.id) return;
        if (!campaignIds || campaignIds.length === 0) return;

        try {
            const result: PostPerformanceByCampaign = {};
            for (const campaignId of campaignIds) {
                const data = await nextFetchWithQueries<
                    PostsPerformanceByCampaignGetQuery,
                    PostsPerformanceByCampaignGetResponse
                >('post-performance/by-campaign', {
                    campaignId,
                    profileId: profile.id,
                });
                result[campaignId] = data;
                // if data is stale (older than 1 day), set up a 10s poll to check for the new data. remove the poll when the data is updated
                const now = new Date();
                const oneDay = 1000 * 60 * 60 * 24;
                const oneDayAgo = new Date(now.getTime() - oneDay);
                for (const post of data) {
                    if (new Date(post.updatedAt) < oneDayAgo) {
                        pollForFreshData({ post, campaignId, profile, oneDayAgo, setPerformanceData });
                    }
                }
            }
            setPerformanceData(result);
        } catch (error) {
            clientLogger(error, 'error');
        }
    };

    // we don't use the returned data because we need to be able to update it from the polling function.
    const { isLoading: loading } = useSWR(['post-performance/by-campaign', campaignIds], () => fetcher(campaignIds));

    return { performanceData, loading, selectedCampaign, setSelectedCampaign };
};

export default usePostPerformance;

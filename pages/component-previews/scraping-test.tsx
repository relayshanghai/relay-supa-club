import type { PostScrapeGetQuery, PostScrapeGetResponse } from 'pages/api/post-performance';
import { useEffect, useState } from 'react';
import { featPerformance } from 'src/constants/feature-flags';
import { useCampaigns } from 'src/hooks/use-campaigns';
import { useUser } from 'src/hooks/use-user';
import { nextFetchWithQueries } from 'src/utils/fetcher';
import { clientLogger } from 'src/utils/logger-client';

// TODO: Delete this file when this feature is ready. It has the `featPerformance` flag here so we can be reminded to delete it.

export default function ScrapingTest() {
    const { profile } = useUser();
    const { campaigns } = useCampaigns({});
    const [youtubeData, setYoutubeData] = useState<PostScrapeGetResponse | string>();
    const [instagramData, setInstagramData] = useState<PostScrapeGetResponse | string>();
    const [tiktokData, setTiktokData] = useState<PostScrapeGetResponse | string>();

    useEffect(() => {
        // we can basically turn this into a `usePostData` hook
        if (!featPerformance()) return;
        if (!profile?.id) return;
        if (!campaigns || !campaigns[0]) return;

        const getInstagramData = async () => {
            try {
                const data = await nextFetchWithQueries<PostScrapeGetQuery, PostScrapeGetResponse>('posts/scrape', {
                    campaignId: campaigns[0].id,
                    profileId: profile?.id || '',
                });
                setInstagramData(data);
            } catch (error: any) {
                clientLogger(error, 'error');
                setInstagramData(error.message);
            }
        };
        const getYoutubeData = async () => {
            try {
                const data = await nextFetchWithQueries<PostScrapeGetQuery, PostScrapeGetResponse>('posts/scrape', {
                    campaignId: campaigns[0].id,
                    profileId: profile?.id || '',
                });
                setYoutubeData(data);
            } catch (error: any) {
                clientLogger(error, 'error');
                setYoutubeData(error.message);
            }
        };
        const getTikTokData = async () => {
            try {
                const data = await nextFetchWithQueries<PostScrapeGetQuery, PostScrapeGetResponse>('posts/scrape', {
                    campaignId: campaigns[0].id,
                    profileId: profile?.id || '',
                });
                setTiktokData(data);
            } catch (error: any) {
                clientLogger(error, 'error');
                setTiktokData(error.message);
            }
        };
        getTikTokData();
        getYoutubeData();
        getInstagramData();
    }, [profile?.id, campaigns]);
    if (!featPerformance()) return null;

    return (
        <div>
            <h1>Scraping Test</h1>
            <h2>Youtube</h2>
            <div>{JSON.stringify(youtubeData)}</div>
            <h2>Instagram</h2>
            <div>{JSON.stringify(instagramData)}</div>
            <h2>Tiktok</h2>
            <div>{JSON.stringify(tiktokData)}</div>
        </div>
    );
}

import type { CreatorPlatform, DatabaseWithCustomTypes } from 'types';
import { fetchPostPerformanceData } from './api/iqdata/post-performance';
import { extractPlatformFromURL } from './extract-platform-from-url';
import type { ScrapeData } from './scraper/types';
import { db } from './supabase-client';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { InfluencerSocialProfileRow } from './api/db';
import { saveInfluencer } from './save-influencer';
import type { ServerContext } from './api/iqdata';
import { fetchReportWithContext as fetchReport } from './api/iqdata';

type ScrapeDataWithInfluencer = Omit<ScrapeData, 'influencer'> & {
    influencer: InfluencerSocialProfileRow;
    influencer_platform_id: string;
};

export const scrapeInfluencerPost = async (context: ServerContext, url: string): Promise<ScrapeDataWithInfluencer> => {
    const platform = extractPlatformFromURL(url) as CreatorPlatform;

    if (!platform) {
        throw new Error(`Cannot determine platform from given URL: ${url}`);
    }

    const scrape = (await fetchPostPerformanceData(context, platform, url)) as ScrapeData;

    const { influencer: influencer_platform_id, ...result } = scrape;

    // @todo refactor querys that are not (db: SupabaseClient) => async () => Promise<any>
    const getInfluencer = db((db: SupabaseClient<DatabaseWithCustomTypes>) => async (referenceId) => {
        const { data, error } = await db
            .from('influencer_social_profiles')
            .select()
            .match({
                // @todo add a "influencer_social_profiles.platform_id" that should point to the influencer's ID
                //      in a specific platform instead of relying on "reference_id"
                reference_id: `iqdata:${referenceId}`,
            })
            .maybeSingle();

        return !error ? data : null;
    });

    const socialProfile: InfluencerSocialProfileRow | null = await getInfluencer(influencer_platform_id);

    if (socialProfile === null) {
        const report = await fetchReport(context, influencer_platform_id, platform);

        if (!report) {
            throw new Error(`Cannot fetch report for influencer: ${influencer_platform_id}, ${platform}`);
        }

        const [_, socialProfile] = await db<typeof saveInfluencer>(saveInfluencer)(report);

        if (socialProfile === null) {
            throw new Error(`Cannot determine influencer from given URL: ${url}`);
        }

        return { ...result, influencer: socialProfile, influencer_platform_id };
    }

    return { ...result, influencer: socialProfile, influencer_platform_id };
};

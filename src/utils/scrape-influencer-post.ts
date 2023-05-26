import type { CreatorPlatform, DatabaseWithCustomTypes } from 'types';
import { fetchPostPerformanceData } from './api/iqdata/post-performance';
import { extractPlatformFromURL } from './extract-platform-from-url';
import type { ScrapeData } from './scraper/types';
import { db } from './supabase-client';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { InfluencerSocialProfileRow } from './api/db';
import { fetchReport } from './api/iqdata/fetch-report';
import { saveInfluencer } from './save-influencer';

type ScrapeDataWithInfluencer = Omit<ScrapeData, 'influencer'> & { influencer: InfluencerSocialProfileRow };

export const scrapeInfluencerPost = async (url: string): Promise<ScrapeDataWithInfluencer> => {
    const platform = extractPlatformFromURL(url) as CreatorPlatform;

    if (!platform) {
        throw new Error(`Cannot determine platform from given URL: ${url}`);
    }

    const scrape = (await fetchPostPerformanceData(platform, url)) as ScrapeData;

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
        const report = await fetchReport(influencer_platform_id, platform);

        if (!report) {
            throw new Error(`Cannot fetch report for influencer: ${influencer_platform_id}, ${platform}`);
        }

        const [_, socialProfile] = await saveInfluencer(report);

        if (socialProfile === null) {
            throw new Error(`Cannot determine influencer from given URL: ${url}`);
        }

        return { ...result, influencer: socialProfile };
    }

    return { ...result, influencer: socialProfile };
};

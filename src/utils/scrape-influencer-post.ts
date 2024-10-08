import type { CreatorPlatform } from 'types';
import type { InfluencerSocialProfileRow, RelayDatabase } from './api/db';
import type { ServerContext } from './api/iqdata';
import { fetchPostPerformanceData } from './api/iqdata/post-performance';
import { extractPlatformFromURL } from './extract-platform-from-url';
import type { ScrapeData } from './scraper/types';
import { db } from './supabase-client';

type ScrapeDataWithInfluencer = Omit<ScrapeData, 'influencer'> & {
    /**
     * The influencer social profile
     */
    influencer: InfluencerSocialProfileRow;
    /**
     * The influencer's id in that platform
     */
    influencer_platform_id: string;
};

export const scrapeInfluencerPost = async (url: string, context?: ServerContext): Promise<ScrapeDataWithInfluencer> => {
    const platform = extractPlatformFromURL(url) as CreatorPlatform;

    if (!platform) {
        throw new Error(`Cannot determine platform from given URL: ${url}`);
    }

    if (context && context.metadata) {
        context.metadata = { ...context.metadata, platform, action: 'fetchPostPerformanceData' };
    }

    const scrape = (await fetchPostPerformanceData(platform, url, context)) as ScrapeData;

    const { influencer: influencer_platform_id, ...result } = scrape;

    // @todo refactor querys that are not (db: SupabaseClient) => async () => Promise<any>
    const getInfluencer = db((db: RelayDatabase) => async (referenceId: string) => {
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
        throw new Error(`Cannot determine influencer from given URL: ${url}`);

        // @todo this seems to create duplicate rows in influencer_social
        // if (context && context.metadata) {
        //     context.metadata = { ...context.metadata, influencer_platform_id, action: 'fetchReport' };
        // }

        // const report = await fetchReport(influencer_platform_id, platform, context);

        // if (!report) {
        //     throw new Error(`Cannot fetch report for influencer: ${influencer_platform_id}, ${platform}`);
        // }

        // const [_, socialProfile] = await db<typeof saveInfluencer>(saveInfluencer)(report);

        // if (socialProfile === null) {
        //     throw new Error(`Cannot determine influencer from given URL: ${url}`);
        // }

        // return { ...result, influencer: socialProfile, influencer_platform_id };
    }

    return { ...result, influencer: socialProfile, influencer_platform_id };
};

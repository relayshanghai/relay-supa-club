import type { CreatorPlatform, DatabaseWithCustomTypes } from 'types';
import { fetchPostPerformanceData } from './api/iqdata/post-performance';
import { extractPlatformFromURL } from './extract-platform-from-url';
import type { ScrapeData } from './scraper/types';
import { db } from './supabase-client';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { InfluencerSocialProfileRow } from './api/db/calls/influencers';

type ScrapeDataWithInfluencer = Omit<ScrapeData, 'influencer'> & { influencer: InfluencerSocialProfileRow };

export const scrapeInfluencerPost = async (url: string): Promise<ScrapeDataWithInfluencer> => {
    const platform = extractPlatformFromURL(url) as CreatorPlatform;

    if (!platform) {
        throw new Error(`Cannot determine platform from given URL: ${url}`);
    }

    const result = (await fetchPostPerformanceData(platform, url)) as ScrapeDataWithInfluencer;

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

    const influencer: InfluencerSocialProfileRow | null = await getInfluencer(result.influencer);

    if (!influencer) {
        throw new Error(`Cannot determine influencer from given URL: ${url}`);
    }

    result.influencer = influencer;

    return result;
};

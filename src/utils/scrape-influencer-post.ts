import type { CreatorPlatform } from 'types';
import { fetchPostPerformanceData } from './api/iqdata/post-performance';
import { extractPlatformFromURL } from './extract-platform-from-url';

export const scrapeInfluencerPost = async (url: string) => {
    const platform = extractPlatformFromURL(url) as CreatorPlatform;

    if (!platform) {
        throw new Error('Cannot determine platform from given URL');
    }

    const result = await fetchPostPerformanceData(platform, url);

    return result;
};

import { nextFetch } from 'src/utils/fetcher';
import type { CreatorPlatform, CreatorSearchResult } from 'types';

const useSearchInfluencersByUsername = () => {
    const getInfluencerByUsername = async (
        username: string,
        platform: CreatorPlatform,
    ): Promise<CreatorSearchResult> => {
        if (!username) throw new Error('Username is required');
        const res = await nextFetch<CreatorSearchResult>(
            `influencer-search/username?username=${username}&platform=${platform}`,
            {
                method: 'GET',
            },
        );

        return res;
    };
    return {
        getInfluencerByUsername,
    };
};

export default useSearchInfluencersByUsername;

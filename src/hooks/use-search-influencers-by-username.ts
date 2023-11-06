import { nextFetch } from 'src/utils/fetcher';
import type { CreatorPlatform, CreatorSearchResult } from 'types';

const useSearchInfluencersByUsername = () => {
    const getInfluencerByUsername = async (
        username: string,
        platform: CreatorPlatform,
    ): Promise<CreatorSearchResult> => {
        if (!username) throw new Error('Username is required');
        return await nextFetch<CreatorSearchResult>(
            `influencer-search/username?${new URLSearchParams({ username, platform })}`,
            {
                method: 'GET',
            },
        );
    };
    return {
        getInfluencerByUsername,
    };
};

export default useSearchInfluencersByUsername;

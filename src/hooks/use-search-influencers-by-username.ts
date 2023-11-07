import { nextFetchWithQueries } from 'src/utils/fetcher';
import type { CreatorPlatform, CreatorSearchResult } from 'types';

const useSearchInfluencersByUsername = () => {
    const getInfluencerByUsername = async (
        username: string,
        platform: CreatorPlatform,
    ): Promise<CreatorSearchResult> => {
        if (!username) throw new Error('Username is required');
        return await nextFetchWithQueries<{ username: string; platform: CreatorPlatform }, CreatorSearchResult>(
            `influencer-search/username`,
            {
                username,
                platform,
            },
        );
    };
    return {
        getInfluencerByUsername,
    };
};

export default useSearchInfluencersByUsername;

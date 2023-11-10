import { nextFetchWithQueries } from 'src/utils/fetcher';
import type { CreatorPlatform, CreatorSearchByUsernameResult } from 'types';

const useSearchInfluencersByUsername = () => {
    const getInfluencerByUsername = async (
        username: string,
        platform: CreatorPlatform,
    ): Promise<CreatorSearchByUsernameResult> => {
        if (!username) throw new Error('Username is required');
        return await nextFetchWithQueries<
            { username: string; platform: CreatorPlatform },
            CreatorSearchByUsernameResult
        >(`influencer-search/username`, {
            username,
            platform,
        });
    };
    return {
        getInfluencerByUsername,
    };
};

export default useSearchInfluencersByUsername;

import { useApiClient } from 'src/utils/api-client/request';
import awaitToError from 'src/utils/await-to-error';
import { type CreatorDict } from 'types';

export const useSearchInfluencersByUsernameV2 = () => {
    const { apiClient } = useApiClient();
    const getInfluencerByUsername = async ({ platform, username }: { username: string; platform: string }) => {
        const [err, res] = await awaitToError(
            apiClient.get<CreatorDict>(`/v2/platform/${platform}/influencers/${username}/search`),
        );
        if (err) {
            return null;
        }
        return res.data;
    };
    return {
        getInfluencerByUsername,
    };
};

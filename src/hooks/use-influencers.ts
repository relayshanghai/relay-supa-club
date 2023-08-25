import type {
    PostUrl,
    InfluencerPostResponse,
    InfluencerPostPostResponse,
} from 'pages/api/influencer/[id]/posts-by-influencer';
import { apiFetch } from 'src/utils/api/api-fetch';
import { useAsync } from './use-async';
import { isApiError } from 'src/utils/is-api-error';

export const useInfluencers = () => {
    const getPosts = useAsync(async (id: string) => {
        return await apiFetch<InfluencerPostResponse>(`/api/influencer/{sequence_influencer_id}/posts-by-influencer`, {
            path: { sequence_influencer_id: id },
        }).then((res) => {
            if (res === undefined) throw new Error('Something went wrong');

            if (isApiError(res)) {
                throw new Error(res.error);
            }

            return res;
        });
    });

    const savePosts = useAsync(async (id: string, posts: PostUrl[]) => {
        return await apiFetch<InfluencerPostPostResponse>(
            `/api/influencer/{sequence_influencer_id}/posts-by-influencer`,
            {
                path: { sequence_influencer_id: id },
                body: { posts },
            },
        ).then((res) => {
            if (res === undefined) throw new Error('Something went wrong');

            if (isApiError(res)) {
                throw new Error(res.error);
            }

            return res;
        });
    });

    return {
        getPosts,
        savePosts,
    };
};

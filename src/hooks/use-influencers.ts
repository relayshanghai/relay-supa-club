import type {
    InfluencerPostPostResponse,
    InfluencerPostResponse,
    PostUrl,
} from 'pages/api/influencer/[id]/posts-by-influencer';
import { apiFetch } from 'src/utils/api/api-fetch';
import { isApiError } from 'src/utils/is-api-error';
import { useAsync } from './use-async';

export const useInfluencers = () => {
    const getPosts = useAsync(async (id: string) => {
        return await apiFetch<InfluencerPostResponse, any>(
            `/api/influencer/{sequence_influencer_id}/posts-by-influencer`,
            {
                path: { sequence_influencer_id: id },
            },
        ).then((res) => {
            if (isApiError(res.content)) {
                throw new Error(res.content.error);
            }

            return res.content;
        });
    });

    const savePosts = useAsync(async (id: string, posts: PostUrl[]) => {
        return await apiFetch<InfluencerPostPostResponse, any>(
            `/api/influencer/{sequence_influencer_id}/posts-by-influencer`,
            {
                path: { sequence_influencer_id: id },
                body: { posts },
            },
        ).then((res) => {
            if (isApiError(res.content)) {
                throw new Error(res.content.error);
            }

            return res.content;
        });
    });

    return {
        getPosts,
        savePosts,
    };
};

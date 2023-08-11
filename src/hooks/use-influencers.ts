import type { PostInfo } from 'pages/api/influencer/posts-sequence';
import type { PostUrl } from 'src/components/influencer-profile/components/collab-add-post-modal-form';
import { apiFetch } from 'src/utils/api/api-fetch';
import { useAsync } from './use-async';

export const useInfluencers = () => {
    const getPosts = useAsync(async (id: string) => {
        return await apiFetch<PostInfo[]>(`/api/influencer/{influencer_id}/posts-by-influencer`, {
            path: { influencer_id: id },
        });
    });

    const savePosts = useAsync(async (id: string, posts: PostUrl[]) => {
        return await apiFetch(`/api/save-posts`, {
            path: { influencer_id: id },
            body: { posts },
        });
    });

    return {
        getPosts,
        savePosts,
    };
};

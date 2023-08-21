import { useCallback } from 'react';
import { Spinner } from 'src/components/icons';
import { InfluencerPostRow } from './influencer-post-row';
import type { PostInfo } from 'pages/api/influencer/[id]/posts-by-influencer';

type Props = {
    isLoading?: boolean | null;
    // @todo consolidate PostInfo types
    posts: PostInfo[];
    onRemovePost?: (post: PostInfo) => void;
};

export const InfluencerPosts = (props: Props) => {
    const handleRemovePost = useCallback(
        (post: PostInfo) => {
            props.onRemovePost && props.onRemovePost(post);
        },
        [props],
    );

    if (props.isLoading) {
        return <Spinner className="mx-auto my-5 h-5 w-5 fill-gray-600 text-white" />;
    }

    if (props.posts.length <= 0) {
        return <div className="my-5 h-5">No Added Posts Yet</div>;
    }

    return (
        <>
            {props.posts.map((post: PostInfo) => (
                <div key={post.id} className="my-3 flex justify-between">
                    <InfluencerPostRow post={post} onRemove={handleRemovePost} />
                </div>
            ))}
        </>
    );
};

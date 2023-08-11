import i18n from 'i18n';
import Link from 'next/link';
import { useCallback } from 'react';
import type { PostInfo } from 'src/components/campaigns/add-post-modal';
import { Spinner, Trashcan } from 'src/components/icons';

type Props = {
    isLoading?: boolean | null;
    posts: PostInfo[];
    onRemovePost?: (post: PostInfo) => void;
};

type PropsX = {
    post: PostInfo;
    onRemove?: (post: PostInfo) => void;
};

export const InfluencerPostRow = (props: PropsX) => {
    const handleRemovePost = useCallback(() => {
        props.onRemove && props.onRemove(props.post);
    }, [props]);

    return (
        <>
            <Link className="w-fit gap-x-3" href={props.post.url} target="_blank" rel="noopener noreferrer">
                <h4 className="line-clamp-1 text-sm">{props.post.title}</h4>
                <p className="text-sm font-light text-gray-400">
                    {new Intl.DateTimeFormat(i18n.language, {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        timeZone: 'UTC',
                    }).format(new Date(props.post.postedDate))}
                </p>
            </Link>
            <button
                onClick={handleRemovePost}
                className="rounded-md border border-gray-200 bg-gray-100 p-2 text-center text-gray-800 outline-none hover:bg-gray-200"
            >
                <Trashcan className="h-4 w-4 fill-tertiary-600 hover:fill-primary-600" />
            </button>
        </>
    );
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

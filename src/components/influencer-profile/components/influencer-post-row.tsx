import i18n from 'i18n';
import Link from 'next/link';
import type { PostInfo } from 'pages/api/influencer/[id]/posts-by-influencer';
// import { useCallback } from 'react';

type Props = {
    post: PostInfo;
    onRemove?: (post: PostInfo) => void;
};

export const InfluencerPostRow = (props: Props) => {
    // const handleRemovePost = useCallback(() => {
    //     props.onRemove && props.onRemove(props.post);
    // }, [props]);

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
            {/* @todo disabled for now */}
            {/*<button
                onClick={handleRemovePost}
                className="rounded-md border border-gray-200 bg-gray-100 p-2 text-center text-gray-800 outline-none hover:bg-gray-200"
            >
                <Trashcan className="h-4 w-4 fill-tertiary-600 hover:fill-primary-600" />
            </button>*/}
        </>
    );
};

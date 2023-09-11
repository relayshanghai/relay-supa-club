import { useTranslation } from 'react-i18next';
import { imgProxy } from 'src/utils/fetcher';
import { numFormatter } from 'src/utils/utils';
import type { Post } from 'types';
import dateFormat from 'src/utils/dateFormat';

const preparePostStats = (stat: Post['stat']) => {
    const data = [];
    if (stat.likes) data.push({ label: 'likes', value: numFormatter(stat.likes) });
    if (stat.comments) data.push({ label: 'comments', value: numFormatter(stat.comments) });
    if (stat.views) data.push({ label: 'views', value: numFormatter(stat.views) });
    if (stat.shares) data.push({ label: 'shares', value: numFormatter(stat.shares) });
    return data;
};

function PostImage({ post }: { post: Post }) {
    const { t } = useTranslation();

    return (
        <div className="relative h-48">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-black to-transparent opacity-20" />
            <img
                src={post?.thumbnail ? imgProxy(post.thumbnail) : '/assets/imgs/image404.png'}
                alt="post"
                className="h-full w-full rounded-lg object-cover"
            />
            <a
                href={post?.video || post?.link}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-2 right-2 cursor-pointer rounded-md bg-gray-200 px-2 py-1 text-xs text-gray-600 duration-300 hover:bg-gray-300"
            >
                {t('creators.show.openLink')}
            </a>
            <div className="absolute left-2 top-2 flex items-center">
                <img
                    src={post?.user_picture ? imgProxy(post?.user_picture) : '/assets/imgs/image404.png'}
                    alt=""
                    className="mr-2 h-6 w-6 rounded-full"
                />
                {post?.username && <p className="text-sm text-white">@{post?.username}</p>}
            </div>
        </div>
    );
}

export const CreatorPost = ({ post }: { post: Post }) => {
    const { t } = useTranslation();

    const postStats = preparePostStats(post.stat);
    return (
        <div className="rounded-lg bg-white">
            <PostImage post={post} />
            <div className="p-4">
                <h3 className="mb-1 line-clamp-2 font-semibold text-gray-600">{post?.title || post?.text}</h3>
                <p className="mb-1 text-xs text-gray-400">
                    {
                        //@ts-ignore TODO: remove this insane hacky library and use standard browser API
                        dateFormat(post?.created)
                    }
                </p>
                <p className="mb-2 line-clamp-4 text-sm text-gray-600">{post?.text}</p>
                <div className="mb-2 flex flex-wrap items-center text-xs text-primary-600">
                    {post?.hashtags?.length &&
                        post?.hashtags.map((hashtag, index) => (
                            <p key={index} className="mr-2">
                                #{hashtag}
                            </p>
                        ))}
                </div>
                {postStats.length && (
                    <div className="grid grid-cols-3 gap-2">
                        {postStats.map((stat, index) => (
                            <div key={index} className="">
                                <p className="font-semibold text-primary-500">{stat.value}</p>
                                <p className="text-xs text-gray-600">{t(`creators.show.${stat.label}`)}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

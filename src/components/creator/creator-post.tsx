import { useTranslation } from 'react-i18next';
import { imgProxy } from 'src/utils/fetcher';
import { numFormatter } from 'src/utils/utils';
import { Post } from 'types';
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
        <div className="h-48 relative">
            <div className="bg-gradient-to-b from-black opacity-20 to-transparent absolute inset-0 rounded-lg" />
            <img
                src={post?.thumbnail ? imgProxy(post.thumbnail) : '/assets/imgs/image404.png'}
                alt="post"
                className="rounded-lg w-full h-full object-cover"
            />
            <a
                href={post?.video || post?.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-200 hover:bg-gray-300 duration-300 text-gray-600 absolute text-xs right-2 bottom-2 px-2 py-1 rounded-md cursor-pointer"
            >
                {t('creators.show.openLink')}
            </a>
            <div className="flex items-center absolute left-2 top-2">
                <img
                    src={
                        post?.user_picture
                            ? imgProxy(post?.user_picture)
                            : '/assets/imgs/image404.png'
                    }
                    alt=""
                    className="w-6 h-6 rounded-full mr-2"
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
        <div className="bg-white rounded-lg">
            <PostImage post={post} />
            <div className="p-4">
                <h3 className="font-semibold text-gray-600 mb-1 line-clamp-2">
                    {post?.title || post?.text}
                </h3>
                <p className="text-gray-400 text-xs mb-1">
                    {
                        //@ts-ignore TODO: remove this insane hacky library and use standard browser API
                        dateFormat(post?.created)
                    }
                </p>
                <p className="text-gray-600 text-sm mb-2 line-clamp-4">{post?.text}</p>
                <div className="text-xs text-primary-600 flex items-center flex-wrap mb-2">
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
                                <p className="text-primary-500 font-semibold">{stat.value}</p>
                                <p className="text-gray-600 text-xs">
                                    {t(`creators.show.${stat.label}`)}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

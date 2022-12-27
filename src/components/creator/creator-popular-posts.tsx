import { useTranslation } from 'react-i18next';

import type { CreatorReport, Post } from 'types';
import { CreatorPost } from './creator-post';

const Posts = ({ posts, title }: { posts: Post[]; title: string }) => {
    const postsList = posts.length > 4 ? posts.slice(0, 4) : posts;

    if (postsList.length === 0) return null;
    return (
        <div className="p-6">
            <h2 className="text-gray-600 font-semibold mb-2">{title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {postsList.map((post, index) => (
                    <CreatorPost key={index} post={post} />
                ))}
            </div>
        </div>
    );
};

export const PopularPostsSection = ({ report }: { report: CreatorReport }) => {
    const { t } = useTranslation();

    const topPosts = report.user_profile.top_posts;
    const recentPosts = report.user_profile.recent_posts;
    const commercialPosts = report.user_profile.commercial_posts;
    return (
        <>
            {topPosts?.length && <Posts posts={topPosts} title={t('creators.show.popularPosts')} />}
            {recentPosts?.length && (
                <Posts posts={recentPosts} title={t('creators.show.recentPosts')} />
            )}
            {commercialPosts?.length && (
                <Posts posts={commercialPosts} title={t('creators.show.commercialPosts')} />
            )}
        </>
    );
};

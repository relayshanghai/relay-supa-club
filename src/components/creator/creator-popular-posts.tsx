import { useTranslation } from 'react-i18next';

import type { CreatorReport } from 'types';
import { Posts } from './creator-posts';

export const PopularPostsSection = ({ report }: { report: CreatorReport }) => {
    const { t } = useTranslation();

    const topPosts = report.user_profile.top_posts;
    const recentPosts = report.user_profile.recent_posts;
    const commercialPosts = report.user_profile.commercial_posts;
    return (
        <>
            {topPosts?.length && <Posts posts={topPosts} title={t('creators.show.popularPosts')} />}
            {recentPosts?.length && <Posts posts={recentPosts} title={t('creators.show.recentPosts')} />}
            {commercialPosts?.length && <Posts posts={commercialPosts} title={t('creators.show.commercialPosts')} />}
        </>
    );
};

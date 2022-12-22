import { numFormatter } from 'src/utils/utils';
import { CreatorReport } from 'types';

export const formatStats = (userProfile: CreatorReport['user_profile']) => {
    const stats = [];
    if (userProfile?.geo)
        stats.push({
            label: 'country',
            descr: 'creatorLocation',
            icon: 'followers',
            data: userProfile.geo.country.name
        });
    if (userProfile?.geo && userProfile?.geo?.city)
        stats.push({
            label: 'city',
            descr: 'creatorLocation',
            icon: 'followers',
            data: userProfile.geo.city.name
        });
    if (userProfile?.followers)
        stats.push({
            label: 'followers',
            icon: 'followers',
            data: numFormatter(userProfile.followers)
        });
    if (userProfile?.total_views)
        stats.push({
            label: 'totViews',
            icon: 'views',
            data: numFormatter(userProfile.total_views)
        });
    if (userProfile?.avg_views)
        stats.push({
            label: 'avgViews',
            descr: 'avgViews',
            icon: 'views',
            data: numFormatter(userProfile.avg_views)
        });
    if (userProfile?.engagements)
        stats.push({
            label: 'engagements',
            icon: 'engagements',
            data: numFormatter(userProfile.engagements)
        });
    if (userProfile?.avg_likes)
        stats.push({
            label: 'avgLikes',
            descr: 'avgLikes',
            icon: 'likes',
            data: numFormatter(userProfile.avg_likes)
        });
    if (userProfile?.avg_comments)
        stats.push({
            label: 'avgComments',
            descr: 'avgComments',
            icon: 'engagements',
            data: numFormatter(userProfile.avg_comments)
        });
    if (userProfile?.engagement_rate)
        stats.push({
            label: 'engagementRate',
            descr: 'engRate',
            icon: 'engagements',
            data: (userProfile.engagement_rate * 100).toFixed(2)
        });
    return stats;
};

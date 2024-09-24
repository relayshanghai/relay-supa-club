import { numFormatter } from 'src/utils/utils';
import type { CreatorReport } from 'types';
import { Engagements, Followers, LikesFilled, Views } from '../icons';

export const formatStats = (userProfile: CreatorReport['user_profile']) => {
    const stats = [];
    if (userProfile?.geo)
        stats.push({
            label: 'country',
            descr: 'influencerLocation',
            icon: <Followers />,
            data: userProfile.geo.country.name,
        });
    if (userProfile?.geo && userProfile?.geo?.city)
        stats.push({
            label: 'city',
            descr: 'influencerLocation',
            icon: <Followers />,
            data: userProfile.geo.city.name,
        });
    if (userProfile?.followers)
        stats.push({
            label: 'followers',
            icon: <Followers />,
            data: numFormatter(userProfile.followers),
        });
    if (userProfile?.total_views)
        stats.push({
            label: 'totViews',
            icon: <Views />,
            data: numFormatter(userProfile.total_views),
        });
    if (userProfile?.avg_views || userProfile?.avg_reels_plays)
        stats.push({
            label: 'avgViews',
            descr: 'avgViews',
            icon: <Views />,
            data: numFormatter(userProfile.avg_views || userProfile.avg_reels_plays),
        });
    if (userProfile?.engagements)
        stats.push({
            label: 'engagements',
            icon: <Engagements />,
            data: numFormatter(userProfile.engagements),
        });
    if (userProfile?.avg_likes)
        stats.push({
            label: 'avgLikes',
            descr: 'avgLikes',
            icon: <LikesFilled />,
            data: numFormatter(userProfile.avg_likes),
        });
    if (userProfile?.avg_comments)
        stats.push({
            label: 'avgComments',
            descr: 'avgComments',
            icon: <Engagements />,
            data: numFormatter(userProfile.avg_comments),
        });
    if (userProfile?.engagement_rate)
        stats.push({
            label: 'engagementRate',
            descr: 'engRate',
            icon: <Engagements />,
            data: (userProfile.engagement_rate * 100).toFixed(2),
        });
    return stats;
};

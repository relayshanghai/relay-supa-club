import type { CreatorPlatform } from 'types';

export type ScrapeData = {
    likeCount: number;
    commentCount: number;
    viewCount: number;
    updatedAt: string;
    postedAt: string;
    platform: CreatorPlatform;
    url: string;
    influencer: string;
    __raw?: any;
};

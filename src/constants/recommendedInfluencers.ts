export const recommendedInfluencers = [
    'youtube/UCh_ugKacslKhsGGdXP0cRRA',
    'youtube/UCwyXamwtzfDIvRjEFcqNmSw',
    'youtube/UCpEhnqL0y41EpW2TvWAHD7Q',
    'instagram/25025320',
    'instagram/208560325',
    'youtube/UCbCmjCuTUZos6Inko4u57UQ',
];
export const isRecommendedInfluencer = (platform: string, user_id: string) =>
    recommendedInfluencers.includes(`${platform}/${user_id}`);

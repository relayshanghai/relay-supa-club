import { useRudderstack } from 'src/hooks/use-rudderstack';
import type { LocationWeighted } from 'types';

export const useSearchTrackers = () => {
    const { trackEvent } = useRudderstack();

    const trackWordCloudAddTag = async (item: { word: string }) => {
        trackEvent('WordCloud Component, Added tag from wordcloud', item);
    };
    const trackWordCloudRemoveTag = async (item: { word: string }) => {
        trackEvent('WordCloud Component, Removed tag from wordcloud', item);
    };
    const trackAudienceLocation = async (filter: { location: LocationWeighted[] }) => {
        trackEvent('Search Filter Modal, Set influencer location filter', filter);
    };
    const trackAudienceAgeFrom = async (age: { lower: string }) => {
        trackEvent('Search Filter Modal, Set audience lower age filter limit', age);
    };
    const trackAudienceAgeTo = async (age: { upper: string }) => {
        trackEvent('Search Filter Modal, Set audience upper age filter limit', age);
    };
    const trackAudienceAgeWeight = async (age: { weight: number }) => {
        trackEvent('Search Filter Modal, Set audience age filter weight', age);
    };
    const trackAudienceGender = async (gender: { code: string }) => {
        trackEvent('Search Filter Modal, Set audience gender filter', gender);
    };
    const trackAudienceGenderWeight = async (gender: { weight: number }) => {
        trackEvent('Search Filter Modal, Set audience gender filter weight', gender);
    };
    const trackInfluencerGender = async (gender: { code: string }) => {
        trackEvent('Search Filter Modal, Set influencer gender filter', gender);
    };
    const trackInfluencerGenderWeight = async (gender: { weight: number }) => {
        trackEvent('Search Filter Modal, Set influencer gender filter weight', gender);
    };
    const trackInfluencerHasEmail = async (contactInfo: { mode: string }) => {
        trackEvent('Search Filter Modal, Set influencer gender filter parameters', contactInfo);
    };
    const trackInfluencerLocation = async (filter: { location: LocationWeighted }) => {
        trackEvent('Search Filter Modal, Set influencer location filter', filter);
    };
    const trackInfluencerSubscribersFrom = async (filter: { subscribers: string }) => {
        trackEvent('Search Filter Modal, Set influencer subscribers filter lower limit', filter);
    };
    const trackInfluencerSubscribersTo = async (filter: { subscribers: string }) => {
        trackEvent('Search Filter Modal, Set influencer subscribers filter upper limit', filter);
    };
    const trackInfluencerEngagement = async (filter: { engagement_rate: string }) => {
        trackEvent('Search Filter Modal, change engagement rate', filter);
    };
    const trackInfluencerViewsFrom = async (filter: { views: string }) => {
        trackEvent('Search Filter Modal, Set influencer views filter lower limit', filter);
    };
    const trackInfluencerViewsTo = async (filter: { views: string }) => {
        trackEvent('Search Filter Modal, Set influencer views filter upper limit', filter);
    };
    const trackInfluencerLastPost = async (filter: { last_post: string }) => {
        trackEvent('Search Filter Modal, Set influencer last post filter', filter);
    };
    const trackKeyword = async (search: { keyword: string }) => {
        trackEvent('Search Options, Set keyword', { search });
    };
    const trackHashtags = async (search: { hashtags: string[] }) => {
        trackEvent('Search Options, Set keyword', { search });
    };
    const trackTopics = async (search: { tags: string[] }) => {
        trackEvent('Search Options, Set topics', { search });
    };
    return {
        trackWordCloudAddTag,
        trackWordCloudRemoveTag,
        trackAudienceLocation,
        trackAudienceAgeFrom,
        trackAudienceAgeTo,
        trackAudienceAgeWeight,
        trackAudienceGender,
        trackAudienceGenderWeight,
        trackInfluencerGender,
        trackInfluencerGenderWeight,
        trackInfluencerHasEmail,
        trackInfluencerLocation,
        trackInfluencerSubscribersFrom,
        trackInfluencerSubscribersTo,
        trackInfluencerEngagement,
        trackInfluencerViewsFrom,
        trackInfluencerViewsTo,
        trackInfluencerLastPost,
        trackKeyword,
        trackHashtags,
        trackTopics,
    };
};

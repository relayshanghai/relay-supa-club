import { useRudderstack } from 'src/hooks/use-rudderstack';

export const useSearchTrackers = () => {
    const { trackEvent } = useRudderstack();

    const trackWordCloudAddTag = async (item: { word: string }) => {
        trackEvent('WordCloud Component, Added tag from wordcloud', item);
    };
    const trackWordCloudRemoveTag = async (item: { word: string }) => {
        trackEvent('WordCloud Component, Removed tag from wordcloud', item);
    };
    const trackAudienceAgeFrom = async (age: { lower: string }) => {
        trackEvent('Search Options, Set audience lower age filter limit', age);
    };
    const trackAudienceAgeTo = async (age: { upper: string }) => {
        trackEvent('Search Options, Set audience upper age filter limit', age);
    };
    const trackAudienceAgeWeight = async (age: { weight: number }) => {
        trackEvent('Search Options, Set audience age filter weight', age);
    };
    const trackAudienceGender = async (gender: { code: string }) => {
        trackEvent('Search Options, Set audience gender filter', gender);
    };
    const trackAudienceGenderWeight = async (gender: { weight: number }) => {
        trackEvent('Search Options, Set audience gender filter weight', gender);
    };
    const trackInfluencerGender = async (gender: { code: string }) => {
        trackEvent('Search Options, Set influencer gender filter', gender);
    };
    const trackInfluencerGenderWeight = async (gender: { weight: number }) => {
        trackEvent('Search Options, Set influencer gender filter weight', gender);
    };
    const trackInfluencerHasEmail = async (contactInfo: { mode: string }) => {
        trackEvent('Search Options, Set influencer gender filter parameters', contactInfo);
    };
    const trackKeyword = async (search: { keyword: string }) => {
        trackEvent('Search Options, Set keyword', { search });
    };
    const trackHashtags = async (search: { hashtags: string[] }) => {
        trackEvent('Search Options, Set keyword', { search });
    };
    return {
        trackWordCloudAddTag,
        trackWordCloudRemoveTag,
        trackAudienceAgeFrom,
        trackAudienceAgeTo,
        trackAudienceAgeWeight,
        trackAudienceGender,
        trackAudienceGenderWeight,
        trackInfluencerGender,
        trackInfluencerGenderWeight,
        trackInfluencerHasEmail,
        trackKeyword,
        trackHashtags,
    };
};

import { useRudderstack } from 'src/hooks/use-rudderstack';
import { SEARCH_FILTER_MODAL, SEARCH_OPTIONS, WORD_CLOUD_COMPONENT } from 'src/utils/rudderstack/event-names';
import type { CreatorPlatform, CreatorSearchTag, LocationWeighted } from 'types';

export const useSearchTrackers = () => {
    const { trackEvent } = useRudderstack();
    const trackSearch = async (modal: string) => {
        trackEvent(`${modal}, Search`);
    };
    const trackClearFilters = async () => {
        trackEvent(SEARCH_FILTER_MODAL('Clear search filters'));
    };

    const trackCloseFilterModal = async () => {
        trackEvent(SEARCH_FILTER_MODAL('Close search filter modal'));
    };
    const trackWordCloudAddTag = async (item: CreatorSearchTag) => {
        trackEvent(WORD_CLOUD_COMPONENT('Added tag from wordcloud'), item);
    };
    const trackWordCloudRemoveTag = async (item: CreatorSearchTag) => {
        trackEvent(WORD_CLOUD_COMPONENT('Removed tag from wordcloud'), item);
    };
    const trackAudienceLocation = async (filter: { location: LocationWeighted[] }) => {
        trackEvent(SEARCH_FILTER_MODAL('Set influencer location filter'), filter);
    };
    const trackAudienceAgeFrom = async (age: { lower: string | undefined; weight: number }) => {
        trackEvent(SEARCH_FILTER_MODAL('Set audience lower age filter limit'), age);
    };
    const trackAudienceAgeTo = async (age: { upper: string | undefined; weight: number }) => {
        trackEvent(SEARCH_FILTER_MODAL('Set audience upper age filter limit'), age);
    };
    const trackAudienceAgeWeight = async (age: { weight: number }) => {
        trackEvent(SEARCH_FILTER_MODAL('Set audience age filter weight'), age);
    };
    const trackAudienceGender = async (gender: { code: string; weight: number } | undefined) => {
        trackEvent(SEARCH_FILTER_MODAL('Set audience gender filter'), gender);
    };
    const trackAudienceGenderWeight = async (gender: { weight: number }) => {
        trackEvent(SEARCH_FILTER_MODAL('Set audience gender filter weight'), gender);
    };
    const trackInfluencerGender = async (gender: { code: string }) => {
        trackEvent(SEARCH_FILTER_MODAL('Set influencer gender filter'), gender);
    };
    const trackInfluencerGenderWeight = async (gender: { weight: number }) => {
        trackEvent(SEARCH_FILTER_MODAL('Set influencer gender filter weight'), gender);
    };
    const trackInfluencerHasEmail = async (contactInfo: { mode: string }) => {
        trackEvent(SEARCH_FILTER_MODAL('Set influencer gender filter parameters'), contactInfo);
    };
    const trackInfluencerLocation = async (filter: { location: LocationWeighted[] }) => {
        trackEvent(SEARCH_FILTER_MODAL('Set influencer location filter'), filter);
    };
    const trackInfluencerSubscribersFrom = async (filter: { subscribers: string }) => {
        trackEvent(SEARCH_FILTER_MODAL('Set influencer subscribers filter lower limit'), filter);
    };
    const trackInfluencerSubscribersTo = async (filter: { subscribers: string }) => {
        trackEvent(SEARCH_FILTER_MODAL('Set influencer subscribers filter upper limit'), filter);
    };
    const trackInfluencerEngagement = async (filter: { engagement_rate: string }) => {
        trackEvent(SEARCH_FILTER_MODAL('change engagement rate'), filter);
    };
    const trackInfluencerViewsFrom = async (filter: { views: string }) => {
        trackEvent(SEARCH_FILTER_MODAL('Set influencer views filter lower limit'), filter);
    };
    const trackInfluencerViewsTo = async (filter: { views: string }) => {
        trackEvent(SEARCH_FILTER_MODAL('Set influencer views filter upper limit'), filter);
    };
    const trackInfluencerLastPost = async (filter: { last_post: string }) => {
        trackEvent(SEARCH_FILTER_MODAL('Set influencer last post filter'), filter);
    };
    const trackKeyword = async (search: { keyword: string }) => {
        trackEvent(SEARCH_OPTIONS('Set keyword'), { search });
    };
    const trackHashtags = async (search: { hashtags: string[] }) => {
        trackEvent(SEARCH_OPTIONS('Set hashtag'), { search });
    };
    const trackTopics = async (search: { tags: CreatorSearchTag[] }) => {
        trackEvent(SEARCH_OPTIONS('Set topics'), { search });
    };
    const trackSearchInfluencer = async (influencer: { term: string }, platform: CreatorPlatform) => {
        trackEvent(SEARCH_OPTIONS('search for an influencer'), { influencer, platform });
    };
    const trackPlatformChange = async (platform: CreatorPlatform) => {
        trackEvent(SEARCH_OPTIONS('change platform'), { platform });
    };
    return {
        trackPlatformChange,
        trackSearchInfluencer,
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
        trackSearch,
        trackClearFilters,
        trackCloseFilterModal,
    };
};

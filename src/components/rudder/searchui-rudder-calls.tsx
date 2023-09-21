import { useRudderstack } from 'src/hooks/use-rudderstack';
import { SEARCH_FILTER_MODAL, SEARCH_OPTIONS, WORD_CLOUD_COMPONENT } from 'src/utils/rudderstack/event-names';
import type { CreatorPlatform, CreatorSearchTag } from 'types';

export const useSearchTrackers = () => {
    const { trackEvent } = useRudderstack();
    const trackSearch = async (modal: string) => {
        trackEvent(`${modal}, Search`);
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
    const trackKeyword = async (search: { keyword: string }) => {
        trackEvent(SEARCH_OPTIONS('Set keyword'), { search });
    };
    const trackHashtags = async (search: { hashtags: string[] }) => {
        trackEvent(SEARCH_OPTIONS('Set hashtag'), { search });
    };
    const trackTopics = async (search: { tags: CreatorSearchTag[] }) => {
        trackEvent(SEARCH_OPTIONS('Set topics'), { search });
    };
    const trackPlatformChange = async (platform: CreatorPlatform) => {
        trackEvent(SEARCH_OPTIONS('change platform'), { platform });
    };
    return {
        trackPlatformChange,
        trackWordCloudAddTag,
        trackWordCloudRemoveTag,
        trackKeyword,
        trackHashtags,
        trackTopics,
        trackSearch,
        trackCloseFilterModal,
    };
};

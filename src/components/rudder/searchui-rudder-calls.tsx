import { useRudderstack } from 'src/hooks/use-rudderstack';
import { SEARCH_FILTER_MODAL, SEARCH_OPTIONS, WORD_CLOUD_COMPONENT } from 'src/utils/rudderstack/event-names';
import type { CreatorPlatform, CreatorSearchTag } from 'types';

export const useSearchTrackers = () => {
    const { trackEvent } = useRudderstack();
    const trackSearch = async (_modal: string, payload: any = {}) => {
        // Event names:
        // - Search Options, Search
        // - Search Filters Modal, Search
        trackEvent(`Search For Influencers`, { $add: { total_classic_searches: 1 }, ...payload });
    };
    const trackBoostbotSearch = async (_modal: string, payload: any = {}) => {
        trackEvent(`Search For Influencers`, { $add: { total_boostbot_searches: 1 }, ...payload });
    };
    const trackCloseFilterModal = async () => {
        trackEvent(SEARCH_FILTER_MODAL('Close search filter modal'));
    };
    const trackWordCloudAddTag = async ({
        item,
        search_topic,
        all_selected_topics,
    }: {
        item: CreatorSearchTag;
        search_topic: string;
        all_selected_topics: CreatorSearchTag[];
    }) => {
        // @note previous implementation of this event sends two props called `tag` and `value`
        // @note previous name: Word Cloud Component, Added tag from wordcloud
        trackEvent('Select TopicCloud Topic', {
            tag: item.tag,
            value: item.value,
            search_topic,
            all_selected_topics: all_selected_topics.map((v) => v.value),
        });
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
    const trackPlatformChange = async ({
        platform,
        current_platform,
    }: {
        platform: CreatorPlatform;
        current_platform: CreatorPlatform;
    }) => {
        // Search Options, change platform
        trackEvent('Change Targeted Platform', { platform, current_platform });
    };
    return {
        trackPlatformChange,
        trackWordCloudAddTag,
        trackWordCloudRemoveTag,
        trackKeyword,
        trackHashtags,
        trackTopics,
        trackSearch,
        trackBoostbotSearch,
        trackCloseFilterModal,
    };
};

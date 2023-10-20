// import { AdjustmentsVerticalIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';
import { useSearch } from 'src/hooks/use-search';
// import { numberFormatter } from 'src/utils/formatter';
import { Button } from '../button';
import SearchTopics from './search-topics';
import { Tooltip } from '../library';
// import { featRecommended } from 'src/constants/feature-flags';
import { getJourney } from 'src/utils/analytics/journey';
import { useState, useCallback } from 'react';
import WordCloudComponent from '../wordcloud';
import SearchKeywords from './search-keywords';
import SearchHashtags from './search-hashtags';
import { Question } from '../icons';
import { useSearchTrackers } from '../rudder/searchui-rudder-calls';
import { clientLogger } from 'src/utils/logger-client';
import { useCompany } from 'src/hooks/use-company';

export const SearchOptions = ({
    setPage,
    setShowFiltersModal,
    onSearch,
    searchType,
    onSearchTypeChange,
    setShowNeedHelpModal,
}: {
    setPage: (page: number) => void;
    setShowFiltersModal: (show: boolean) => void;
    onSearch: (...args: any[]) => any;
    searchType: string | null;
    onSearchTypeChange: (searchType: string) => void;
    setShowNeedHelpModal: (show: boolean) => void;
}) => {
    const { isExpired } = useCompany();
    const {
        platform,
        tags,
        setTopicTags,
        setActiveSearch,
        keywords,
        setKeywords,
        hashtags,
        setHashtags,
        getSearchParams,
    } = useSearch();
    const [keywordInput, setKeywordInput] = useState<string>('');
    const [hashTagInput, setHashTagInput] = useState<string>('');

    const { t } = useTranslation();
    const { trackSearch, trackKeyword, trackHashtags, trackTopics } = useSearchTrackers();

    const handleSearch = useCallback(
        (e: any) => {
            if (keywordInput.length > 0) {
                setKeywords(keywordInput);
                trackKeyword({
                    keyword: keywordInput,
                });
                setKeywordInput('');
            }

            e.preventDefault();
            setActiveSearch(true);
            setPage(0);

            const journey = getJourney();

            if (!journey) {
                clientLogger('Journey is undefined', 'error', true);
            }

            if (searchType && journey) {
                trackSearch('Search Options', {
                    search_type: searchType,
                    search_id: journey.id,
                });
            }

            onSearch({ searchParams: getSearchParams() });
        },
        [
            keywordInput,
            onSearch,
            setActiveSearch,
            setKeywords,
            setPage,
            trackKeyword,
            trackSearch,
            getSearchParams,
            searchType,
        ],
    );

    const handleKeywordsBlur = useCallback(
        (v: string | null) => {
            const keyword = v ?? '';

            if (keyword !== '' && tags.length > 0) {
                setTopicTags([]);
                trackTopics({ tags: [] }); // <- @note track clearing topics?
            }

            onSearchTypeChange('keyword');

            // @todo will cause an empty text_tag/hashtag item in the filter
            setHashtags([]);
            setHashTagInput('');

            // @note converts the SearchKeywords keywords to a "tag" ui
            setKeywords(keyword);
            trackKeyword({ keyword }); // <- @note should track only on search
        },
        [setKeywords, trackKeyword, trackTopics, setTopicTags, tags, setHashtags, onSearchTypeChange],
    );

    return (
        <>
            <div className="flex h-full  flex-row">
                <div className="flex w-full flex-col items-start justify-evenly space-y-2 py-4 font-light md:gap-x-4 md:gap-y-0">
                    <div data-testid="search-topics" className="flex h-full w-full flex-col justify-evenly">
                        <div className="flex place-items-center justify-between gap-1">
                            <div className="flex gap-1">
                                <p className="mb-2 text-sm font-semibold">{t('creators.searchTopicLabel')}</p>
                                <Tooltip
                                    content={t('tooltips.searchTopics.title')}
                                    detail={t('tooltips.searchTopics.description')}
                                    highlight={
                                        platform === 'youtube'
                                            ? t('tooltips.searchTopics.highlight')
                                            : t('tooltips.searchHashTags.highlight')
                                    }
                                    position="bottom-right"
                                    className="w-fit"
                                >
                                    <Question className="h-1/2 w-1/2 stroke-gray-400" />
                                </Tooltip>
                            </div>
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setShowNeedHelpModal(true);
                                    // track(ClickNeedHelp);
                                }}
                                className="mb-2 flex items-center"
                            >
                                {t('website.needHelp')}
                                <Question className="ml-2 h-6 w-6" />
                            </Button>
                        </div>
                        <div>
                            <SearchTopics
                                path="influencer-search/topics"
                                placeholder={t('creators.searchTopic')}
                                topics={tags}
                                platform={platform}
                                onChangeTopics={() => {
                                    if (hashtags.length !== 0) {
                                        setHashtags([]);
                                        trackHashtags({ hashtags: [] });
                                    }
                                    if (keywords.length !== 0) {
                                        setKeywords('');
                                        trackKeyword({ keyword: '' });
                                    }
                                    if (keywordInput.length !== 0) {
                                        setKeywordInput('');
                                        setHashTagInput('');
                                    }
                                }}
                                onSetTopics={(topics) => {
                                    onSearchTypeChange('topic');
                                    setTopicTags(topics);
                                    setHashtags([]);
                                    setHashTagInput('');
                                    trackTopics({ tags: topics });
                                }}
                            />
                        </div>
                    </div>
                    {platform === 'youtube' ? (
                        <div data-testid="search-keywords" className="flex h-full w-full flex-col justify-evenly">
                            <div className="flex gap-1">
                                <p className="mb-2 text-sm font-semibold">{t('creators.searchKeywordsLabel')}</p>
                                <Tooltip
                                    content={t('tooltips.searchKeywords.title')}
                                    detail={t('tooltips.searchKeywords.description')}
                                    highlight={t('tooltips.searchKeywords.highlight')}
                                    position="top-right"
                                    className="w-fit"
                                >
                                    <Question className="h-1/2 w-1/2 stroke-gray-400" />
                                </Tooltip>
                            </div>
                            <SearchKeywords
                                path="influencer-search/topics"
                                placeholder={t('creators.searchKeywords')}
                                value={keywords}
                                platform={platform}
                                onBlur={handleKeywordsBlur}
                            />
                        </div>
                    ) : (
                        <div data-testid="search-hashtags" className="flex h-full w-full flex-col justify-evenly">
                            <div className="flex gap-1">
                                <p className="mb-2 w-fit text-sm font-semibold">{t('creators.searchHashTagsLabel')}</p>
                                <Tooltip
                                    content={t('tooltips.searchHashTags.title')}
                                    detail={t('tooltips.searchHashTags.description')}
                                    highlight={t('tooltips.searchHashTags.highlight')}
                                    position="top-right"
                                    className="w-fit"
                                >
                                    <Question className="h-1/2 w-1/2 stroke-gray-400" />
                                </Tooltip>
                            </div>
                            <SearchHashtags
                                path="influencer-search/topics"
                                placeholder={t('creators.searchHashTags')}
                                hashTagInput={hashTagInput}
                                setHashTagInput={setHashTagInput}
                                hashtags={hashtags}
                                platform={platform}
                                onSetHashtags={(hashtags) => {
                                    onSearchTypeChange('keyword');
                                    setHashtags(hashtags);
                                    setKeywordInput('');
                                    setKeywords('');
                                    trackHashtags({ hashtags: hashtags });
                                }}
                                onChangeTopics={() => {
                                    tags.length !== 0 && setTopicTags([]);
                                    tags.length !== 0 && trackTopics({ tags: [] });
                                }}
                            />
                        </div>
                    )}
                    <div className="flex w-full justify-end">
                        <div className="my-4 grid w-fit grid-cols-2 items-center gap-4">
                            <button
                                data-testid="filters-button"
                                onClick={() => {
                                    setShowFiltersModal(true);
                                }}
                                className={`group col-span-1 items-center justify-center rounded-md border border-transparent bg-primary-100 px-2 py-1 text-sm font-semibold text-[#7C3AED] shadow ring-1 ring-gray-900 ring-opacity-5 focus:border-primary-500 focus:outline-none focus:ring-primary-500`}
                            >
                                <p className="w-full p-1">{t('creators.addFilters')}</p>
                            </button>
                            <Button
                                data-testid="search-button"
                                className="col-span-1 h-full"
                                onClick={(e) => {
                                    if (isExpired) {
                                        return;
                                    }
                                    handleSearch(e);
                                }}
                            >
                                {t('campaigns.index.search')}
                            </Button>
                        </div>
                    </div>
                </div>
                <WordCloudComponent tags={tags} platform={platform} updateTags={setTopicTags} />
            </div>
        </>
    );
};

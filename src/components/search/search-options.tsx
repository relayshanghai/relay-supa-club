// import { AdjustmentsVerticalIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';
import { useSearch } from 'src/hooks/use-search';
// import { numberFormatter } from 'src/utils/formatter';
import { Button } from '../button';
import SearchTopics from './search-topics';
import { Tooltip } from '../library';
// import { featRecommended } from 'src/constants/feature-flags';
import { useRudderstack } from 'src/hooks/use-rudderstack';
import { startJourney } from 'src/utils/analytics/journey';
import { useEffect, useState } from 'react';
import WordCloudComponent from '../wordcloud';
import SearchKeywords from './search-keywords';
import SearchHashtags from './search-hashtags';
import { Question } from '../icons';

export const SearchOptions = ({
    setPage,
    setShowFiltersModal,
}: {
    setPage: (page: number) => void;
    setShowFiltersModal: (show: boolean) => void;
}) => {
    const {
        platform,
        tags,
        setTopicTags,
        influencerLocation,
        audienceLocation,
        audience,
        audienceAge,
        audienceGender,
        views,
        gender,
        engagement,
        lastPost,
        username,
        contactInfo,
        // onlyRecommended,
        // setOnlyRecommended,
        // recommendedInfluencers,
        activeSearch,
        setActiveSearch,
        setSearchParams,
        keywords,
        setKeywords,
        hashtags,
        setHashtags,
    } = useSearch();
    const [keywordInput, setKeywordInput] = useState<string>('');
    const [hashTagInput, setHashTagInput] = useState<string>('');

    const { t } = useTranslation();
    const { trackEvent } = useRudderstack();

    const handleSearch = (e: any) => {
        keywordInput.length > 0 && setKeywords(keywordInput);
        trackEvent('Search Filter Modal, change keywords', {
            keywords: keywordInput,
        });
        setKeywordInput('');
        e.preventDefault();
        setActiveSearch(true);
        setPage(0);
        trackEvent('Search Options, search');
    };
    // TODO:comment out the related codes when feat recommended is ready
    useEffect(() => {
        if (activeSearch) {
            const params = {
                platform,
                tags,
                username,
                keywords,
                text_tags: hashtags.join(' '),
                influencerLocation,
                views,
                audience,
                gender,
                engagement,
                lastPost,
                contactInfo,
                audienceLocation,
                audienceAge,
                audienceGender,
                // recommendedInfluencers: featRecommended() ? recommendedInfluencers : [],
                // only_recommended: featRecommended() ? onlyRecommended : false,
            };

            startJourney('search');
            setSearchParams(params);
        }
    }, [
        activeSearch,
        platform,
        // onlyRecommended,
        setSearchParams,
        tags,
        keywords,
        hashtags,
        username,
        influencerLocation,
        views,
        audience,
        gender,
        engagement,
        lastPost,
        contactInfo,
        audienceLocation,
        audienceAge,
        audienceGender,
        // recommendedInfluencers,
    ]);

    return (
        <>
            <div className="flex h-full  flex-row">
                <div className="flex w-full flex-col items-start justify-evenly space-y-2 py-4 font-light md:gap-x-4 md:gap-y-0">
                    <div data-testid="search-topics" className="flex h-full w-full flex-col justify-evenly">
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
                        <div>
                            <SearchTopics
                                path="influencer-search/topics"
                                placeholder={t('creators.searchTopic')}
                                topics={tags}
                                platform={platform}
                                onChangeTopics={() => {
                                    hashtags.length !== 0 && setHashtags([]);
                                    keywords.length !== 0 && setKeywords('');
                                    keywordInput.length !== 0 && setKeywordInput('');
                                    hashTagInput.length !== 0 && setHashTagInput('');
                                }}
                                onSetTopics={(topics) => {
                                    setTopicTags(topics);
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
                                keywordInput={keywordInput}
                                setKeywordInput={setKeywordInput}
                                placeholder={t('creators.searchKeywords')}
                                keywords={keywords}
                                platform={platform}
                                onChangeTopics={() => {
                                    tags.length !== 0 && setTopicTags([]);
                                }}
                                onSetKeywords={(keywords) => {
                                    setKeywords(keywords);
                                }}
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
                                    setHashtags(hashtags);
                                }}
                                onChangeTopics={() => {
                                    tags.length !== 0 && setTopicTags([]);
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
                                    trackEvent('Search Filters Modal, open modal');
                                }}
                                className={`group col-span-1 items-center justify-center rounded-md border border-transparent bg-primary-100 px-2 py-1 text-sm font-semibold text-[#7C3AED] shadow ring-1 ring-gray-900 ring-opacity-5 focus:border-primary-500 focus:outline-none focus:ring-primary-500`}
                            >
                                <p className="w-full p-1">{t('creators.addFilters')}</p>
                            </button>
                            <Button data-testid="search-button" className="col-span-1" onClick={(e) => handleSearch(e)}>
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

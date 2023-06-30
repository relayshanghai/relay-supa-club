// import { AdjustmentsVerticalIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';
import { useSearch } from 'src/hooks/use-search';
// import { numberFormatter } from 'src/utils/formatter';
import { Button } from '../button';
import SearchTopics from './search-topics';
import { Tooltip } from '../library';
// import { featRecommended } from 'src/constants/feature-flags';
import { useRudderstack } from 'src/hooks/use-rudderstack';
import { useEffect } from 'react';
import WordCloudComponent from '../wordcloud';
import SearchKeywords from './search-keywords';
import SearchHashtags from './search-hashtags';

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

    const { t } = useTranslation();
    // const hasSetViews = views[0] || views[1];
    // const hasSetAudience = audience[0] || audience[1];
    const { trackEvent } = useRudderstack();

    const handleSearch = (e: any) => {
        e.preventDefault();
        setActiveSearch(true);
        setPage(0);
        trackEvent('Search Options, search');
    };
    // TODO:comment out the related codes when feat recommended is ready
    useEffect(() => {
        if (activeSearch) {
            setSearchParams({
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
            });
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
                        <Tooltip
                            content={t('tooltips.searchTopics.title')}
                            detail={t('tooltips.searchTopics.description')}
                            position="bottom-right"
                            className="w-fit"
                        >
                            <p className="mb-2 text-sm font-semibold">{t('creators.searchTopicLabel')}</p>
                        </Tooltip>
                        <div>
                            <SearchTopics
                                path="influencer-search/topics"
                                placeholder={t('creators.searchTopic')}
                                topics={tags}
                                platform={platform}
                                onSetTopics={(topics) => {
                                    setTopicTags(topics);
                                }}
                            />
                        </div>
                    </div>
                    {platform === 'youtube' ? (
                        <div data-testid="search-keywords " className="flex h-full w-full flex-col justify-evenly">
                            <Tooltip
                                content={t('tooltips.searchKeywords.title')}
                                detail={t('tooltips.searchKeywords.description')}
                                position="top-right"
                                className="w-fit"
                            >
                                <p className="mb-2 text-sm font-semibold">{t('creators.searchKeywordsLabel')}</p>
                            </Tooltip>
                            <SearchKeywords
                                path="influencer-search/topics"
                                placeholder={t('creators.searchKeywords')}
                                keywords={keywords}
                                platform={platform}
                                setKeywords={setKeywords}
                            />
                        </div>
                    ) : (
                        <div data-testid="search-hashtags " className="flex h-full w-full flex-col justify-evenly">
                            <Tooltip
                                content={t('tooltips.searchHashtags.title')}
                                detail={t('tooltips.searchHashtags.description')}
                                position="top-right"
                                className="w-fit"
                            >
                                <p className="mb-2 w-fit text-sm font-semibold">{t('creators.searchHashTagsLabel')}</p>
                            </Tooltip>
                            <SearchHashtags
                                path="influencer-search/topics"
                                placeholder={t('creators.searchHashTags')}
                                hashtags={hashtags}
                                platform={platform}
                                setHashtags={setHashtags}
                            />
                        </div>
                    )}
                    <div className="flex w-full justify-end">
                        <div className="my-4 grid w-fit grid-cols-2 items-center gap-4">
                            <button
                                onClick={() => {
                                    setShowFiltersModal(true);
                                    trackEvent('Search Filters Modal, open modal');
                                }}
                                className={`group col-span-1 items-center justify-center rounded-md border border-transparent bg-primary-100 px-2 py-1 text-sm font-semibold text-[#7C3AED] shadow ring-1 ring-gray-900 ring-opacity-5 focus:border-primary-500 focus:outline-none focus:ring-primary-500`}
                            >
                                <p className="w-full p-1">{t('creators.addFilters')}</p>
                            </button>
                            <Button className="col-span-1" onClick={(e) => handleSearch(e)}>
                                {t('campaigns.index.search')}
                            </Button>

                            {/* {featRecommended() && (
                                <div className="ml-auto">
                                    <Tooltip
                                        content={t('creators.recommendedTooltip')}
                                        detail={t('creators.recommendedTooltipDetail')}
                                        className="flex flex-wrap items-center"
                                        position="top-left"
                                    >
                                        <Switch
                                            disabled={!recommendedInfluencers || recommendedInfluencers.length === 0}
                                            data-testid="recommended-toggle"
                                            checked={onlyRecommended}
                                            onChange={(e) => {
                                                setOnlyRecommended(e.target.checked);
                                            }}
                                            beforeLabel="Recommended only"
                                        />
                                    </Tooltip>
                                </div>
                            )} */}
                        </div>
                    </div>
                </div>
                <WordCloudComponent tags={tags} platform={platform} updateTags={(newTags) => setTopicTags(newTags)} />
            </div>
        </>
    );
};

import { AdjustmentsVerticalIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';
import { useSearch } from 'src/hooks/use-search';
import { numberFormatter } from 'src/utils/formatter';
import { Button } from '../button';
import SearchTopics from './search-topics';
import { Switch, Tooltip } from '../library';
import { featRecommended } from 'src/constants/feature-flags';
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
        setAudience,
        audienceAge,
        audienceGender,
        views,
        setViews,
        gender,
        setGender,
        engagement,
        setEngagement,
        lastPost,
        setLastPost,
        setContactInfo,
        username,
        contactInfo,
        onlyRecommended,
        setOnlyRecommended,
        recommendedInfluencers,
        activeSearch,
        setActiveSearch,
        setSearchParams,
        keywords,
        setKeywords,
        hashtags,
        setHashtags,
    } = useSearch();

    const { t } = useTranslation();
    const hasSetViews = views[0] || views[1];
    const hasSetAudience = audience[0] || audience[1];
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
                hashtags,
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
            <div className="flex h-full basis-1/2 flex-row">
                <div className="flex w-full  flex-col items-start justify-between space-y-2 py-4 font-light md:gap-x-4 md:gap-y-0">
                    <div data-testid="search-topics" className="w-full">
                        <p className="mb-2 text-sm font-semibold">Topic Relevance</p>
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
                    {platform === 'youtube' ? (
                        <div data-testid="search-keywords " className="w-full">
                            <p className="mb-2 text-sm font-semibold">Add keywords</p>
                            <SearchKeywords
                                path="influencer-search/topics"
                                placeholder={t('creators.searchKeyword')}
                                keywords={keywords}
                                platform={platform}
                                setKeywords={setKeywords}
                            />
                        </div>
                    ) : (
                        <div data-testid="search-hashtags " className="w-full">
                            <p className="mb-2 text-sm font-semibold">Add #hashtags</p>
                            <SearchHashtags
                                path="influencer-search/topics"
                                placeholder={t('creators.searchHashtags')}
                                hashtags={hashtags}
                                platform={platform}
                                setHashtags={setHashtags}
                            />
                        </div>
                    )}
                    <div className="w-full ">
                        <div className="my-4 flex flex-row items-center justify-between">
                            <button
                                onClick={() => {
                                    setShowFiltersModal(true);
                                    trackEvent('Search Filters Modal, open modal');
                                }}
                                className={`group flex flex-row items-center rounded-md border border-transparent bg-primary-100 px-2 py-1 text-sm font-semibold text-[#7C3AED] shadow ring-1 ring-gray-900 ring-opacity-5 focus:border-primary-500 focus:outline-none focus:ring-primary-500`}
                            >
                                <AdjustmentsVerticalIcon
                                    className={`mr-2 h-6 w-6 transition duration-150 ease-in-out group-hover:text-opacity-80`}
                                    aria-hidden="true"
                                />
                                Add filters to tailor your results
                                <div className="flex flex-row space-x-5 text-xs">
                                    {hasSetAudience && (
                                        <p>
                                            {`${t('creators.filter.subs')}: ${
                                                audience[0] ? numberFormatter(audience[0]) : 0
                                            } - ${
                                                audience[1] ? numberFormatter(audience[1]) : t('creators.filter.max')
                                            }`}
                                        </p>
                                    )}
                                    {hasSetViews && (
                                        <p>
                                            {`${t('creators.filter.avgViews')}: ${
                                                views[0] ? numberFormatter(views[0]) : 0
                                            } - ${views[1] ? numberFormatter(views[1]) : t('creators.filter.max')}`}
                                        </p>
                                    )}
                                    {gender && <p>{t(`creators.filter.${gender}`)}</p>}
                                    {engagement && <p>{`${t('creators.filter.engagement')}: >${engagement}%`}</p>}
                                    {lastPost && (
                                        <p>{`${t('creators.filter.lastPost')}: ${lastPost} ${t(
                                            'creators.filter.days',
                                        )}`}</p>
                                    )}
                                </div>
                            </button>
                            <Button className="mx-2" onClick={(e) => handleSearch(e)}>
                                {t('campaigns.index.search')}
                            </Button>
                            {hasSetViews || hasSetAudience || gender || engagement || lastPost ? (
                                <Button
                                    onClick={(e: any) => {
                                        e.preventDefault();
                                        setAudience([null, null]);
                                        setViews([null, null]);
                                        setGender(undefined);
                                        setEngagement(undefined);
                                        setLastPost(undefined);
                                        setContactInfo(undefined);
                                        trackEvent('Search Filters Modal, clear search filters');
                                    }}
                                    variant="secondary"
                                >
                                    {t('creators.clearFilter')}
                                </Button>
                            ) : null}
                            {featRecommended() && (
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
                            )}
                        </div>
                    </div>
                </div>
                <WordCloudComponent tags={tags} platform={platform} updateTags={(newTags) => setTopicTags(newTags)} />
            </div>
        </>
    );
};

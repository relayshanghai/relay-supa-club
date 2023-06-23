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
        audienceAge,
        audienceGender,
        views,
        gender,
        engagement,
        lastPost,
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
                        <Tooltip
                            content="Topics"
                            detail="Topics are created and applied to the influencer account through analysis of their content over time. We will return Influencers most relevant to the topics you search for."
                            position="bottom-right"
                        >
                            <p className="mb-2 text-sm font-semibold">Topic Relevance</p>
                        </Tooltip>
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
                            <Tooltip
                                content="Keyword or Phrase"
                                detail="We search through youtube video transcripts to add influencers that have used these words or phrases in recent videos in your results. Try using a word or phrase influencers would actually say to get more results."
                                position="top-right"
                            >
                                <p className="mb-2 text-sm font-semibold">Add keywords</p>
                            </Tooltip>
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
                            <Tooltip
                                content="Hashtags"
                                detail="We will add influencers who have used your hashtags in their recent post descriptions to your search results."
                                position="top-right"
                            >
                                <p className="mb-2 text-sm font-semibold">Add #hashtags (max 10)</p>
                            </Tooltip>
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

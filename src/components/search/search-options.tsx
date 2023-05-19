import { AdjustmentsVerticalIcon } from '@heroicons/react/24/solid';

import { useTranslation } from 'react-i18next';
import { useSearch } from 'src/hooks/use-search';
import { numberFormatter } from 'src/utils/formatter';
import { Button } from '../button';
import { SearchCreators } from './search-creators';
import SearchTopics from './search-topics';
import { Switch, Tooltip } from '../library';
import { featRecommended } from 'src/constants/feature-flags';
import { SearchLocations } from './search-locations';
import LocationTag from './location-tag';
import { useRudderstack } from 'src/hooks/use-rudderstack';
import { useEffect } from 'react';
// const resultsPerPageOptions = [10, 20, 50, 100];

const filterCountry = (items: any[]) => {
    return items.filter((item: any) => {
        return item.type?.[0] === 'country';
    });
};

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
        setInfluencerLocation,
        audienceLocation,
        setAudienceLocation,
        audience,
        setAudience,
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
        // resultsPerPageLimit,
        // setResultsPerPageLimit,
        onlyRecommended,
        setOnlyRecommended,
        recommendedInfluencers,
        activeSearch,
        setActiveSearch,
        setSearchParams,
    } = useSearch();

    const { t } = useTranslation();
    const hasSetViews = views[0] || views[1];
    const hasSetAudience = audience[0] || audience[1];
    const { trackEvent } = useRudderstack();

    const handleSearch = (e: any) => {
        e.preventDefault();
        setActiveSearch(true);
        setPage(0);
        // trackEvent('Search Options, search');
    };

    useEffect(() => {
        if (activeSearch) {
            setSearchParams({
                platform,
                tags,
                username,
                influencerLocation,
                views,
                audience,
                gender,
                engagement,
                lastPost,
                contactInfo,
                audienceLocation,
                only_recommended: onlyRecommended,
                recommendedInfluencers,
            });
        }
    }, [
        activeSearch,
        platform,
        onlyRecommended,
        setSearchParams,
        tags,
        username,
        influencerLocation,
        views,
        audience,
        gender,
        engagement,
        lastPost,
        contactInfo,
        audienceLocation,
        recommendedInfluencers,
    ]);

    return (
        <>
            <div className="flex w-full flex-col items-start space-y-2 py-4 font-light md:flex-row md:space-x-4 md:space-y-0">
                <div data-testid="search-topics" className="w-full">
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
                <div className="w-full">
                    <SearchCreators platform={platform} />
                </div>
            </div>
            <div className="flex flex-col items-start space-y-2 md:flex-row md:space-x-4 md:space-y-0">
                <SearchLocations
                    path="influencer-search/locations"
                    placeholder={t('creators.filter.locationPlaceholder')}
                    locations={influencerLocation}
                    platform={platform}
                    filter={filterCountry}
                    onSetLocations={(topics) => {
                        setInfluencerLocation(topics);
                        trackEvent('Search Options, search influencer location', { location: topics });
                    }}
                />
                <SearchLocations
                    path="influencer-search/locations"
                    placeholder={t('creators.filter.audienceLocation')}
                    locations={audienceLocation}
                    platform={platform}
                    filter={filterCountry}
                    onSetLocations={(topics) => {
                        setAudienceLocation(topics.map((item) => ({ ...item, weight: 5 })));
                        trackEvent('Search Options, search audience location', { location: topics });
                    }}
                    TagComponent={LocationTag}
                />
            </div>
            <div>
                <div className="flex flex-row items-center">
                    <button
                        onClick={() => {
                            setShowFiltersModal(true);
                            trackEvent('Search Filters Modal, open modal');
                        }}
                        className={`group flex flex-row items-center rounded-md border border-transparent bg-white px-2 py-1 text-gray-900 shadow ring-1 ring-gray-900 ring-opacity-5 focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm`}
                    >
                        <AdjustmentsVerticalIcon
                            className={`mr-2 h-6 w-6 text-gray-400 transition duration-150 ease-in-out group-hover:text-opacity-80`}
                            aria-hidden="true"
                        />
                        <div className="flex flex-row space-x-5 text-xs">
                            {hasSetAudience && (
                                <p>
                                    {`${t('creators.filter.subs')}: ${
                                        audience[0] ? numberFormatter(audience[0]) : 0
                                    } - ${audience[1] ? numberFormatter(audience[1]) : t('creators.filter.max')}`}
                                </p>
                            )}
                            {hasSetViews && (
                                <p>
                                    {`${t('creators.filter.avgViews')}: ${views[0] ? numberFormatter(views[0]) : 0} - ${
                                        views[1] ? numberFormatter(views[1]) : t('creators.filter.max')
                                    }`}
                                </p>
                            )}
                            {gender && <p>{t(`creators.filter.${gender}`)}</p>}
                            {engagement && <p>{`${t('creators.filter.engagement')}: >${engagement}%`}</p>}
                            {lastPost && (
                                <p>{`${t('creators.filter.lastPost')}: ${lastPost} ${t('creators.filter.days')}`}</p>
                            )}
                        </div>
                    </button>
                    <Button className="mx-2" onClick={(e) => handleSearch(e)}>
                        {t('campaigns.index.search')}
                    </Button>
                    {/* Hide Select Option of results per page, default now set to 10 */}
                    {/* <select
                        className="ml-4 mr-2 flex cursor-pointer flex-row items-center rounded-md border border-transparent bg-white p-1 text-gray-900 shadow ring-1 ring-gray-900 ring-opacity-5 hover:text-opacity-80 focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                        value={resultsPerPageLimit}
                        onChange={(e) => {
                            setPage(0);
                            setResultsPerPageLimit(Number(e.target.value));
                            trackEvent('Search Filters Modal, change search results per page', {
                                resultsPerPage: e.target.value,
                            });
                        }}
                    >
                        {resultsPerPageOptions.map((option) => (
                            <option value={option} key={option}>
                                {numberFormatter(option)}
                            </option>
                        ))}
                    </select> */}
                    {/* <p className="mx-2 text-xs text-gray-500"> 10 {t('creators.resultsPerPage')}</p> */}
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
        </>
    );
};

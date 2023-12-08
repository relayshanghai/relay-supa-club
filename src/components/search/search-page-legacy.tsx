import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'src/components/button';
import { AddToCampaignModal } from 'src/components/modal-add-to-campaign';
import { IQDATA_MAINTENANCE } from 'src/constants';
import { useAllCampaignCreators } from 'src/hooks/use-all-campaign-creators';
import { useCampaigns } from 'src/hooks/use-campaigns';
import { useRudderstack } from 'src/hooks/use-rudderstack';
import { SearchProvider, useSearch, useSearchResults } from 'src/hooks/use-search';
import { Search, SearchAddToCampaign, SearchDefault } from 'src/utils/analytics/events';
import { startJourney } from 'src/utils/analytics/journey';
import { numberFormatter } from 'src/utils/formatter';
import { SEARCH_RESULT } from 'src/utils/rudderstack/event-names';
import { useAnalytics } from '../analytics/analytics-provider';
import { InfluencerAlreadyAddedModal } from '../influencer-already-added';
import { Layout } from '../layout';
import { MaintenanceMessage } from '../maintenance-message';
import ClientRoleWarning from './client-role-warning';
import { SearchCreators } from './search-creators';
import { SearchFiltersModal } from './search-filters-modal';
import { SearchOptions } from './search-options';
import { MoreResultsRows } from './search-result-row';
import { SearchResultsTable } from './search-results-table';
import { SelectPlatform } from './search-select-platform';
import { useTrackEvent } from './use-track-event';

import { useAllSequenceInfluencersIqDataIdAndSequenceName } from 'src/hooks/use-all-sequence-influencers-iqdata-id-and-sequence';
import { clientLogger } from 'src/utils/logger-client';
import { Banner } from '../library/banner';
import { useCompany } from 'src/hooks/use-company';
import { randomNumber } from 'src/utils/utils';
// import { featRecommended } from 'src/constants/feature-flags';

import { FaqModal } from '../library';
import discoveryfaq from 'i18n/en/discovery-faq';
import { useRouter } from 'next/router';
import type { SearchTableInfluencer as ClassicSearchInfluencer } from 'types';

export const SearchPageInner = () => {
    const { t } = useTranslation();

    const {
        platform,
        searchParams,
        setSearchParams,
        // recommendedInfluencers,
        // onlyRecommended,
        setAudience,
        setViews,
        setGender,
        setEngagement,
        setLastPost,
        setContactInfo,
        setTopicTags,
        setInfluencerLocation,
        setAudienceLocation,
    } = useSearch();
    const [filterModalOpen, setShowFiltersModal] = useState(false);
    const [needHelpModalOpen, setShowNeedHelpModal] = useState(false);
    const [showCampaignListModal, setShowCampaignListModal] = useState(false);
    const [selectedCreator, setSelectedCreator] = useState<ClassicSearchInfluencer | null>(null);
    const { campaigns } = useCampaigns({});
    const { allCampaignCreators } = useAllCampaignCreators(campaigns);
    const { allSequenceInfluencersIqDataIdsAndSequenceNames } = useAllSequenceInfluencersIqDataIdAndSequenceName();
    const { trackEvent } = useRudderstack();
    const [batchId, setBatchId] = useState(() => randomNumber());
    const [page, setPage] = useState(0);
    const {
        results: firstPageSearchResults,
        resultsTotal,
        noResults,
        error,
        isValidating,
        loading: resultsLoading,
        metadata,
        setOnLoad,
    } = useSearchResults(0);

    const { track: trackAnalytics } = useAnalytics();
    const { track } = useTrackEvent();

    const [rendered, setRendered] = useState(false);
    const [searchType, setSearchType] = useState<string | null>(null);

    const handleSearchTypeChange = useCallback(
        (searchType: string) => {
            if (!searchType) {
                clientLogger('Cannot determine search type', 'error', true);
            }
            setSearchType(searchType);
        },
        [setSearchType],
    );

    const { push } = useRouter();

    /**
     * Handle the SearchOptions.onSearch event
     */
    const handleSearch = useCallback(
        ({ searchParams }: { searchParams: any }) => {
            if (searchParams === undefined) return;

            const tracker = (results: any) => {
                setBatchId(randomNumber());

                return track({
                    event: Search,
                    payload: {
                        event_id: results.__metadata?.event_id,
                        snapshot_id: results.__metadata?.snapshot_id,
                        parameters_id: results.__metadata?.parameters_id,
                        parameters: searchParams,
                        page: searchParams.page,
                    },
                });
            };

            setOnLoad(() => tracker);

            // @note this triggers the search api call
            setSearchParams(searchParams);
        },
        [track, setSearchParams, setOnLoad, setBatchId],
    );

    /**
     * Tracks a SearchDefault event on render
     */
    useEffect(() => {
        if (rendered === true) return;

        if (metadata === undefined || searchParams === undefined) return;

        if (searchParams.page && searchParams.page !== 0) return;

        const controller = new AbortController();

        const tracker = async (result: any) => {
            return track<typeof SearchDefault>({
                event: SearchDefault,
                controller,
                payload: {
                    event_id: result.__metadata?.event_id,
                    snapshot_id: result.__metadata?.snapshot_id,
                    parameters_id: result.__metadata?.parameters_id,
                    parameters: searchParams,
                    page: searchParams.page,
                },
            }).then((response) => {
                if (response && !controller.signal.aborted) {
                    setRendered(true);
                }
                return response;
            });
        };

        setOnLoad(() => tracker);

        return () => controller.abort();
    }, [track, setOnLoad, searchParams, metadata, rendered]);

    const [showAlreadyAddedModal, setShowAlreadyAddedModal] = useState(false);

    // Automatically start a journey on render
    useEffect(() => {
        startJourney('search');
    }, []);

    // TODO:comment out the related codes when feat recommended is ready
    // @note: this causes rerender, searchParams value should be initiated in the useState
    useEffect(() => {
        setSearchParams({
            page: 0,
            platform,
            username: '',
            text: '',
            views: [null, null],
            audience: [null, null],
            // recommendedInfluencers: featRecommended() ? recommendedInfluencers : [],
            // only_recommended: featRecommended() ? onlyRecommended : false,
        });
    }, [platform, setSearchParams]);

    useEffect(() => {
        setAudience([null, null]);
        setViews([null, null]);
        setGender(undefined);
        setEngagement(undefined);
        setLastPost(undefined);
        setContactInfo(undefined);
        setTopicTags([]);
        setInfluencerLocation([]);
        setAudienceLocation([]);
        setPage(0);
    }, [
        platform,
        setAudience,
        setAudienceLocation,
        setContactInfo,
        setEngagement,
        setGender,
        setInfluencerLocation,
        setLastPost,
        setTopicTags,
        setViews,
    ]);
    return (
        <div className="p-6">
            <ClientRoleWarning />
            <div className="flex justify-between">
                <SelectPlatform />
                <div className="w-fit">
                    <SearchCreators />
                </div>
            </div>
            <SearchOptions
                setPage={setPage}
                setShowFiltersModal={setShowFiltersModal}
                onSearch={handleSearch}
                searchType={searchType}
                onSearchTypeChange={handleSearchTypeChange}
                setShowNeedHelpModal={setShowNeedHelpModal}
            />

            <div className="flex items-center justify-between">
                <div className="text-sm font-medium">{`${t('creators.resultsPrefix')} ${numberFormatter(
                    resultsTotal,
                )} ${
                    platform === 'youtube' ? t('creators.resultsPostfixKeywords') : t('creators.resultsPostfixHashtags')
                }`}</div>
            </div>
            <SearchResultsTable
                setSelectedCreator={setSelectedCreator}
                setShowCampaignListModal={setShowCampaignListModal}
                setShowAlreadyAddedModal={setShowAlreadyAddedModal}
                allCampaignCreators={allCampaignCreators}
                allSequenceInfluencersIqDataIdsAndSequenceNames={allSequenceInfluencersIqDataIdsAndSequenceNames}
                loading={resultsLoading}
                validating={isValidating}
                results={firstPageSearchResults}
                error={error}
                batchId={batchId}
                moreResults={
                    <>
                        {new Array(page).fill(0).map((_, i) => (
                            <MoreResultsRows
                                key={i}
                                page={i + 1}
                                setSelectedCreator={setSelectedCreator}
                                setShowCampaignListModal={setShowCampaignListModal}
                                setShowAlreadyAddedModal={setShowAlreadyAddedModal}
                                allCampaignCreators={allCampaignCreators}
                                trackSearch={track}
                                batchId={batchId}
                                resultIndex={i}
                            />
                        ))}
                    </>
                }
            />
            {!noResults && (
                <Button
                    onClick={async () => {
                        const nextPage = page + 1;
                        setPage(nextPage);
                        trackEvent(SEARCH_RESULT('load more'));
                    }}
                >
                    {t('creators.loadMore')}
                </Button>
            )}

            <AddToCampaignModal
                show={showCampaignListModal}
                setShow={setShowCampaignListModal}
                platform={platform}
                selectedCreator={selectedCreator}
                campaigns={campaigns}
                allCampaignCreators={allCampaignCreators}
                track={(campaign: string) => {
                    // @todo ideally we would want this to use useTrackEvent.track
                    selectedCreator &&
                        trackAnalytics(SearchAddToCampaign, {
                            creator: selectedCreator,
                            campaign: campaign,
                        });
                }}
            />
            <InfluencerAlreadyAddedModal
                show={showAlreadyAddedModal}
                setCampaignListModal={setShowCampaignListModal}
                setShow={setShowAlreadyAddedModal}
                selectedCreatorUserId={selectedCreator?.user_id}
                campaigns={campaigns}
                allCampaignCreators={allCampaignCreators}
            />

            <SearchFiltersModal
                show={filterModalOpen}
                setShow={setShowFiltersModal}
                onSearch={handleSearch}
                searchType={searchType}
            />
            <FaqModal
                title={t('discoveryfaq.discoveryfaqTitle')}
                description=""
                visible={needHelpModalOpen}
                onClose={() => setShowNeedHelpModal(false)}
                content={discoveryfaq.discovery.map((_, i) => ({
                    title: t(`discoveryfaq.discovery.${i}.title`),
                    detail: t(`discoveryfaq.discovery.${i}.detail`),
                }))}
                getMoreInfoButtonText={t(`discoveryfaq.discoveryGetMoreInfo`) || ''}
                getMoreInfoButtonAction={() => push('/guide')}
                source="Discovery"
            />
        </div>
    );
};

export const SearchPage = () => {
    const { isExpired } = useCompany();

    const { t } = useTranslation();
    return (
        <Layout>
            {isExpired && (
                <Banner
                    buttonText={t('banner.button')}
                    title={t('banner.expired.title')}
                    message={t('banner.expired.description')}
                />
            )}
            {IQDATA_MAINTENANCE ? (
                <MaintenanceMessage />
            ) : (
                <div className="flex flex-col">
                    <SearchProvider>
                        <SearchPageInner />
                    </SearchProvider>
                </div>
            )}
        </Layout>
    );
};

export default SearchPage;

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
import { SelectPlatform } from './search-select-platform';
import { useTrackEvent } from './use-track-event';

import { clientLogger } from 'src/utils/logger-client';
import { Banner } from '../library/banner';
import { useCompany } from 'src/hooks/use-company';
import { randomNumber } from 'src/utils/utils';
// import { featRecommended } from 'src/constants/feature-flags';

import { FaqModal } from '../library';
import discoveryfaq from 'i18n/en/discovery-faq';
import { useRouter } from 'next/router';
import { classicColumns } from '../boostbot/table/columns';
import { InfluencersTable } from '../boostbot/table/influencers-table';
import type { Row } from '@tanstack/react-table';
import { usePersistentState } from 'src/hooks/use-persistent-state';
import { useSequences } from 'src/hooks/use-sequences';
import { useSequenceInfluencers } from 'src/hooks/use-sequence-influencers';
import { AddToSequenceButton } from '../boostbot/add-to-sequence-button';
import type { ClassicSearchInfluencer } from 'pages/api/influencer-search';
import { InfluencerDetailsModal } from '../boostbot/modal-influencer-details';

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
    const [selectedCreator, _setSelectedCreator] = useState<ClassicSearchInfluencer | null>(null);
    const { campaigns } = useCampaigns({});
    const { allCampaignCreators } = useAllCampaignCreators(campaigns);
    const { trackEvent } = useRudderstack();
    const [_batchId, setBatchId] = useState(() => randomNumber());
    const [page, setPage] = useState(0);
    const {
        results: firstPageSearchResults,
        resultsTotal,
        noResults,
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

    const searchId = randomNumber();

    useEffect(() => {
        setAudience([null, null]);
        setViews([null, null]);
        setGender(undefined);
        setEngagement(undefined);
        setLastPost(undefined);
        setContactInfo(undefined);
        setTopicTags([]);
        setInfluencerLocation([]);
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
    const [selectedInfluencers, setSelectedInfluencers] = usePersistentState<Record<string, boolean>>(
        'classic-selected-influencers',
        {},
    );
    const { sequences: allSequences } = useSequences();
    const sequences = allSequences?.filter((sequence) => !sequence.deleted);
    const [selectedRow, setSelectedRow] = useState<Row<ClassicSearchInfluencer>>();
    const [isInfluencerDetailsModalOpen, setIsInfluencerDetailsModalOpen] = useState(false);
    const { sequenceInfluencers: allSequenceInfluencers } = useSequenceInfluencers(sequences?.map((s) => s.id));
    const [selectedCount, setSelectedCount] = useState(0);
    const [_showSequenceSelector, setShowSequenceSelector] = useState<boolean>(false);

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
            {firstPageSearchResults && (
                <div className="flex w-full basis-3/4 flex-col">
                    <div className="flex flex-row items-center justify-between">
                        <div className="ml-4 text-gray-400">
                            {t('boostbot.table.selectedAmount', {
                                selectedCount,
                            })}
                        </div>
                        <div className="w-fit pb-3">
                            <AddToSequenceButton
                                buttonText={t('boostbot.chat.outreachSelected')}
                                outReachDisabled={false}
                                handleAddToSequenceButton={() => {
                                    //
                                }}
                            />
                        </div>
                    </div>
                    <InfluencersTable
                        columns={classicColumns}
                        data={firstPageSearchResults}
                        selectedInfluencers={selectedInfluencers}
                        setSelectedInfluencers={setSelectedInfluencers}
                        meta={{
                            t,
                            searchId,
                            setIsInfluencerDetailsModalOpen,
                            setSelectedRow,
                            allSequenceInfluencers,
                            setSelectedCount,
                            isLoading: resultsLoading,
                        }}
                    />
                </div>
            )}
            <InfluencerDetailsModal
                selectedRow={selectedRow}
                isOpen={isInfluencerDetailsModalOpen}
                setIsOpen={setIsInfluencerDetailsModalOpen}
                setShowSequenceSelector={setShowSequenceSelector}
                outReachDisabled={
                    (resultsLoading ||
                        allSequenceInfluencers?.some((i) => i.iqdata_id === selectedRow?.original.user_id)) ??
                    false
                }
                setSelectedInfluencers={setSelectedInfluencers}
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

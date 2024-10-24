import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IQDATA_MAINTENANCE } from 'src/constants';
import {
    SearchProvider,
    defaultAudienceGender,
    defaultAudienceLocations,
    useSearch,
    useSearchResults,
} from 'src/hooks/use-search';
import { Search, SearchDefault } from 'src/utils/analytics/events';
import { startJourney } from 'src/utils/analytics/journey';
import { numberFormatter } from 'src/utils/formatter';
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
import { getFulfilledData, getRejectedData, randomNumber, unixEpochToISOString } from 'src/utils/utils';
// import { featRecommended } from 'src/constants/feature-flags';
import toast from 'react-hot-toast';

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
import type { SearchTableInfluencer as ClassicSearchInfluencer } from 'types';
import { InfluencerDetailsModal } from '../boostbot/modal-influencer-details';
import { ModalSequenceSelector } from '../boostbot/modal-sequence-selector';
import type { Sequence } from 'src/utils/api/db';
import { useUser } from 'src/hooks/use-user';
import {
    type SendInfluencersToOutreachPayload,
    SendInfluencersToOutreach,
} from 'src/utils/analytics/events/boostbot/send-influencers-to-outreach';
import { CurrentPageEvent } from 'src/utils/analytics/events/current-pages';
import type { SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';
import { SearchExpired } from './search-expired';
import { useUsages } from 'src/hooks/use-usages';
import { useSubscription } from 'src/hooks/use-subscription';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { useAllSequenceInfluencersBasicInfo } from 'src/hooks/use-all-sequence-influencers-iqdata-id-and-sequence';
import { filterOutAlreadyAddedInfluencers } from '../boostbot/table/helper';
import { isBoostbotInfluencer } from 'pages/boostbot';
import { saveSearchResults } from 'src/utils/save-search-influencers';
import MaintenanceComponent from '../maintenance/Component';
import { isInMaintenance } from 'src/utils/maintenance';
import { Button } from '../button';

export const SearchPageInner = ({ expired }: { expired: boolean }) => {
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
        page,
    } = useSearch();
    const [filterModalOpen, setShowFiltersModal] = useState(false);
    const [needHelpModalOpen, setShowNeedHelpModal] = useState(false);
    const [_batchId, setBatchId] = useState(() => randomNumber());
    const {
        results,
        resultsTotal,
        loading: resultsLoading,
        metadata,
        setOnLoad,
        error: searchError,
        mutate: triggerSearch,
    } = useSearchResults(page);
    const { track: trackEvent } = useTrackEvent();

    const { track } = useRudderstackTrack();

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

                return trackEvent({
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
        [trackEvent, setSearchParams, setOnLoad, setBatchId],
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
            return trackEvent<typeof SearchDefault>({
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
    }, [trackEvent, setOnLoad, searchParams, metadata, rendered]);

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
            audienceGender: defaultAudienceGender,
            audienceLocation: defaultAudienceLocations(),
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
    const [selectedInfluencerIds, setSelectedInfluencerIds] = usePersistentState<Record<string, boolean>>(
        'classic-selected-influencers',
        {},
    );
    const { profile } = useUser();

    const { sequences } = useSequences({ filterDeleted: true });

    const [selectedRow, setSelectedRow] = useState<Row<ClassicSearchInfluencer>>();
    const [isInfluencerDetailsModalOpen, setIsInfluencerDetailsModalOpen] = useState(false);
    const {
        allSequenceInfluencersIqDataIdsAndSequenceNames: allSequenceInfluencers,
        refresh: refreshSequenceInfluencers,
    } = useAllSequenceInfluencersBasicInfo();

    const { error, createSequenceInfluencer } = useSequenceInfluencers();
    const [isOutreachLoading, setIsOutreachLoading] = useState(false);
    const outReachDisabled = isOutreachLoading || resultsLoading;
    const [selectedCount, setSelectedCount] = useState(0);
    const [showSequenceSelector, setShowSequenceSelector] = useState<boolean>(false);

    const { subscription } = useSubscription();

    const periodStart = unixEpochToISOString(subscription?.current_period_start);
    const periodEnd = unixEpochToISOString(subscription?.current_period_end);

    const { usages } = useUsages(
        true,
        periodStart && periodEnd
            ? { thisMonthStartDate: new Date(periodStart), thisMonthEndDate: new Date(periodEnd) }
            : undefined,
    );

    const defaultSequenceName = `${profile?.first_name}'s BoostBot Sequence`;

    const [sequence, setSequence] = useState<Sequence | undefined>(() =>
        sequences?.find((sequence) => sequence.name === defaultSequenceName),
    );
    useEffect(() => {
        if (Array.isArray(error)) {
            error.map((e) => toast.error(e));
        } else if (error) {
            toast.error(error);
        }
    }, [error]);
    const handleSelectedInfluencersToOutreach = useCallback(async () => {
        setIsOutreachLoading(true);

        const trackingPayload: SendInfluencersToOutreachPayload & { $add?: any } = {
            currentPage: CurrentPageEvent.dashboard,
            influencer_ids: [],
            sequence_influencer_ids: [],
            topics: [],
            is_multiple: null,
            is_success: true,
            sequence_id: null,
            sequence_influencer_id: null,
            is_sequence_autostart: null,
        };

        try {
            const selectedInfluencers =
                // Check if influencers have loaded from indexedDb, otherwise could return an array of undefineds
                results && results.length > 0
                    ? Object.keys(selectedInfluencerIds)
                          .map((key) => results.find((i) => i.user_id === key))
                          .filter(isBoostbotInfluencer)
                    : [];
            const influencersToOutreach = filterOutAlreadyAddedInfluencers(
                allSequenceInfluencers, // Check if influencers have loaded from indexedDb, otherwise could return an array of undefineds
                selectedInfluencers,
            );
            trackingPayload.is_multiple = influencersToOutreach ? influencersToOutreach.length > 1 : null;

            if (!influencersToOutreach || influencersToOutreach.length === 0) {
                throw new Error('Error adding influencers to sequence: no valid influencers selected');
            }
            if (!sequence?.id) {
                throw new Error('Error creating sequence: no sequence id selected');
            }

            const sequenceInfluencerPromises = influencersToOutreach.map((influencer) => {
                const creatorProfileId = influencer.user_id;

                if (trackingPayload.influencer_ids !== null) {
                    trackingPayload.influencer_ids.push(creatorProfileId);
                }

                if (trackingPayload.topics !== null) {
                    trackingPayload.topics.push(...influencer.topics.map((v) => v));
                }

                if (!platform) {
                    throw new Error('Error creating sequence influencer: no platform detected');
                }
                return createSequenceInfluencer({
                    iqdata_id: creatorProfileId,
                    avatar_url: influencer.picture ?? '',
                    platform,
                    name: influencer.fullname ?? influencer.username ?? influencer.handle ?? '',
                    username: influencer.handle ?? influencer.username ?? '',

                    url: influencer.url,
                    sequence_id: sequence?.id,
                });
            });

            const sequenceInfluencersResults = await Promise.allSettled(sequenceInfluencerPromises);
            const sequenceInfluencers = getFulfilledData(
                sequenceInfluencersResults,
            ) as unknown as SequenceInfluencerManagerPage[];
            const rejected = getRejectedData(sequenceInfluencersResults);
            rejected.map((r: string) => {
                if (r.startsWith('400')) toast.error(r);
            });
            if (sequenceInfluencers.length === 0) throw new Error('Error creating sequence influencers');

            // An optimistic update to the sequence influencers cache to prevent the user from adding the same influencers to the sequence again
            refreshSequenceInfluencers([
                ...allSequenceInfluencers,
                ...sequenceInfluencers.map((si) => ({
                    ...si,
                    sequenceName: sequence?.name ?? '',
                })),
            ]);
            trackingPayload.sequence_influencer_ids = sequenceInfluencers.map((si) => si.id);
            trackingPayload['$add'] = { total_sequence_influencers: sequenceInfluencers.length };
        } catch (error) {
            clientLogger(error, 'error');
            trackingPayload.is_success = false;
            trackingPayload.extra_info = { error: String(error) };
        } finally {
            // @ts-ignore bypasses apiObject type requirement of is_multiple.
            // Needs `null` for it to show in mixpanel without explicitly
            // saying that it is multiple or not
            track(SendInfluencersToOutreach, trackingPayload);
            setIsOutreachLoading(false);
        }
    }, [
        allSequenceInfluencers,
        results,
        selectedInfluencerIds,
        sequence?.id,
        sequence?.name,
        refreshSequenceInfluencers,
        platform,
        createSequenceInfluencer,
        track,
    ]);

    useEffect(() => {
        if (!results) {
            return;
        }
        saveSearchResults(results);
    }, [results]);

    useEffect(() => {
        if (sequences && !sequence) {
            setSequence(sequences[0]);
        }
    }, [sequence, sequences]);

    return (
        <div className="p-6">
            <ClientRoleWarning />
            <div className="flex justify-between" id="search-creator-by-platform">
                <SelectPlatform />
                <div className="w-fit">
                    <SearchCreators />
                </div>
            </div>
            <SearchOptions
                setShowFiltersModal={setShowFiltersModal}
                onSearch={handleSearch}
                searchType={searchType}
                onSearchTypeChange={handleSearchTypeChange}
                setShowNeedHelpModal={setShowNeedHelpModal}
            />
            <ModalSequenceSelector
                show={showSequenceSelector}
                setShow={setShowSequenceSelector}
                handleAddToSequence={handleSelectedInfluencersToOutreach}
                sequence={sequence}
                setSequence={setSequence}
                sequences={sequences || []}
            />
            {expired || usages.search.remaining === 0 ? (
                <div className="m-8 flex w-full justify-center">
                    <SearchExpired type={expired ? 'plan' : 'credit'} subscriptionStatus={subscription?.status} />
                </div>
            ) : searchError ? (
                <div className="flex h-[200px] w-full flex-col items-center justify-center">
                    <p>{t('creators.noResults')}</p>
                    <Button
                        className="mt-5 w-[200px]"
                        onClick={() => {
                            triggerSearch();
                        }}
                        loading={resultsLoading}
                    >
                        {t('creators.reloadResult')}
                    </Button>
                </div>
            ) : (
                <div className="flex w-full basis-3/4 flex-col">
                    <div className="flex flex-row items-center justify-between">
                        <div className="ml-4 flex gap-2 text-sm font-medium text-gray-400">
                            {t('boostbot.table.selectedAmount', {
                                selectedCount,
                            })}
                            <span className="text-black">
                                {t('creators.results', {
                                    resultCount: numberFormatter(resultsTotal, 0),
                                })}
                            </span>
                        </div>
                        <div className="w-fit pb-3">
                            <AddToSequenceButton
                                buttonText={t('boostbot.chat.outreachSelected')}
                                outReachDisabled={outReachDisabled || Object.keys(selectedInfluencerIds).length === 0}
                                handleAddToSequenceButton={() => {
                                    setShowSequenceSelector(true);
                                }}
                                url="search"
                            />
                        </div>
                    </div>
                    <InfluencersTable
                        columns={classicColumns}
                        data={results || Array(10).fill({ url: 'https://www.youtube.com' })}
                        selectedInfluencerIds={selectedInfluencerIds}
                        setSelectedInfluencerIds={setSelectedInfluencerIds}
                        influencerCount={resultsTotal}
                        currentPage={page}
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
                setSelectedInfluencerIds={setSelectedInfluencerIds}
                url="search"
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

    const isMaintenancePage = isInMaintenance('dashboard');

    if (isMaintenancePage) {
        return (
            <Layout>
                <MaintenanceComponent message={t('maintenance.dashboardPage')} />
            </Layout>
        );
    }

    return (
        <Layout>
            {isExpired && (
                <Banner
                    buttonText={t('banner.button') ?? ''}
                    title={t('banner.expired.title')}
                    message={t('banner.expired.description')}
                />
            )}
            {IQDATA_MAINTENANCE ? (
                <MaintenanceMessage />
            ) : (
                <div className="flex flex-col">
                    <SearchProvider>
                        <SearchPageInner expired={isExpired} />
                    </SearchProvider>
                </div>
            )}
        </Layout>
    );
};

export default SearchPage;

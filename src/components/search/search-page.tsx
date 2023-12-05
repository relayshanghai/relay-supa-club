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
import { getFulfilledData, randomNumber } from 'src/utils/utils';
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
import { ModalSequenceSelector } from '../boostbot/modal-sequence-selector';
import type { Sequence } from 'src/utils/api/db';
import { useUser } from 'src/hooks/use-user';
import {
    type SendInfluencersToOutreachPayload,
    SendInfluencersToOutreach,
} from 'src/utils/analytics/events/boostbot/send-influencers-to-outreach';
import { CurrentPageEvent } from 'src/utils/analytics/events/current-pages';
import type { SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';

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
    const [_batchId, setBatchId] = useState(() => randomNumber());
    const [page, setPage] = useState(0);
    const {
        results: firstPageSearchResults,
        resultsTotal,
        noResults,
        loading: resultsLoading,
        metadata,
        setOnLoad,
    } = useSearchResults(page);

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
            audienceLocation: defaultAudienceLocations,
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
    const [selectedInfluencers, setSelectedInfluencers] = usePersistentState<Record<string, boolean>>(
        'classic-selected-influencers',
        {},
    );
    const { profile } = useUser();

    const { sequences: allSequences } = useSequences();
    const sequences = allSequences?.filter((sequence) => !sequence.deleted);
    const [selectedRow, setSelectedRow] = useState<Row<ClassicSearchInfluencer>>();
    const [isInfluencerDetailsModalOpen, setIsInfluencerDetailsModalOpen] = useState(false);
    const {
        sequenceInfluencers: allSequenceInfluencers,
        refreshSequenceInfluencers,
        createSequenceInfluencer,
    } = useSequenceInfluencers(sequences?.map((s) => s.id));
    const [isOutreachLoading, setIsOutreachLoading] = useState(false);
    const outReachDisabled = isOutreachLoading || resultsLoading;
    const [selectedCount, setSelectedCount] = useState(0);
    const [showSequenceSelector, setShowSequenceSelector] = useState<boolean>(false);

    const defaultSequenceName = `${profile?.first_name}'s BoostBot Sequence`;

    const [sequence, setSequence] = useState<Sequence | undefined>(() =>
        sequences?.find((sequence) => sequence.name === defaultSequenceName),
    );

    const handleSelectedInfluencersToOutreach = useCallback(async () => {
        const selectedInfluencersData =
            // Check if influencers have loaded from indexedDb, otherwise could return an array of undefineds
            firstPageSearchResults && firstPageSearchResults.length > 0
                ? Object.keys(selectedInfluencers).map((key) => firstPageSearchResults[Number(key)])
                : [];
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
            trackingPayload.is_multiple = selectedInfluencersData ? selectedInfluencersData.length > 1 : null;

            if (!selectedInfluencersData) {
                throw new Error('Error adding influencers to sequence: no valid influencers selected');
            }
            if (!sequence?.id) {
                throw new Error('Error creating sequence: no sequence id selected');
            }

            const sequenceInfluencerPromises = selectedInfluencersData.map((influencer) => {
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
            const sequenceInfluencers = getFulfilledData(sequenceInfluencersResults) as SequenceInfluencerManagerPage[];

            if (sequenceInfluencers.length === 0) throw new Error('Error creating sequence influencers');

            // An optimistic update to the sequence influencers cache to prevent the user from adding the same influencers to the sequence again
            refreshSequenceInfluencers([...allSequenceInfluencers, ...sequenceInfluencers]);
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
            track(SendInfluencersToOutreach.eventName, trackingPayload);
            setIsOutreachLoading(false);
        }
    }, [
        allSequenceInfluencers,
        sequence,
        platform,
        selectedInfluencers,
        createSequenceInfluencer,
        refreshSequenceInfluencers,
        track,
        firstPageSearchResults,
    ]);

    useEffect(() => {
        if (sequences && !sequence) {
            setSequence(sequences[0]);
        }
    }, [sequence, sequences]);
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
            <ModalSequenceSelector
                show={showSequenceSelector}
                setShow={setShowSequenceSelector}
                handleAddToSequence={handleSelectedInfluencersToOutreach}
                sequence={sequence}
                setSequence={setSequence}
                sequences={sequences || []}
            />
            <div className="flex items-center justify-between">
                <div className="text-sm font-medium">{`${t('creators.resultsPrefix')} ${numberFormatter(
                    resultsTotal,
                )} ${
                    platform === 'youtube' ? t('creators.resultsPostfixKeywords') : t('creators.resultsPostfixHashtags')
                }`}</div>
            </div>
            {noResults && !resultsLoading ? (
                <p>{t('creators.noResults')}</p>
            ) : (
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
                                outReachDisabled={outReachDisabled}
                                handleAddToSequenceButton={() => {
                                    setShowSequenceSelector(true);
                                }}
                            />
                        </div>
                    </div>
                    <InfluencersTable
                        columns={classicColumns}
                        data={firstPageSearchResults || Array(10).fill({ url: 'https://www.youtube.com' })}
                        selectedInfluencers={selectedInfluencers}
                        setSelectedInfluencers={setSelectedInfluencers}
                        influencerCount={resultsTotal}
                        setPage={setPage}
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
                setSelectedInfluencers={setSelectedInfluencers}
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

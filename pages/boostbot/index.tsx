import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { MessageType } from 'src/components/boostbot/message';
import type { SearchTableInfluencer as BoostbotInfluencer } from 'types';
import type { SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';
import { Chat } from 'src/components/boostbot/chat';
import InitialLogoScreen from 'src/components/boostbot/initial-logo-screen';
import { columns } from 'src/components/boostbot/table/columns';
import { InfluencersTable } from 'src/components/boostbot/table/influencers-table';
import { Layout } from 'src/components/layout';
import { useRudderstack } from 'src/hooks/use-rudderstack';
import { useSequenceInfluencers } from 'src/hooks/use-sequence-influencers';
import { useSequences } from 'src/hooks/use-sequences';
import { SendInfluencersToOutreach } from 'src/utils/analytics/events';
import type { SendInfluencersToOutreachPayload } from 'src/utils/analytics/events/boostbot/send-influencers-to-outreach';
import { clientLogger } from 'src/utils/logger-client';
import { getFulfilledData, getRejectedData } from 'src/utils/utils';
import { useUser } from 'src/hooks/use-user';
import { useUsages } from 'src/hooks/use-usages';
import { usePersistentState } from 'src/hooks/use-persistent-state';
import { CurrentPageEvent } from 'src/utils/analytics/events/current-pages';
import type { Sequence } from 'src/utils/api/db';
import { Banner } from 'src/components/library/banner';
import { useCompany } from 'src/hooks/use-company';
import { extractPlatformFromURL } from 'src/utils/extract-platform-from-url';
import type { Row } from '@tanstack/react-table';
import { AddToSequenceButton } from 'src/components/boostbot/add-to-sequence-button';
import { useBoostbot } from 'src/hooks/use-boostbot';
import { useAtomValue } from 'jotai';
import { boostbotSearchIdAtom } from 'src/atoms/boostbot';
import { filterOutAlreadyAddedInfluencers } from 'src/components/boostbot/table/helper';
import { useAllSequenceInfluencersBasicInfo } from 'src/hooks/use-all-sequence-influencers-iqdata-id-and-sequence';
import { useDriverV2 } from 'src/hooks/use-driver-v2';
import {
    chatGuide,
    influencerListGuide,
    influencerListMiniReport,
    influencerModalGuide,
    influencerModalGuideAdditionForDiscovery,
    influencerModalGuideAdditionForOutreach,
} from 'src/guides/boostbot.guide';
import { isInMaintenance } from 'src/utils/maintenance';
import MaintenanceComponent from 'src/components/maintenance/Component';
import toast from 'react-hot-toast';
import { SubscriptionStatus } from 'src/backend/database/subcription/subscription-entity';
import { useSubscription } from 'src/hooks/v2/use-subscription';

/** just a type check to satisfy .filter()'s return type */
export const isBoostbotInfluencer = (influencer?: BoostbotInfluencer): influencer is BoostbotInfluencer => {
    return influencer?.user_id !== undefined;
};

const Boostbot = () => {
    const { t } = useTranslation();

    const isMaintenancePage = isInMaintenance('boostbot');

    const {
        messages,
        setMessages,
        influencers,
        setInfluencers,
        createNewConversation,
        refreshConversation,
        isConversationLoading,
    } = useBoostbot();
    const [hasSearched, setHasSearched] = useState(false);
    const [isFirstTimeAddToSequence, setIsFirstTimeAddToSequence] = usePersistentState(
        'boostbot-is-first-time-add-to-sequence',
        true,
    );
    const [selectedInfluencerIds, setSelectedInfluencerIds] = usePersistentState<Record<string, boolean>>(
        'boostbot-selected-influencers',
        {},
    );

    const selectedInfluencers =
        // Check if influencers have loaded from indexedDb, otherwise could return an array of undefineds
        influencers.length > 0
            ? Object.keys(selectedInfluencerIds)
                  .map((key) => influencers.find((i) => i.user_id === key))
                  .filter(isBoostbotInfluencer)
            : [];

    const { trackEvent: track } = useRudderstack();
    const { sequences } = useSequences({ filterDeleted: true });
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const [isOutreachLoading, setIsOutreachLoading] = useState(false);
    const { profile } = useUser();
    const defaultSequenceName = `${profile?.first_name}'s BoostBot Sequence`;
    const [sequence, setSequence] = useState<Sequence | undefined>(() =>
        sequences?.find((sequence) => sequence.name === defaultSequenceName),
    );
    const [isInfluencerDetailsModalOpen, setIsInfluencerDetailsModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<Row<BoostbotInfluencer>>();
    const [showSequenceSelector, setShowSequenceSelector] = useState<boolean>(false);
    const [selectedCount, setSelectedCount] = useState(0);

    useEffect(() => {
        if (sequences && !sequence) {
            setSequence(sequences[0]);
        }
    }, [sequence, sequences]);

    const { error, createSequenceInfluencer } = useSequenceInfluencers();

    useEffect(() => {
        if (Array.isArray(error)) {
            error.map((e) => toast.error(e));
        } else if (error) {
            toast.error(error);
        }
    }, [error]);
    const {
        allSequenceInfluencersIqDataIdsAndSequenceNames: allSequenceInfluencers,
        refresh: refreshSequenceInfluencers,
    } = useAllSequenceInfluencersBasicInfo();

    const [isSearchDisabled, setIsSearchDisabled] = useState(false);
    const [areChatActionsDisabled, setAreChatActionsDisabled] = useState(false);
    const { subscription } = useSubscription();
    const { company } = useCompany();

    const subscriptionStatus = subscription?.status as SubscriptionStatus;
    const isExpired =
        subscriptionStatus === SubscriptionStatus.CANCELLED ||
        subscriptionStatus === SubscriptionStatus.PASS_DUE ||
        subscriptionStatus === SubscriptionStatus.TRIAL_EXPIRED;

    const periodStart = company?.subscription_current_period_start;
    const periodEnd = company?.subscription_current_period_end;
    const searchId = useAtomValue(boostbotSearchIdAtom);

    const { usages, isUsageLoaded, refreshUsages } = useUsages(
        true,
        periodStart && periodEnd
            ? { thisMonthStartDate: new Date(periodStart), thisMonthEndDate: new Date(periodEnd) }
            : undefined,
    );

    useEffect(() => {
        refreshUsages();
    }, [influencers, refreshUsages]);

    useEffect(() => {
        if (isSearchLoading || !isUsageLoaded) return;
        if (usages.search.remaining < 5) {
            addMessage({
                sender: 'Bot',
                type: 'translation',
                translationKey: 'boostbot.error.outOfSearchCredits',
                translationLink: '/upgrade',
            });
            setIsSearchDisabled(true);
        }
        if (isExpired) {
            addMessage({
                sender: 'Bot',
                type: 'translation',
                translationKey: 'boostbot.error.expiredAccount',
                translationLink: '/upgrade',
            });
            setIsSearchDisabled(true);
            setAreChatActionsDisabled(true);
        }
        // Omitting 't' from the dependencies array to not resend messages when language is changed.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [usages.search.remaining, usages.profile.remaining, isSearchLoading, isUsageLoaded, subscription]);

    const addMessage = (message: MessageType) => setMessages((prevMessages) => [...prevMessages, message]);

    const influencersToOutreach = filterOutAlreadyAddedInfluencers(allSequenceInfluencers, selectedInfluencers ?? []);

    const isOutreachButtonDisabled = influencersToOutreach.length === 0;

    const handleAddToSequenceButton = () => {
        setShowSequenceSelector(true);
    };

    const handleSelectedInfluencersToOutreach = async () => {
        setIsOutreachLoading(true);
        const trackingPayload: SendInfluencersToOutreachPayload & { $add?: any } = {
            currentPage: CurrentPageEvent.boostbot,
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
            trackingPayload.is_multiple = influencersToOutreach ? influencersToOutreach.length > 1 : null;

            if (!influencersToOutreach) {
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

                const platform = extractPlatformFromURL(influencer.url);
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
                addMessage({
                    sender: 'Bot',
                    text: r,
                    type: 'text',
                });
            });

            if (sequenceInfluencers.length === 0) throw new Error('Error creating sequence influencers');

            // An optimistic update to the sequence influencers cache to prevent the user from adding the same influencers to the sequence again
            refreshSequenceInfluencers([...allSequenceInfluencers, ...sequenceInfluencers]);
            trackingPayload.sequence_influencer_ids = sequenceInfluencers.map((si) => si.id);
            trackingPayload['$add'] = { total_sequence_influencers: sequenceInfluencers.length };

            if (isFirstTimeAddToSequence) {
                setIsFirstTimeAddToSequence(false);
                addMessage({
                    sender: 'Bot',
                    type: 'translation',
                    translationKey: 'boostbot.chat.outreachDoneFirstTime',
                    translationLink: `/sequences/${encodeURIComponent(sequence.id)}`,
                    translationValues: {
                        sequenceName: sequence.name,
                    },
                });
            } else {
                addMessage({
                    sender: 'Bot',
                    type: 'translation',
                    translationKey: 'boostbot.chat.outreachDoneA',
                    translationLink: `/sequences/${encodeURIComponent(sequence.id)}`,
                    translationValues: {
                        sequenceName: sequence.name,
                    },
                });
                addMessage({
                    sender: 'Bot',
                    type: 'translation',
                    translationKey: 'boostbot.chat.outreachDoneB',
                    translationValues: { count: influencers.length },
                });
            }
        } catch (error) {
            clientLogger(error, 'error');
            addMessage({
                sender: 'Bot',
                type: 'translation',
                translationKey: 'boostbot.error.influencersToOutreach',
            });

            trackingPayload.is_success = false;
            trackingPayload.extra_info = { error: String(error) };
        } finally {
            // @ts-ignore bypasses apiObject type requirement of is_multiple.
            // Needs `null` for it to show in mixpanel without explicitly
            // saying that it is multiple or not
            track(SendInfluencersToOutreach.eventName, trackingPayload);
            setIsOutreachLoading(false);
        }
    };

    const clearChatHistory = async () => {
        if (!profile) {
            return;
        }
        setHasSearched(false);
        setMessages([]);
        setInfluencers([]);
        setSelectedInfluencerIds({});
        await createNewConversation(profile?.id ?? '', profile?.first_name);
        refreshConversation();
    };

    const outReachDisabled = isOutreachLoading || areChatActionsDisabled || isOutreachButtonDisabled;

    const showInitialLogoScreen: boolean = !hasSearched && influencers.length === 0;

    const { setGuides, startTour, guidesReady, hasBeenSeen, guiding } = useDriverV2();

    const influencerListByPlan = () => {
        if (company?.subscription_plan === 'Discovery') {
            return influencerModalGuideAdditionForDiscovery;
        } else if (company?.subscription_plan === 'Outreach') {
            return influencerModalGuideAdditionForOutreach;
        } else {
            return [];
        }
    };

    useEffect(() => {
        setGuides({
            'boostbot#chat': chatGuide,
            'boostbot#influencerList': [...influencerListGuide, ...influencerListByPlan(), ...influencerListMiniReport],
            'boostbot#creatorReportModal': influencerModalGuide,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!isMaintenancePage && guidesReady) {
            startTour('boostbot#chat');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [guidesReady]);

    useEffect(() => {
        if (
            !isMaintenancePage &&
            !showInitialLogoScreen &&
            !guiding &&
            hasBeenSeen(['boostbot#chat']) &&
            !hasBeenSeen(['boostbot#influencerList'])
        ) {
            setTimeout(() => startTour('boostbot#influencerList'), 1000);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showInitialLogoScreen, guiding]);

    useEffect(() => {
        if (
            !isMaintenancePage &&
            isInfluencerDetailsModalOpen &&
            !guiding &&
            hasBeenSeen(['boostbot#influencerList']) &&
            !hasBeenSeen(['boostbot#creatorReportModal'])
        ) {
            setTimeout(() => startTour('boostbot#creatorReportModal'), 1000);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isInfluencerDetailsModalOpen, guiding]);

    if (isMaintenancePage) {
        return (
            <Layout>
                <MaintenanceComponent message={t('maintenance.boostbotPage')} />
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
            <div className="flex h-full flex-col gap-4 p-3 md:flex-row">
                <div className="w-full flex-shrink-0 basis-1/4 md:w-80" id="boostbot-chat-component">
                    <Chat
                        influencers={influencers}
                        allSequenceInfluencers={allSequenceInfluencers}
                        handleSelectedInfluencersToOutreach={handleSelectedInfluencersToOutreach}
                        setSelectedInfluencerIds={setSelectedInfluencerIds}
                        setHasSearched={setHasSearched}
                        isOutreachLoading={isOutreachLoading}
                        isSearchLoading={isSearchLoading}
                        areChatActionsDisabled={areChatActionsDisabled}
                        setIsSearchLoading={setIsSearchLoading}
                        messages={messages}
                        setMessages={setMessages}
                        addMessage={addMessage}
                        isSearchDisabled={isSearchDisabled}
                        isOutreachButtonDisabled={isOutreachButtonDisabled}
                        setSequence={setSequence}
                        sequence={sequence}
                        sequences={sequences}
                        clearChatHistory={clearChatHistory}
                        isLoading={isSearchLoading}
                        isDisabled={areChatActionsDisabled}
                        isInfluencerDetailsModalOpen={isInfluencerDetailsModalOpen}
                        setIsInfluencerDetailsModalOpen={setIsInfluencerDetailsModalOpen}
                        selectedRow={selectedRow}
                        showSequenceSelector={showSequenceSelector}
                        setShowSequenceSelector={setShowSequenceSelector}
                    />
                </div>

                {showInitialLogoScreen ? (
                    <div id="boostbot-initial-logo">
                        <InitialLogoScreen />
                    </div>
                ) : (
                    <div id="influencers-list" className="flex w-full basis-3/4 flex-col">
                        <div className="flex flex-row items-center justify-between">
                            <div className="ml-4 text-gray-400">
                                {t('boostbot.table.selectedAmount', {
                                    selectedCount,
                                })}
                            </div>
                            <div className="w-fit pb-3" id="boostbot-add-to-sequence-button">
                                <AddToSequenceButton
                                    buttonText={t('boostbot.chat.outreachSelected')}
                                    outReachDisabled={outReachDisabled}
                                    handleAddToSequenceButton={handleAddToSequenceButton}
                                    url="boostbot"
                                />
                            </div>
                        </div>
                        <InfluencersTable
                            columns={columns}
                            data={influencers}
                            setSelectedInfluencerIds={setSelectedInfluencerIds}
                            selectedInfluencerIds={selectedInfluencerIds}
                            meta={{
                                t,
                                searchId,
                                setIsInfluencerDetailsModalOpen,
                                setSelectedRow,
                                allSequenceInfluencers,
                                setSelectedCount,
                                isLoading: isSearchLoading || isConversationLoading,
                            }}
                        />
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Boostbot;

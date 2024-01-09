import type { SearchTableInfluencer as BoostbotInfluencer } from 'types';
import type { Dispatch, SetStateAction } from 'react';
import type { Json } from 'types/supabase';
import React, { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useBoostbot } from 'src/hooks/use-boostbot';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { RecommendInfluencers, StopBoostbot } from 'src/utils/analytics/events';
import type { RecommendInfluencersPayload } from 'src/utils/analytics/events/boostbot/recommend-influencers';
import { clientLogger } from 'src/utils/logger-client';
import type { CreatorPlatform, InfluencerSize } from 'types';
import { ChatContent } from './chat-content';
import { ChatInput } from './chat-input';
import { limiter } from 'src/utils/limiter';
import { mixArrays, randomNumber } from 'src/utils/utils';
import type { MessageType } from 'src/components/boostbot/message';
import { CurrentPageEvent } from 'src/utils/analytics/events/current-pages';
import type { ProgressType } from 'src/components/boostbot/chat-progress';
import { usePersistentState } from 'src/hooks/use-persistent-state';
import { createBoostbotInfluencerPayload } from 'src/utils/api/boostbot';
import type { AudienceGeo } from 'types/iqdata/influencer-search-request-body';
import { countriesByCode } from 'src/utils/api/iqdata/dictionaries/geolocations';
import { SearchFiltersModal } from 'src/components/boostbot/search-filters-modal';
import { ClearChatHistoryModal } from 'src/components/boostbot/clear-chat-history-modal';
import { ModalSequenceSelector } from './modal-sequence-selector';
import type { Sequence } from 'src/utils/api/db';
import { InfluencerDetailsModal } from './modal-influencer-details';
import type { Row } from '@tanstack/react-table';
import type { SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';
import { Settings, BoostbotSelected as Logo } from 'src/components/icons';
import { useSearchTrackers } from '../rudder/searchui-rudder-calls';
import { useUser } from 'src/hooks/use-user';
import { useAtom } from 'jotai';
import { boostbotSearchIdAtom } from 'src/atoms/boostbot';

export type Filters = {
    platforms: CreatorPlatform[];
    audience_geo: AudienceGeo[];
    influencerSizes: InfluencerSize[];
};

interface ChatProps {
    messages: MessageType[];
    setMessages: Dispatch<SetStateAction<MessageType[]>>;
    addMessage: (message: MessageType) => void;
    isOutreachLoading: boolean;
    isSearchLoading: boolean;
    areChatActionsDisabled: boolean;
    setIsSearchLoading: Dispatch<SetStateAction<boolean>>;
    influencers: BoostbotInfluencer[];
    setHasSearched: Dispatch<SetStateAction<boolean>>;
    handleSelectedInfluencersToOutreach: () => void;
    isSearchDisabled: boolean;
    isOutreachButtonDisabled: boolean;
    sequence?: Sequence;
    setSequence: (sequence: Sequence | undefined) => void;
    sequences?: Sequence[];
    clearChatHistory: () => void;
    isLoading: boolean;
    isDisabled: boolean;
    isInfluencerDetailsModalOpen: boolean;
    setIsInfluencerDetailsModalOpen: (open: boolean) => void;
    selectedRow?: Row<BoostbotInfluencer>;
    showSequenceSelector: boolean;
    setShowSequenceSelector: (show: boolean) => void;
    allSequenceInfluencers?: SequenceInfluencerManagerPage[];
    setSelectedInfluencers: Dispatch<SetStateAction<Record<string, boolean>>>;
}

const defaultFilters: Filters = {
    platforms: ['youtube', 'tiktok', 'instagram'],
    audience_geo: [
        { id: countriesByCode.US.id, weight: 0.15 },
        { id: countriesByCode.CA.id, weight: 0.1 },
    ],
    influencerSizes: ['microinfluencer', 'nicheinfluencer'],
};

export const Chat: React.FC<ChatProps> = ({
    messages,
    setMessages,
    addMessage,
    isOutreachLoading,
    isSearchLoading,
    areChatActionsDisabled,
    setIsSearchLoading,
    influencers,
    setHasSearched,
    handleSelectedInfluencersToOutreach,
    isSearchDisabled,
    isOutreachButtonDisabled,
    sequence,
    setSequence,
    sequences,
    clearChatHistory,
    isLoading,
    isDisabled,
    isInfluencerDetailsModalOpen,
    setIsInfluencerDetailsModalOpen,
    selectedRow,
    showSequenceSelector,
    setShowSequenceSelector,
    allSequenceInfluencers,
    setSelectedInfluencers,
}) => {
    const [isClearChatHistoryModalOpen, setIsClearChatHistoryModalOpen] = useState(false);
    const [isFirstTimeSearch, setIsFirstTimeSearch] = usePersistentState('boostbot-is-first-time-search', true);
    const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
    const { trackBoostbotSearch } = useSearchTrackers();
    const [filters, setFilters] = usePersistentState<Filters>('boostbot-filters', defaultFilters);
    const [abortController, setAbortController] = useState(new AbortController());
    const { t } = useTranslation();
    const {
        getTopics,
        getRelevantTopics,
        getTopicClusters,
        getInfluencers,
        updateConversation,
        refreshConversation,
        setInfluencers,
    } = useBoostbot({
        abortSignal: abortController.signal,
    });
    const { profile } = useUser();
    const { track } = useRudderstackTrack();
    const [searchId, setSearchId] = useAtom(boostbotSearchIdAtom);

    const shouldShowButtons = influencers.length > 0 && !isSearchLoading;

    const stopBoostbot = useCallback(() => {
        abortController.abort();
        setAbortController(new AbortController());
        addMessage({
            sender: 'User',
            type: 'translation',
            translationKey: 'boostbot.chat.stopped',
        });
        setMessages((prevMessages) => {
            const lastProgressIndex = prevMessages.findLastIndex((message) => message.type === 'progress');
            return [...prevMessages.slice(0, lastProgressIndex), ...prevMessages.slice(lastProgressIndex + 1)];
        });
        track(StopBoostbot, {
            currentPage: CurrentPageEvent.boostbot,
            search_id: searchId,
        });
    }, [abortController, addMessage, searchId, setMessages, track]);

    const updateProgress = useCallback(
        (progress: ProgressType, messages: MessageType[]) => {
            const lastProgressMessageIndex = messages.findLastIndex((message) => message.type === 'progress');
            const progressMessage: MessageType = { sender: 'Neutral', type: 'progress', progressData: progress };

            const newMessages = [...messages];
            if (lastProgressMessageIndex !== -1) {
                newMessages[lastProgressMessageIndex] = progressMessage;
            } else {
                newMessages.push(progressMessage);
            }

            setMessages(newMessages);
            return newMessages;
        },

        [setMessages],
    );

    const chatSelectedInfluencersToOutreach = useCallback(() => {
        addMessage({ sender: 'User', type: 'translation', translationKey: 'boostbot.chat.outreachSelected' });
        handleSelectedInfluencersToOutreach();
    }, [addMessage, handleSelectedInfluencersToOutreach]);

    const onSendMessage = useCallback(
        async (productDescription: string) => {
            if (!profile?.id) {
                return;
            }
            const generatedSearchId = randomNumber(); // name something different than parent scope
            setSearchId(generatedSearchId);
            let newMessages = [...messages];
            newMessages.push(
                { sender: 'User', type: 'text', text: productDescription },
                {
                    sender: 'Neutral',
                    type: 'progress',
                    progressData: { topics: [], isMidway: false, totalFound: null },
                },
            );

            setMessages(newMessages);
            setIsSearchLoading(true);

            const payload: RecommendInfluencersPayload = {
                currentPage: CurrentPageEvent.boostbot,
                query: productDescription,
                topics_generated: [],
                valid_topics: [],
                recommended_influencers: [],
                is_success: true,
                search_id: generatedSearchId,
            };

            try {
                const topics = await getTopics(productDescription);
                payload.topics_generated = topics;
                newMessages = updateProgress({ topics, isMidway: false, totalFound: null }, newMessages);

                // Since we are getting rid of unlocking the top 3 influencers, we instead simulate the 2nd loading step with a timer.
                const secondStepTimeout = setTimeout(() => {
                    newMessages = updateProgress({ topics, isMidway: true, totalFound: null }, newMessages);
                }, 5000);

                const getInfluencersForPlatform = async ({ platform }: { platform: CreatorPlatform }) => {
                    const relevantTopics = await getRelevantTopics({ topics, platform });
                    const topicClusters = await getTopicClusters({ productDescription, topics: relevantTopics });
                    const influencerPayloads = topicClusters.map((topics) =>
                        createBoostbotInfluencerPayload({ platform, filters, topics }),
                    );

                    const influencers = await getInfluencers(influencerPayloads);

                    payload.valid_topics.push(...relevantTopics);
                    payload.recommended_influencers.push(...influencers.map((i) => i.user_id));

                    return influencers;
                };

                const parallelSearchPromises = filters.platforms.map((platform) =>
                    limiter.schedule(() => getInfluencersForPlatform({ platform })),
                );
                const searchResults = await Promise.all(parallelSearchPromises);
                const influencers = mixArrays(searchResults).filter((i) => !!i.url);

                clearTimeout(secondStepTimeout); // If, by any chance, the 3rd step finishes before the timed 2nd step, cancel the 2nd step timeout so it doesn't overwrite the 3rd step.
                trackBoostbotSearch('Search For Influencers'); // To increment total_boostbot_search count
                track(RecommendInfluencers, payload);

                newMessages = updateProgress({ topics, isMidway: true, totalFound: influencers.length }, newMessages);

                if (influencers.length > 0) {
                    if (isFirstTimeSearch) {
                        setIsFirstTimeSearch(false);
                        newMessages.push({
                            sender: 'Bot',
                            type: 'translation',
                            translationKey: 'boostbot.chat.influencersFoundFirstTimeA',
                        });
                        newMessages.push({
                            sender: 'Bot',
                            type: 'translation',
                            translationKey: 'boostbot.chat.influencersFoundFirstTimeB',
                        });
                    } else {
                        newMessages.push({
                            sender: 'Bot',
                            type: 'translation',
                            translationKey: 'boostbot.chat.influencersFound',
                            translationValues: { count: influencers.length },
                        });
                    }
                } else {
                    newMessages.push({
                        sender: 'Bot',
                        type: 'translation',
                        translationKey: 'boostbot.chat.noInfluencersFound',
                    });
                }

                const newData = { searchResults: influencers, chatMessages: newMessages, profileId: profile.id };
                const newDataInDbFormat = { search_results: influencers as Json, chat_messages: newMessages as Json };

                refreshConversation(updateConversation(newData), { optimisticData: newDataInDbFormat });
                setHasSearched(true);
                document.dispatchEvent(new Event('influencerTableLoadInfluencers'));
            } catch (error) {
                if (error instanceof Error && error.name === 'AbortError') {
                    return;
                } else {
                    payload.is_success = false;
                    payload.extra_info = { error: String(error) };

                    clientLogger(error, 'error');
                    toast.error(t('boostbot.error.influencerSearch'));

                    track(RecommendInfluencers, payload);
                }
            } finally {
                setIsSearchLoading(false);
            }
        },
        [
            filters,
            getInfluencers,
            getRelevantTopics,
            getTopicClusters,
            getTopics,
            isFirstTimeSearch,
            messages,
            profile?.id,
            refreshConversation,
            setHasSearched,
            setIsFirstTimeSearch,
            setIsSearchLoading,
            setMessages,
            setSearchId,
            t,
            track,
            trackBoostbotSearch,
            updateConversation,
            updateProgress,
        ],
    );

    const clearChatHistoryAndFilters = useCallback(() => {
        clearChatHistory();
        setInfluencers([]);
        setFilters(defaultFilters);
    }, [clearChatHistory, setFilters, setInfluencers]);

    return (
        <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-primary-500 bg-white shadow-lg">
            <ModalSequenceSelector
                show={showSequenceSelector}
                setShow={setShowSequenceSelector}
                handleAddToSequence={chatSelectedInfluencersToOutreach}
                sequence={sequence}
                setSequence={setSequence}
                sequences={sequences || []}
            />
            <div className="boostbot-gradient z-10 m-0 flex px-4 py-3.5 shadow">
                <div className="flex h-[32px] w-[32px] justify-center rounded-full bg-white">
                    <Logo height={16} width={19} className="m-1 self-center stroke-none" />
                </div>

                <h1 className="text-md self-center px-[10px] font-semibold text-white drop-shadow-md">
                    BoostBot AI Search
                </h1>
            </div>
            <div className="b-6 flex justify-between border-b-2 border-tertiary-200 px-4 py-1">
                <button
                    data-testid="boostbot-open-filters"
                    className="group flex items-center gap-1 rounded-[6px] py-2 pl-0 pr-2 text-xs font-semibold text-primary-600 transition-all hover:text-primary-800 disabled:bg-transparent disabled:text-primary-200"
                    onClick={() => setIsFiltersModalOpen(true)}
                    disabled={isLoading || isDisabled}
                >
                    <Settings
                        strokeWidth="1.5"
                        className="h-5 w-5 stroke-primary-600 group-disabled:stroke-primary-200"
                    />{' '}
                    {t('boostbot.filters.openModalButton')}
                </button>
                <button
                    data-testid="boostbot-open-clear-chat-history"
                    className="group flex items-center gap-1 rounded-[6px] p-2 text-xs font-semibold text-tertiary-400 transition-all hover:text-tertiary-600 disabled:bg-transparent disabled:text-primary-200"
                    onClick={() => setIsClearChatHistoryModalOpen(true)}
                    disabled={isLoading || isDisabled}
                >
                    {t('boostbot.chat.clearChatModal.open')}
                </button>
            </div>

            <SearchFiltersModal
                isOpen={isFiltersModalOpen}
                setIsOpen={setIsFiltersModalOpen}
                filters={filters}
                setFilters={setFilters}
            />

            <ClearChatHistoryModal
                isOpen={isClearChatHistoryModalOpen}
                setIsOpen={setIsClearChatHistoryModalOpen}
                onConfirm={clearChatHistoryAndFilters}
            />

            <InfluencerDetailsModal
                selectedRow={selectedRow}
                isOpen={isInfluencerDetailsModalOpen}
                setIsOpen={setIsInfluencerDetailsModalOpen}
                setShowSequenceSelector={setShowSequenceSelector}
                outReachDisabled={
                    (isOutreachLoading ||
                        areChatActionsDisabled ||
                        allSequenceInfluencers?.some((i) => i.iqdata_id === selectedRow?.original.user_id)) ??
                    false
                }
                setSelectedInfluencers={setSelectedInfluencers}
                url="boostbot"
            />

            <ChatContent
                messages={messages}
                shouldShowButtons={shouldShowButtons}
                isSearchLoading={isSearchLoading}
                isOutreachLoading={isOutreachLoading}
                handleSelectedInfluencersToOutreach={() => setShowSequenceSelector(true)}
                stopBoostbot={stopBoostbot}
                areChatActionsDisabled={areChatActionsDisabled}
                isOutreachButtonDisabled={isOutreachButtonDisabled}
            />

            <div className="relative ">
                {/* Below is a gradient that hides the bottom of the chat */}
                <div className="absolute -top-8 right-4 h-8 w-full -scale-y-100 transform bg-gradient-to-b from-white" />
                <ChatInput
                    isDisabled={isSearchDisabled}
                    isLoading={isSearchLoading || isOutreachLoading}
                    onSendMessage={onSendMessage}
                    setSelectedInfluencers={setSelectedInfluencers}
                />
            </div>
        </div>
    );
};

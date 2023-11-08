import { SparklesIcon } from '@heroicons/react/24/solid';
import type { BoostbotInfluencer } from 'pages/api/boostbot/get-influencers';
import type { Dispatch, SetStateAction } from 'react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useBoostbot } from 'src/hooks/use-boostbot';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { RecommendInfluencers, StopBoostbot } from 'src/utils/analytics/events';
import type { RecommendInfluencersPayload } from 'src/utils/analytics/events/boostbot/recommend-influencers';
import { clientLogger } from 'src/utils/logger-client';
import type { CreatorPlatform } from 'types';
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
import { AdjustmentsVerticalIcon } from '@heroicons/react/24/outline';
import { InfluencerDetailsModal } from './modal-influencer-details';
import type { Row } from '@tanstack/react-table';

export type Filters = {
    platforms: CreatorPlatform[];
    audience_geo: AudienceGeo[];
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
    setInfluencers: Dispatch<SetStateAction<BoostbotInfluencer[]>>;
    setIsInitialLogoScreen: Dispatch<SetStateAction<boolean>>;
    handleSelectedInfluencersToOutreach: () => void;
    isSearchDisabled: boolean;
    isOutreachButtonDisabled: boolean;
    setSearchId: Dispatch<SetStateAction<string | number | null>>;
    sequence?: Sequence;
    setSequence: (sequence: Sequence | undefined) => void;
    sequences?: Sequence[];
    clearChatHistory: () => void;
    isLoading: boolean;
    isDisabled: boolean;
    isInfluencerDetailsModalOpen: boolean;
    setIsInfluencerDetailsModalOpen: (open: boolean) => void;
    selectedRow?: Row<BoostbotInfluencer>;
}

export const Chat: React.FC<ChatProps> = ({
    messages,
    setMessages,
    addMessage,
    isOutreachLoading,
    isSearchLoading,
    areChatActionsDisabled,
    setIsSearchLoading,
    influencers,
    setInfluencers,
    setIsInitialLogoScreen,
    handleSelectedInfluencersToOutreach,
    isSearchDisabled,
    isOutreachButtonDisabled,
    setSearchId,
    sequence,
    setSequence,
    sequences,
    clearChatHistory,
    isLoading,
    isDisabled,
    isInfluencerDetailsModalOpen,
    setIsInfluencerDetailsModalOpen,
    selectedRow,
}) => {
    const [isClearChatHistoryModalOpen, setIsClearChatHistoryModalOpen] = useState(false);
    const [isFirstTimeSearch, setIsFirstTimeSearch] = usePersistentState('boostbot-is-first-time-search', true);
    const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
    const [filters, setFilters] = usePersistentState<Filters>('boostbot-filters', {
        platforms: ['youtube', 'tiktok', 'instagram'],
        audience_geo: [
            { id: countriesByCode.US.id, weight: 0.15 },
            { id: countriesByCode.CA.id, weight: 0.1 },
        ],
    });
    let searchId: string | number | null = null;
    const [abortController, setAbortController] = useState(new AbortController());
    const { t } = useTranslation();
    const { getTopics, getRelevantTopics, getTopicClusters, getInfluencers } = useBoostbot({
        abortSignal: abortController.signal,
    });
    const [showSequenceSelector, setShowSequenceSelector] = useState<boolean>(false);

    const { track } = useRudderstackTrack();

    const shouldShowButtons = influencers.length > 0 && !isSearchLoading;

    const stopBoostbot = () => {
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
    };

    const updateProgress = (progress: ProgressType) =>
        setMessages((messages) => [
            ...messages.slice(0, -1),
            { sender: 'Neutral', type: 'progress', progressData: progress },
        ]);

    const chatSelectedInfluencersToOutreach = () => {
        addMessage({ sender: 'User', type: 'translation', translationKey: 'boostbot.chat.outreachSelected' });
        handleSelectedInfluencersToOutreach();
    };

    const onSendMessage = async (productDescription: string) => {
        searchId = randomNumber();
        setSearchId(searchId);
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: 'User', type: 'text', text: productDescription },
            { sender: 'Neutral', type: 'progress', progressData: { topics: [], isMidway: false, totalFound: null } },
        ]);
        setIsSearchLoading(true);

        const payload: RecommendInfluencersPayload = {
            currentPage: CurrentPageEvent.boostbot,
            query: productDescription,
            topics_generated: [],
            valid_topics: [],
            recommended_influencers: [],
            is_success: true,
            search_id: searchId,
        };

        try {
            const topics = await getTopics(productDescription);
            payload.topics_generated = topics;
            updateProgress({ topics, isMidway: false, totalFound: null });

            // Since we are getting rid of unlocking the top 3 influencers, we instead simulate the 2nd loading step with a timer.
            const secondStepTimeout = setTimeout(
                () => updateProgress({ topics, isMidway: true, totalFound: null }),
                5000,
            );

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
            setInfluencers(influencers);
            updateProgress({ topics, isMidway: true, totalFound: influencers.length });
            setIsInitialLogoScreen(false);
            if (influencers.length > 0) {
                if (isFirstTimeSearch) {
                    setIsFirstTimeSearch(false);
                    addMessage({
                        sender: 'Bot',
                        type: 'translation',
                        translationKey: 'boostbot.chat.influencersFoundFirstTime',
                        translationValues: {
                            count: influencers.length,
                        },
                        translationValuesToTranslate: {
                            geolocations: filters.audience_geo,
                        },
                    });
                    // addMessage({
                    //     sender: 'Bot',
                    //     type: 'video',
                    //     videoUrl: '/assets/videos/boostbot-filters-guide.mp4',
                    //     eventToTrack: OpenVideoGuideModal.eventName,
                    // });
                    addMessage({
                        sender: 'Bot',
                        type: 'translation',
                        translationKey: 'boostbot.chat.influencersFoundAddToSequence',
                        translationLink: '/sequences',
                    });
                    // addMessage({
                    //     sender: 'Bot',
                    //     type: 'video',
                    //     videoUrl: '/assets/videos/sequence-guide.mp4',
                    //     eventToTrack: OpenVideoGuideModal.eventName,
                    // });
                    addMessage({
                        sender: 'Bot',
                        type: 'translation',
                        translationKey: 'boostbot.chat.influencersFoundNextSteps',
                    });
                } else {
                    addMessage({
                        sender: 'Bot',
                        type: 'translation',
                        translationKey: 'boostbot.chat.influencersFound',
                        translationValues: { count: influencers.length },
                    });
                }
            } else {
                addMessage({
                    sender: 'Bot',
                    type: 'translation',
                    translationKey: 'boostbot.chat.noInfluencersFound',
                });
                // addMessage({
                //     sender: 'Bot',
                //     type: 'video',
                //     videoUrl: '/assets/videos/boostbot-filters-guide.mp4',
                //     eventToTrack: OpenVideoGuideModal.eventName,
                // });
            }
            document.dispatchEvent(new Event('influencerTableLoadInfluencers'));
            track(RecommendInfluencers, payload);
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
    };

    return (
        <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-primary-300 bg-white shadow-lg">
            <ModalSequenceSelector
                show={showSequenceSelector}
                setShow={setShowSequenceSelector}
                handleAddToSequence={chatSelectedInfluencersToOutreach}
                sequence={sequence}
                setSequence={setSequence}
                sequences={sequences || []}
            />
            <div className="boostbot-gradient z-10 shadow">
                <h1 className="text-md px-4 py-1 text-white drop-shadow-md">
                    BoostBot AI Search
                    <SparklesIcon className="inline h-4 w-4" />
                </h1>
            </div>
            <div className="flex justify-between px-2">
                <button
                    data-testid="boostbot-open-filters"
                    className="group flex items-center gap-1 p-2 text-xs font-semibold text-primary-500 transition-all hover:bg-primary-100 disabled:bg-transparent"
                    onClick={() => setIsFiltersModalOpen(true)}
                    disabled={isLoading || isDisabled}
                >
                    <AdjustmentsVerticalIcon className="h-6 w-6 stroke-primary-500 group-disabled:stroke-primary-200" />{' '}
                    {t('boostbot.filters.openModalButton')}
                </button>
                <button
                    data-testid="boostbot-open-clear-chat-history"
                    className="group flex items-center gap-1 p-2 text-xs font-semibold text-slate-400 transition-all hover:bg-primary-100 disabled:bg-transparent"
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
                onConfirm={clearChatHistory}
            />

            <InfluencerDetailsModal
                selectedRow={selectedRow}
                isOpen={isInfluencerDetailsModalOpen}
                setIsOpen={setIsInfluencerDetailsModalOpen}
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

            <div className="relative">
                {/* Below is a gradient that hides the bottom of the chat */}
                <div className="absolute -top-8 right-4 h-8 w-full -scale-y-100 transform bg-gradient-to-b from-white" />
                <ChatInput
                    isDisabled={isSearchDisabled}
                    isLoading={isSearchLoading || isOutreachLoading}
                    onSendMessage={onSendMessage}
                />
            </div>
        </div>
    );
};

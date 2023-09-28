import { SparklesIcon } from '@heroicons/react/24/solid';
import type { Influencer } from 'pages/boostbot';
import type { Dispatch, SetStateAction } from 'react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useBoostbot } from 'src/hooks/use-boostbot';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { RecommendInfluencers, StopBoostbot, OpenVideoGuideModal } from 'src/utils/analytics/events';
import type { RecommendInfluencersPayload } from 'src/utils/analytics/events/boostbot/recommend-influencers';
import { clientLogger } from 'src/utils/logger-client';
import type { CreatorPlatform } from 'types';
import { ChatContent } from './chat-content';
import { ChatInput } from './chat-input';
import type { CreatorsReportGetResponse } from 'pages/api/creators/report';
import { limiter } from 'src/utils/limiter';
import { mixArrays, randomNumber } from 'src/utils/utils';
import type { MessageType } from 'src/components/boostbot/message';
import { CurrentPageEvent } from 'src/utils/analytics/events/current-pages';
import type { ProgressType } from 'src/components/boostbot/chat-progress';
import { ModalSequenceSelector } from './modal-sequence-selector';
import type { Sequence } from 'src/utils/api/db';

interface ChatProps {
    messages: MessageType[];
    setMessages: Dispatch<SetStateAction<MessageType[]>>;
    addMessage: (message: MessageType) => void;
    isUnlockOutreachLoading: boolean;
    isSearchLoading: boolean;
    setIsSearchLoading: Dispatch<SetStateAction<boolean>>;
    influencers: Influencer[];
    setInfluencers: Dispatch<SetStateAction<Influencer[]>>;
    setIsInitialLogoScreen: Dispatch<SetStateAction<boolean>>;
    handlePageToUnlock: () => void;
    handlePageToOutreach: () => void;
    handleUnlockInfluencers: (
        influencers: Influencer[],
        freeOfCharge: boolean,
    ) => Promise<CreatorsReportGetResponse[] | undefined>;
    shortenedButtons: boolean;
    isSearchDisabled: boolean;
    setSearchId: Dispatch<SetStateAction<string | number | null>>;
    sequence?: Sequence;
    setSequence: (sequence: Sequence | undefined) => void;
    sequences?: Sequence[];
}

export const Chat: React.FC<ChatProps> = ({
    messages,
    setMessages,
    addMessage,
    isUnlockOutreachLoading,
    isSearchLoading,
    setIsSearchLoading,
    influencers,
    setInfluencers,
    setIsInitialLogoScreen,
    handlePageToUnlock,
    handlePageToOutreach,
    handleUnlockInfluencers,
    shortenedButtons,
    isSearchDisabled,
    setSearchId,
    sequence,
    setSequence,
    sequences,
}) => {
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

    const chatPageToUnlock = () => {
        addMessage({ sender: 'User', type: 'translation', translationKey: 'boostbot.chat.unlockPage' });
        handlePageToUnlock();
    };

    const chatPageToOutreach = () => {
        addMessage({ sender: 'User', type: 'translation', translationKey: 'boostbot.chat.outreachPage' });
        handlePageToOutreach();
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

            const getInfluencersForPlatform = async ({ platform }: { platform: CreatorPlatform }) => {
                const relevantTopics = await getRelevantTopics({ topics, platform });
                const topicClusters = await getTopicClusters({ productDescription, topics: relevantTopics });
                const influencers = await getInfluencers({ topicClusters, platform });

                payload.valid_topics.push(...relevantTopics);
                payload.recommended_influencers.push(...influencers.map((i) => i.user_id));

                return influencers;
            };

            const platforms: CreatorPlatform[] = ['youtube', 'tiktok', 'instagram'];
            const parallelSearchPromises = platforms.map((platform) =>
                limiter.schedule(() => getInfluencersForPlatform({ platform })),
            );
            const [youtube, tiktok, instagram] = await Promise.all(parallelSearchPromises);
            const influencers = mixArrays(youtube, tiktok, instagram).filter((i) => !!i.url);

            updateProgress({ topics, isMidway: true, totalFound: null });
            setInfluencers(influencers);

            await handleUnlockInfluencers(influencers.slice(0, 3), true);

            updateProgress({ topics, isMidway: true, totalFound: influencers.length });
            setIsInitialLogoScreen(false);
            if (influencers.length > 0) {
                addMessage({
                    sender: 'Bot',
                    type: 'translation',
                    translationKey: 'boostbot.chat.influencersFound',
                    translationValues: { count: influencers.length },
                });
            } else {
                addMessage({
                    sender: 'Bot',
                    type: 'translation',
                    translationKey: 'boostbot.chat.noInfluencersFound',
                });
                addMessage({
                    sender: 'Bot',
                    type: 'video',
                    videoUrl: '/assets/videos/no-influencers-found.mp4',
                    eventToTrack: OpenVideoGuideModal.eventName,
                });
            }
            document.dispatchEvent(new Event('influencerTableSetFirstPage'));
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
            {sequence && sequences && (
                <ModalSequenceSelector
                    show={showSequenceSelector}
                    setShow={setShowSequenceSelector}
                    handleAddToSequence={chatPageToOutreach}
                    sequence={sequence}
                    setSequence={setSequence}
                    sequences={sequences}
                />
            )}
            <div className="boostbot-gradient z-10 shadow">
                <h1 className="text-md px-4 py-1 text-white drop-shadow-md">
                    BoostBot <SparklesIcon className="inline h-4 w-4" />
                </h1>
            </div>

            <ChatContent
                messages={messages}
                shouldShowButtons={shouldShowButtons}
                isSearchLoading={isSearchLoading}
                isUnlockOutreachLoading={isUnlockOutreachLoading}
                handlePageToUnlock={chatPageToUnlock}
                handlePageToOutreach={() => {
                    setShowSequenceSelector(true);
                }}
                stopBoostbot={stopBoostbot}
                shortenedButtons={shortenedButtons}
            />

            <div className="relative">
                {/* Below is a gradient that hides the bottom of the chat */}
                <div className="absolute -top-8 right-4 h-8 w-full -scale-y-100 transform bg-gradient-to-b from-white" />
                <ChatInput
                    isDisabled={isSearchDisabled}
                    isLoading={isSearchLoading || isUnlockOutreachLoading}
                    onSendMessage={onSendMessage}
                />
            </div>
        </div>
    );
};

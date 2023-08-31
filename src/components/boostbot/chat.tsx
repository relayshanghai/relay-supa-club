import { influencersDrone } from 'influencers-mock';
import { SparklesIcon } from '@heroicons/react/24/solid';
import type { Influencer } from 'pages/boostbot';
import type { Dispatch, SetStateAction } from 'react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useBoostbot } from 'src/hooks/use-boostbot';
import { useRudderstack } from 'src/hooks/use-rudderstack';
import { RecommendInfluencers } from 'src/utils/analytics/events';
import type { RecommendInfluencersPayload } from 'src/utils/analytics/events/boostbot/recommend-influencers';
import { clientLogger } from 'src/utils/logger-client';
import type { CreatorPlatform } from 'types';
import { ChatContent } from './chat-content';
import { ChatInput } from './chat-input';
import type { CreatorsReportGetResponse } from 'pages/api/creators/report';
import { limiter } from 'src/utils/limiter';
import type { MessageType } from 'pages/boostbot';

export type ProgressType = {
    topics: string[];
    isMidway: boolean;
    totalFound: number | null;
};

interface ChatProps {
    messages: MessageType[];
    setMessages: Dispatch<SetStateAction<MessageType[]>>;
    addMessage: (message: MessageType) => void;
    isBoostbotLoading: boolean;
    influencers: Influencer[];
    setInfluencers: Dispatch<SetStateAction<Influencer[]>>;
    setIsInitialLogoScreen: Dispatch<SetStateAction<boolean>>;
    handlePageToUnlock: () => void;
    handlePageToOutreach: () => void;
    handleUnlockInfluencers: (influencers: Influencer[]) => Promise<CreatorsReportGetResponse[] | undefined>;
    shortenedButtons: boolean;
}

export const Chat: React.FC<ChatProps> = ({
    messages,
    setMessages,
    addMessage,
    isBoostbotLoading,
    influencers,
    setInfluencers,
    setIsInitialLogoScreen,
    handlePageToUnlock,
    handlePageToOutreach,
    handleUnlockInfluencers,
    shortenedButtons,
}) => {
    const [abortController, setAbortController] = useState(new AbortController());
    const { t } = useTranslation();
    const { getTopics, getRelevantTopics, getTopicClusters, getInfluencers } = useBoostbot({
        abortSignal: abortController.signal,
    });
    const [isLoading, setIsLoading] = useState(false);

    const { trackEvent: track } = useRudderstack();

    const shouldShowButtons = influencers.length > 0 && !isLoading;

    const stopBoostbot = () => {
        abortController.abort();
        setAbortController(new AbortController());
        addMessage({ sender: 'User', content: `${t('boostbot.chat.stopped')}` });
        setMessages((prevMessages) => {
            const lastProgressIndex = prevMessages.findLastIndex((message) => message.sender === 'Progress');
            return [...prevMessages.slice(0, lastProgressIndex), ...prevMessages.slice(lastProgressIndex + 1)];
        });
    };

    const updateProgress = (progress: ProgressType) =>
        setMessages((messages) => [...messages.slice(0, -1), { sender: 'Progress', progress }]);

    const chatPageToUnlock = () => {
        addMessage({ sender: 'User', content: `${t('boostbot.chat.unlockPage')}` });
        handlePageToUnlock();
    };

    const chatPageToOutreach = () => {
        addMessage({ sender: 'User', content: `${t('boostbot.chat.outreachPage')}` });
        handlePageToOutreach();
    };

    const onSendMessage = async (productDescription: string) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: 'User', content: productDescription },
            { sender: 'Progress', progress: { topics: [], isMidway: false, totalFound: null } },
        ]);
        setIsLoading(true);

        const payload: RecommendInfluencersPayload = {
            query: productDescription,
            topics_generated: [],
            valid_topics: [],
            recommended_influencers: [],
            is_success: true,
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
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const [youtube, tiktok, instagram] = await Promise.all(parallelSearchPromises);
            const influencers = influencersDrone;
            // eslint-disable-next-line no-console
            console.log('influencers :>> ', { influencers });

            updateProgress({ topics, isMidway: true, totalFound: null });
            setInfluencers(influencers);

            await handleUnlockInfluencers(influencers.slice(0, 3));

            updateProgress({ topics, isMidway: true, totalFound: influencers.length });
            setIsInitialLogoScreen(false);
            addMessage({
                sender: 'Bot',
                content: t('boostbot.chat.influencersFound', { count: influencers.length }) || '',
            });
            document.dispatchEvent(new Event('influencerTableSetFirstPage'));
            track(RecommendInfluencers.eventName, payload);
        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                // toast.success(t('boostbot.chat.stopped'));
            } else {
                payload.is_success = false;
                payload.extra_info = { error: String(error) };

                clientLogger(error, 'error');
                toast.error(t('boostbot.error.influencerSearch'));

                track(RecommendInfluencers.eventName, payload);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-primary-300 bg-white shadow-lg">
            <div className="boostbot-gradient z-10 shadow">
                <h1 className="text-md px-4 py-1 text-white drop-shadow-md">
                    BoostBot <SparklesIcon className="inline h-4 w-4" />
                </h1>
            </div>

            <ChatContent
                messages={messages}
                shouldShowButtons={shouldShowButtons}
                isLoading={isLoading}
                handlePageToUnlock={chatPageToUnlock}
                handlePageToOutreach={chatPageToOutreach}
                stopBoostbot={stopBoostbot}
                isBoostbotLoading={isBoostbotLoading}
                shortenedButtons={shortenedButtons}
            />

            <div className="relative">
                {/* Below is a gradient that hides the bottom of the chat */}
                <div className="absolute -top-8 right-4 h-8 w-full -scale-y-100 transform bg-gradient-to-b from-white" />
                <ChatInput isLoading={isLoading || isBoostbotLoading} onSendMessage={onSendMessage} />
            </div>
        </div>
    );
};

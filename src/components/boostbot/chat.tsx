// TODO: Fix eslint warnings after testing is done
/* eslint-disable @typescript-eslint/no-unused-vars */
import { SparklesIcon } from '@heroicons/react/24/solid';
import type { Influencer } from 'pages/boostbot';
import type { Dispatch, SetStateAction } from 'react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useBoostbot } from 'src/hooks/use-boostbot';
import { useRudderstack } from 'src/hooks/use-rudderstack';
import { RecommendInfluencers } from 'src/utils/analytics/events';
import { RecommendInfluencersPayload } from 'src/utils/analytics/events/boostbot-recommend-influencers';
import { clientLogger } from 'src/utils/logger-client';
import type { CreatorPlatform } from 'types';
import { ChatContent } from './chat-content';
import { ChatInput } from './chat-input';

export type ProgressType = {
    topics: string[];
    isMidway: boolean;
    totalFound: number | null;
};

export type MessageType = {
    sender: 'User' | 'Bot';
    content: string | JSX.Element;
};

interface ChatProps {
    influencers: Influencer[];
    setInfluencers: Dispatch<SetStateAction<Influencer[]>>;
    setIsInitialLogoScreen: Dispatch<SetStateAction<boolean>>;
    handlePageToUnlock: () => void;
    handlePageToOutreach: () => void;
}

export const Chat: React.FC<ChatProps> = ({
    influencers,
    setInfluencers,
    setIsInitialLogoScreen,
    handlePageToUnlock,
    handlePageToOutreach,
}) => {
    const [abortController, setAbortController] = useState(new AbortController());
    const { t } = useTranslation();
    const { getTopics, getRelevantTopics, getTopicClusters, getInfluencers } = useBoostbot({
        abortSignal: abortController.signal,
    });
    const [progress, setProgress] = useState<ProgressType>({ topics: [], isMidway: false, totalFound: null });
    const [isLoading, setIsLoading] = useState(false);
    const [progressMessages, setProgressMessages] = useState<MessageType[]>([]);
    const [messages, setMessages] = useState<MessageType[]>([
        {
            sender: 'Bot',
            content:
                t('boostbot.chat.introMessage') ??
                'Hi, welcome! Please describe your product so I can find the perfect influencers for you.',
        },
    ]);
    const { trackEvent: track } = useRudderstack();

    const showButtons = influencers.length > 0 && !isLoading;
    // TODO: either like this^ or actually have a state object/array like "currentButtons" and change the state accordingly,
    // like when influencers are loaded, set two buttons.. new influencer starting to load, make empty for the time being,
    // after processing unlock or whatever, set new ones.

    const stopBoostbot = () => {
        abortController.abort();
        setAbortController(new AbortController());
    };

    const addMessage = (message: MessageType) => setMessages((messages) => [...messages, message]);
    const addProgressMessage = (content: MessageType['content']) =>
        setProgressMessages((messages) => [...messages, { sender: 'Bot', content }]);

    const onSendMessage = async (productDescription: string) => {
        addMessage({ sender: 'User', content: productDescription });
        setIsLoading(true);

        const payload: RecommendInfluencersPayload = {
            query: productDescription,
            topics_generated: [],
            valid_topics: [],
            recommended_influencers: [],
            is_success: true,
        }

        try {
            const topics = await getTopics(productDescription);
            payload.topics_generated = topics;
            setProgress((prevProgress) => ({ ...prevProgress, topics }));

            const getInfluencersForPlatform = async ({ platform }: { platform: CreatorPlatform }) => {
                const relevantTopics = await getRelevantTopics({ topics, platform });
                payload.valid_topics.push(...relevantTopics);
                const topicClusters = await getTopicClusters({ productDescription, topics: relevantTopics });
                const influencers = await getInfluencers({ topicClusters, platform });
                payload.recommended_influencers.push(...influencers.map((i) => i.user_id));

                return influencers;
            };

            const instagramInfluencers = await getInfluencersForPlatform({ platform: 'instagram' });
            setProgress((prevProgress) => ({ ...prevProgress, isMidway: true }));

            // const tiktokInfluencers = await getInfluencersForPlatform({ platform: 'tiktok' });
            // const youtubeInfluencers = await getInfluencersForPlatform({ platform: 'youtube' });
            const influencers = [...instagramInfluencers];
            // const influencers = [...instagramInfluencers, ...tiktokInfluencers, ...youtubeInfluencers];
            setProgress((prevProgress) => ({ ...prevProgress, influencers: influencers.length }));
            setInfluencers(influencers);
            setIsInitialLogoScreen(false);
            addProgressMessage(`${influencers.length} ${t('boostbot.chat.influencersFound')}!`);
            document.dispatchEvent(new Event('influencerTableSetFirstPage'));
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1s for loading animation to finish
            track(RecommendInfluencers.eventName, payload);
        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                toast.success(t('boostbot.chat.stopped'));
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
            <div className="z-10 bg-primary-500 shadow">
                <h1 className="text-md px-4 py-1 text-white">
                    BoostBot <SparklesIcon className="inline h-4 w-4" />
                </h1>
            </div>

            <ChatContent
                messages={messages}
                progressMessages={progressMessages}
                isLoading={isLoading}
                progress={progress}
                handlePageToUnlock={handlePageToUnlock}
                handlePageToOutreach={handlePageToOutreach}
                stopBoostbot={stopBoostbot}
            />

            <div className="relative">
                {/* Below is a gradient that hides the bottom of the chat */}
                <div className="absolute -top-8 right-4 h-8 w-full -scale-y-100 transform bg-gradient-to-b from-white" />
                <ChatInput isLoading={isLoading} onSendMessage={onSendMessage} />
            </div>
        </div>
    );
};

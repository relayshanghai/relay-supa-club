/* eslint-disable no-console */
// TODO: Fix all eslint warnings
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Dispatch, SetStateAction } from 'react';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { nextFetch } from 'src/utils/fetcher';
import { ChatInput } from './chat-input';
import { ChatContent } from './chat-content';
import type { GetTopicsBody, GetTopicsResponse } from 'pages/api/boostbot/get-topics';
import type { GetRelevantTopicsBody, GetRelevantTopicsResponse } from 'pages/api/boostbot/get-relevant-topics';
import type { GetTopicClustersBody, GetTopicClustersResponse } from 'pages/api/boostbot/get-topic-clusters';
import type { GetInfluencersBody, GetInfluencersResponse } from 'pages/api/boostbot/get-influencers';
import type { Influencer } from 'pages/boostbot';
import { clientLogger } from 'src/utils/logger-client';

export type MessageType = {
    sender: 'User' | 'Bot';
    content: string | JSX.Element;
};

interface ChatProps {
    setInfluencers: Dispatch<SetStateAction<Influencer[]>>;
}

export const Chat: React.FC<ChatProps> = ({ setInfluencers }) => {
    const [progress, setProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [progressMessages, setProgressMessages] = useState<MessageType[]>([]);
    const [messages, setMessages] = useState<MessageType[]>([
        {
            sender: 'Bot',
            content: `Hi, welcome! Please describe your product so I can find the perfect influencers for you.`,
        },
    ]);
    const addMessage = (message: MessageType) => setMessages((messages) => [...messages, message]);
    const addProgressMessage = (content: MessageType['content']) =>
        setProgressMessages((messages) => [...messages, { sender: 'Bot', content }]);

    useEffect(() => {
        if (isLoading) setProgress(30);
    }, [isLoading]);

    const onSendMessage = async (productDescription: string) => {
        addMessage({ sender: 'User', content: productDescription });
        setIsLoading(true);

        const performFetch = async <T, B>(endpoint: string, body: B): Promise<T> => {
            const response = await nextFetch<T>(`boostbot/${endpoint}`, {
                method: 'POST',
                body,
            });

            console.log('endpoint :>> ', response);
            return response;
        };

        try {
            const { topics } = await performFetch<GetTopicsResponse, GetTopicsBody>('get-topics', {
                productDescription,
            });
            const topicList = topics.slice(0, 3).map((topic) => <p key={topic}>#{topic}</p>);
            addProgressMessage(<>I found the following topics: {topicList}</>);

            setProgress(60);
            const { relevantTopics } = await performFetch<GetRelevantTopicsResponse, GetRelevantTopicsBody>(
                'get-relevant-topics',
                { topics },
            );

            setProgress(75);
            const { topicClusters } = await performFetch<GetTopicClustersResponse, GetTopicClustersBody>(
                'get-topic-clusters',
                { productDescription, topics: relevantTopics },
            );
            addProgressMessage('Coming up with unique niches that match your product.');

            setProgress(90);
            const { influencers } = await performFetch<GetInfluencersResponse, GetInfluencersBody>('get-influencers', {
                topicClusters,
            });
            setProgress(100);
            setInfluencers(influencers.map((influencer) => influencer.user_profile));
            addProgressMessage(`${influencers.length} influencers found!`);
        } catch (error) {
            clientLogger(error, 'error');
            toast.error('Error fetching boostbot influencers');
        } finally {
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1s for loading animation to finish
            setIsLoading(false);
            setProgress(0);
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
            />

            <div className="relative">
                {/* Below is a gradient that hides the bottom of the chat */}
                <div className="absolute -top-8 right-4 h-8 w-full -scale-y-100 transform bg-gradient-to-b from-white" />
                <ChatInput isLoading={isLoading} onSendMessage={onSendMessage} />
            </div>
        </div>
    );
};

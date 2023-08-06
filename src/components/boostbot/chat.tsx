// TODO: Fix all eslint warnings
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { nextFetch } from 'src/utils/fetcher';
import { ChatInput } from './chat-input';
import { ChatContent } from './chat-content';
import type { BoostbotSearchBody, BoostbotSearchResponse } from 'pages/api/boostbot/search';

export type Message = {
    sender: 'User' | 'Bot';
    content: string;
};

export function Chat() {
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            sender: 'Bot',
            content: `Hi, welcome! Please describe your product so I can find the perfect influencers for you.`,
        },
        {
            sender: 'User',
            content: `The most advanced home use LED facial mask based on light therapy with 11 different treatments for different skin conditions.`,
        },
        {
            sender: 'Bot',
            content: `Hi, welcome! Please describe your product so I can find the perfect influencers for you. Hi, welcome! Please describe your product so I can find the perfect influencers for you. Hi, welcome! Please describe your product.`,
        },
    ]);

    const onSendMessage = async (message: string) => {
        setMessages([...messages, { sender: 'User', content: message }]);
        setIsLoading(true);

        // const body: BoostbotSearchBody = { message };
        // const res = await nextFetch<BoostbotSearchResponse>(`boostbot/search`, {
        //     method: 'POST',
        //     body,
        // });
        // console.log('res :>> ', res);
        setIsLoading(false);
    };

    return (
        <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-primary-300 bg-white shadow-lg">
            <div className="z-10 bg-primary-500 shadow">
                <h1 className="text-md px-4 py-1 text-white">
                    BoostBot <SparklesIcon className="inline h-4 w-4" />
                </h1>
            </div>

            <ChatContent messages={messages} />

            <div className="relative">
                {/* Below is a gradient that hides the bottom of the chat */}
                <div className="absolute -top-8 right-4 h-8 w-full -scale-y-100 transform bg-gradient-to-b from-white" />
                <ChatInput isLoading={isLoading} onSendMessage={onSendMessage} />
            </div>
        </div>
    );
}

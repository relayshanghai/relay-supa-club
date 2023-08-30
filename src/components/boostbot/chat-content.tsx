import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { StopIcon } from '@heroicons/react/24/solid';
import { Button } from 'src/components/button';
import type { MessageType } from 'pages/boostbot';
import type { ProgressType } from './chat';
import Message from './message';
import ChatProgress from './chat-progress';

interface ChatContentProps {
    messages: MessageType[];
    isLoading: boolean;
    isBoostbotLoading: boolean;
    shouldShowButtons: boolean;
    handlePageToUnlock: () => void;
    handlePageToOutreach: () => void;
    stopBoostbot: () => void;
}

export const ChatContent: React.FC<ChatContentProps> = ({
    messages,
    isLoading,
    isBoostbotLoading,
    shouldShowButtons,
    handlePageToUnlock,
    handlePageToOutreach,
    stopBoostbot,
}) => {
    const { t } = useTranslation();
    const chatBottomRef = useRef<null | HTMLDivElement>(null);

    useEffect(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, [messages]);

    return (
        <div className="relative flex flex-grow flex-col overflow-auto px-4 py-3">
            {messages.map((message, index) =>
                message.sender === 'Progress' ? (
                    <ChatProgress key={index} progress={message.content as ProgressType} />
                ) : (
                    <Message key={index} message={message} />
                ),
            )}

            {shouldShowButtons && (
                <div className="z-10">
                    <Button onClick={handlePageToUnlock} className="mb-2" disabled={isBoostbotLoading}>
                        {t('boostbot.chat.unlockPage')}
                    </Button>
                    <Button onClick={handlePageToOutreach} disabled={isBoostbotLoading}>
                        {t('boostbot.chat.outreachPage')}
                    </Button>
                </div>
            )}

            {isLoading && (
                <div className="flex-grow-1 mt-2 flex flex-1 items-end justify-center">
                    <Button onClick={stopBoostbot} className="z-10 flex items-center gap-1 border-none">
                        <StopIcon className="inline h-5 w-5" /> {t('boostbot.chat.stop')}
                    </Button>
                </div>
            )}

            <div className="relative top-10" ref={chatBottomRef} />
        </div>
    );
};

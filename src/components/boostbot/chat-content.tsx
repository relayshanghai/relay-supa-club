import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { StopIcon } from '@heroicons/react/24/solid';
import { Button } from 'src/components/button';
import type { MessageType } from './chat';
import Message from './message';
import ChatProgress from './chat-progress';
import type { ProgressType } from 'src/components/boostbot/chat';

interface ChatContentProps {
    messages: MessageType[];
    progressMessages: MessageType[];
    isLoading: boolean;
    progress: ProgressType;
    handlePageToUnlock: () => void;
    handlePageToOutreach: () => void;
    stopBoostbot: () => void;
}

export const ChatContent: React.FC<ChatContentProps> = ({
    messages,
    progressMessages,
    isLoading,
    progress,
    handlePageToUnlock,
    handlePageToOutreach,
    stopBoostbot,
}) => {
    const { t } = useTranslation();
    const chatBottomRef = useRef<null | HTMLDivElement>(null);

    useEffect(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, [messages, progressMessages]);

    return (
        <div className="relative flex flex-grow flex-col overflow-auto px-4 py-3 pb-6">
            {messages.map((message, index) => (
                <Message key={index} message={message} />
            ))}

            {isLoading && <ChatProgress progress={progress} />}

            {progressMessages.map((message, index) => (
                <Message key={index} message={message} />
            ))}

            {progressMessages.length > 0 && !isLoading ? (
                <>
                    <Button onClick={handlePageToUnlock} className="mb-2">
                        Unlock influencers on current page
                    </Button>
                    <Button onClick={handlePageToOutreach}>Email influencers on current page</Button>
                </>
            ) : null}

            {isLoading ? (
                <Button onClick={stopBoostbot} className="mb-2 flex items-center gap-1 self-center">
                    <StopIcon className="inline h-5 w-5" /> {t('boostbot.chat.stop')}
                </Button>
            ) : null}

            <div className="relative top-10" ref={chatBottomRef} />
        </div>
    );
};

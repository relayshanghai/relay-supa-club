import { useEffect, useRef } from 'react';
import type { MessageType } from './chat';
import ChatLoading from './chat-loading';
import Message from './message';
import { Button } from 'src/components/button';

interface ChatContentProps {
    messages: MessageType[];
    progressMessages: MessageType[];
    isLoading: boolean;
    progress: number;
    handlePageToUnlock: () => void;
    handlePageToOutreach: () => void;
}

export const ChatContent: React.FC<ChatContentProps> = ({
    messages,
    progressMessages,
    isLoading,
    progress,
    handlePageToUnlock,
    handlePageToOutreach,
}) => {
    const chatBottomRef = useRef<null | HTMLDivElement>(null);

    useEffect(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, [messages, progressMessages]);

    return (
        <div className="relative flex-grow overflow-auto px-4 py-3 pb-6">
            {messages.map((message, index) => (
                <Message key={index} message={message} />
            ))}

            {isLoading ? <ChatLoading progress={progress} /> : null}

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

            <div className="relative top-10" ref={chatBottomRef} />
        </div>
    );
};

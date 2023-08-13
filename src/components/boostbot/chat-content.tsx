import { useEffect, useRef } from 'react';
import type { MessageType } from './chat';
import ChatLoading from './chat-loading';
import Message from './message';

interface ChatContentProps {
    messages: MessageType[];
    progressMessages: MessageType[];
    isLoading: boolean;
    progress: number;
}

export const ChatContent: React.FC<ChatContentProps> = ({ messages, progressMessages, isLoading, progress }) => {
    const chatBottomRef = useRef<null | HTMLDivElement>(null);

    useEffect(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, [messages, progressMessages]);

    return (
        <div className="relative flex-grow overflow-auto px-4 py-3 pb-5">
            {messages.map((message, index) => (
                <Message key={index} message={message} />
            ))}

            {isLoading && <ChatLoading progress={progress} />}

            {progressMessages.map((message, index) => (
                <Message key={index} message={message} />
            ))}

            <div className="relative top-10" ref={chatBottomRef} />
        </div>
    );
};

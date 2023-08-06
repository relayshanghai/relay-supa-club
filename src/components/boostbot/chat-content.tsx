import { useEffect, useRef } from 'react';
import type { Message } from './chat';

interface ChatContentProps {
    messages: Message[];
}

export const ChatContent: React.FC<ChatContentProps> = ({ messages }) => {
    const chatBottomRef = useRef<null | HTMLDivElement>(null);

    useEffect(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, [messages]);

    const getMessageClass = (message: Message) => {
        return message.sender === 'Bot'
            ? 'mr-6 bg-primary-50 text-primary-700 border border-primary-500 rounded-bl-none'
            : 'ml-6 border border-slate-300 text-slate-600 bg-slate-50 rounded-br-none';
    };

    return (
        <div className="relative flex-grow overflow-auto px-4 py-3 pb-5">
            {messages.map((message, index) => (
                <div
                    key={index}
                    className={`mb-4 break-words rounded-md px-4 py-2 text-sm ${getMessageClass(message)}`}
                >
                    {message.content}
                </div>
            ))}

            <div className="relative top-10" ref={chatBottomRef} />
        </div>
    );
};

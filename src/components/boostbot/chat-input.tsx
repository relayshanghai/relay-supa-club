import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';
import { Send, Spinner } from 'src/components/icons';

interface ChatInputProps {
    onSendMessage: (message: string) => void;
    isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
    const textareaRef = useRef<null | HTMLTextAreaElement>(null);
    const [message, setMessage] = useState('');
    const { t } = useTranslation();

    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        textarea.style.height = 'auto';
        const adjustedHeight = textarea.scrollHeight;
        textarea.style.height = `${Math.min(adjustedHeight, 2 * 36)}px`;
    };

    const handleTextInput = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
        setMessage(e.target.value);
    };

    useEffect(() => {
        adjustTextareaHeight();
    }, [message]);

    const handleSendMessage = (): void => {
        if (isLoading || !message.trim()) return;

        onSendMessage(message.trim());
        setMessage('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="z-10 flex flex-row items-center gap-2 p-4 pt-1 shadow-lg">
            <textarea
                ref={textareaRef}
                rows={1}
                className="flex-grow resize-none rounded-lg border-none px-3 py-4 text-sm ring-1 ring-primary-400 hover:ring-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-300"
                placeholder={t('boostbot.chat.sendPlaceholder') ?? 'Send a product description...'}
                value={message}
                onChange={handleTextInput}
                onKeyDown={handleKeyDown}
            />

            <button
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-500 text-white transition-all hover:bg-primary-700 disabled:bg-primary-400"
                onClick={handleSendMessage}
                disabled={isLoading}
            >
                {isLoading ? <Spinner className="h-4 w-4 fill-primary-900" /> : <Send className="h-4 w-4 fill-white" />}
            </button>
        </div>
    );
};

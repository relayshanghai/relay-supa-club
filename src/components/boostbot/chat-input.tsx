import { useTranslation } from 'react-i18next';
import { useRef, useState } from 'react';
import { Send, Spinner } from 'src/components/icons';
import { AdjustmentsVerticalIcon } from '@heroicons/react/24/solid';

interface ChatInputProps {
    onSendMessage: (message: string) => void;
    isLoading: boolean;
    isDisabled: boolean;
    openFiltersModal: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, isDisabled, openFiltersModal }) => {
    const textareaRef = useRef<null | HTMLTextAreaElement>(null);
    const [message, setMessage] = useState('');
    const { t } = useTranslation();

    const handleTextInput = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
        setMessage(e.target.value);
    };

    const handleSendMessage = (): void => {
        if (isLoading || isDisabled || !message.trim()) return;

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
            <button
                className="group flex h-10 w-10 items-center justify-center rounded-full transition-all hover:bg-primary-100 disabled:bg-transparent"
                onClick={openFiltersModal}
                disabled={isLoading || isDisabled}
            >
                <AdjustmentsVerticalIcon className="h-6 w-6 fill-primary-500 group-disabled:fill-primary-200" />
            </button>

            <textarea
                ref={textareaRef}
                rows={2}
                className="flex-grow resize-none rounded-lg border-none px-2 py-2 text-xs ring-1 ring-primary-400 hover:ring-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-300"
                placeholder={t('boostbot.chat.sendPlaceholder') ?? 'Send a product description...'}
                value={message}
                onChange={handleTextInput}
                onKeyDown={handleKeyDown}
            />

            <button
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-500 text-white transition-all hover:bg-primary-700 disabled:bg-primary-400"
                onClick={handleSendMessage}
                disabled={isLoading || isDisabled}
            >
                {isLoading ? (
                    <Spinner className="h-4 w-4 fill-primary-900" />
                ) : (
                    <Send className="ml-1 h-4 w-4 fill-white" />
                )}
            </button>
        </div>
    );
};

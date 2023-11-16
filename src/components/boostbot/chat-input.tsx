import { useTranslation } from 'react-i18next';
import { type Dispatch, type SetStateAction, useRef, useState } from 'react';
import { SendLightning, Spinner } from 'src/components/icons';
import useOnOutsideClick from 'src/hooks/use-on-outside-click';

interface ChatInputProps {
    onSendMessage: (message: string) => void;
    isLoading: boolean;
    isDisabled: boolean;
    setSelectedInfluencers: Dispatch<SetStateAction<Record<string, boolean>>>;
}

export const ChatInput: React.FC<ChatInputProps> = ({
    onSendMessage,
    isLoading,
    isDisabled,
    setSelectedInfluencers,
}) => {
    const textareaRef = useRef<null | HTMLTextAreaElement>(null);
    const optionsMenuRef = useRef<null | HTMLDivElement>(null);
    const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);
    const [message, setMessage] = useState('');
    const { t } = useTranslation();

    const handleTextInput = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
        setMessage(e.target.value);
    };

    const handleSendMessage = (): void => {
        if (isLoading || isDisabled || !message.trim()) return;

        setSelectedInfluencers({});

        onSendMessage(message.trim());
        setMessage('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    useOnOutsideClick(optionsMenuRef, () => setIsOptionsMenuOpen(false));

    return (
        <div className="z-10 flex flex-row items-center gap-2 border-t-2  border-slate-100 px-4 py-6 shadow-lg ">
            <div
                data-testid="boostbot-open-options"
                className="relative z-10"
                onClick={() => setIsOptionsMenuOpen(!isOptionsMenuOpen)}
                ref={optionsMenuRef}
            />

            <textarea
                ref={textareaRef}
                rows={2}
                className="h-10 flex-grow resize-none rounded-[6px] border-none p-3 text-xs ring-1 ring-tertiary-200 placeholder:text-tertiary-300 hover:ring-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-300"
                placeholder={t('boostbot.chat.sendPlaceholder') ?? 'Send a product description...'}
                value={message}
                onChange={handleTextInput}
                onKeyDown={handleKeyDown}
            />

            <button
                data-testid="boostbot-send-message"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-boostbotbackground text-white transition-all hover:bg-primary-700 disabled:bg-primary-400"
                onClick={handleSendMessage}
                disabled={isLoading || isDisabled}
            >
                {isLoading ? <Spinner className="h-5 w-5 fill-primary-900" /> : <SendLightning className=" h-4 w-4" />}
            </button>
        </div>
    );
};

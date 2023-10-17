import { useTranslation } from 'react-i18next';
import { useRef, useState } from 'react';
import { Send, Spinner } from 'src/components/icons';
import { AdjustmentsVerticalIcon, Cog6ToothIcon, TrashIcon } from '@heroicons/react/24/outline';
import useOnOutsideClick from 'src/hooks/use-on-outside-click';

interface ChatInputProps {
    onSendMessage: (message: string) => void;
    isLoading: boolean;
    isDisabled: boolean;
    openFiltersModal: () => void;
    openClearChatHistoryModal: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
    onSendMessage,
    isLoading,
    isDisabled,
    openFiltersModal,
    openClearChatHistoryModal,
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
        <div className="z-10 flex flex-row items-center gap-2 p-4 pt-1 shadow-lg">
            <div
                data-testid="boostbot-open-options"
                className="relative z-10"
                onClick={() => setIsOptionsMenuOpen(!isOptionsMenuOpen)}
                ref={optionsMenuRef}
            >
                {isOptionsMenuOpen && (
                    <div className="border-gray absolute bottom-[110%] left-[20%] flex w-max origin-top-right select-none flex-col overflow-hidden rounded-md border border-opacity-40 bg-white text-sm shadow-lg">
                        <button
                            data-testid="boostbot-open-filters"
                            className="group flex items-center gap-1 p-2 transition-all hover:bg-primary-100 disabled:bg-transparent"
                            onClick={openFiltersModal}
                            disabled={isLoading || isDisabled}
                        >
                            <AdjustmentsVerticalIcon className="h-6 w-6 stroke-primary-500 group-disabled:stroke-primary-200" />{' '}
                            {t('boostbot.filters.openModalButton')}
                        </button>
                        <button
                            data-testid="boostbot-open-clear-chat-history"
                            className="group flex items-center gap-1 p-2 transition-all hover:bg-primary-100 disabled:bg-transparent"
                            onClick={openClearChatHistoryModal}
                            disabled={isLoading || isDisabled}
                        >
                            <TrashIcon className="h-6 w-6 stroke-primary-500 group-disabled:stroke-primary-200" />{' '}
                            {t('boostbot.chat.clearChatModal.open')}
                        </button>
                    </div>
                )}
                <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-all hover:bg-primary-100">
                    <Cog6ToothIcon className="h-6 w-6 stroke-primary-500" />
                </div>
            </div>

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
                data-testid="boostbot-send-message"
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

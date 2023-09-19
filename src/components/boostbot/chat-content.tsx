import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { StopIcon } from '@heroicons/react/24/solid';
import { Button } from 'src/components/button';
import type { MessageType } from 'pages/boostbot';
import Message from './message';
import ChatProgress from './chat-progress';

export interface ChatContentProps {
    messages: MessageType[];
    isSearchLoading: boolean;
    isUnlockOutreachLoading: boolean;
    shouldShowButtons: boolean;
    handlePageToUnlock: () => void;
    handlePageToOutreach: () => void;
    stopBoostbot: () => void;
    shortenedButtons: boolean;
}

export const ChatContent: React.FC<ChatContentProps> = ({
    messages,
    isSearchLoading,
    isUnlockOutreachLoading,
    shouldShowButtons,
    handlePageToUnlock,
    handlePageToOutreach,
    stopBoostbot,
    shortenedButtons,
}) => {
    const { t } = useTranslation();
    const chatBottomRef = useRef<null | HTMLDivElement>(null);

    useEffect(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, [messages]);

    return (
        <div className="relative flex flex-grow flex-col overflow-auto px-4 py-3">
            {messages.map((message, index) =>
                message.progress ? (
                    <ChatProgress key={index} progress={message.progress} />
                ) : (
                    <Message key={index} message={message} />
                ),
            )}

            {shouldShowButtons && (
                <div className="z-10 flex flex-wrap gap-2">
                    <Button
                        data-testid="boostbot-button-unlock"
                        onClick={handlePageToUnlock}
                        disabled={isUnlockOutreachLoading}
                    >
                        {shortenedButtons ? t('boostbot.chat.unlockPageShort') : t('boostbot.chat.unlockPage')}
                    </Button>
                    <Button
                        data-testid="boostbot-button-outreach"
                        onClick={handlePageToOutreach}
                        disabled={isUnlockOutreachLoading}
                    >
                        {shortenedButtons ? t('boostbot.chat.outreachPageShort') : t('boostbot.chat.outreachPage')}
                    </Button>
                </div>
            )}

            {isSearchLoading && (
                <div className="flex-grow-1 mt-2 flex flex-1 items-end justify-center">
                    <Button
                        data-testid="boostbot-button-stop"
                        onClick={stopBoostbot}
                        className="z-10 flex items-center gap-1 border-none"
                    >
                        <StopIcon className="inline h-5 w-5" /> {t('boostbot.chat.stop')}
                    </Button>
                </div>
            )}

            <div className="relative top-10" ref={chatBottomRef} />
        </div>
    );
};

import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { StopIcon } from '@heroicons/react/24/solid';
import { Button } from 'src/components/button';
import type { MessageType } from 'src/components/boostbot/message';
import Message from './message';

export interface ChatContentProps {
    messages: MessageType[];
    isSearchLoading: boolean;
    isOutreachLoading: boolean;
    shouldShowButtons: boolean;
    handleSelectedInfluencersToOutreach: () => void;
    stopBoostbot: () => void;
    areChatActionsDisabled: boolean;
    isOutreachButtonDisabled: boolean;
}

export const ChatContent: React.FC<ChatContentProps> = ({ messages, isSearchLoading, stopBoostbot }) => {
    // Temporarily disable the stop button until we design a better flow for the chat actions, related ticket: https://toil.kitemaker.co/0JhYl8-relayclub/8sxeDu-v2_project/items/1007
    const temporarilyDisableStopButton = true;
    const { t } = useTranslation();
    const chatBottomRef = useRef<null | HTMLDivElement>(null);

    useEffect(() => {
        setTimeout(() => {
            chatBottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 50);
    }, [messages]);

    return (
        <div className="relative flex flex-grow flex-col overflow-auto px-4 py-3">
            {messages.map((message, index) => (
                <Message key={index} message={message} />
            ))}
            {/* {shouldShowButtons && (
                <div className="z-10 flex flex-wrap gap-2">
                    <Button
                        data-testid="boostbot-button-outreach"
                        onClick={handleSelectedInfluencersToOutreach}
                        disabled={isOutreachLoading || areChatActionsDisabled || isOutreachButtonDisabled}
                        className="text-xs"
                    >
                        {t('boostbot.chat.outreachSelected')}
                    </Button>
                </div>
            )} */}
            {/* Temporarily disable the stop button until we design a better flow for the chat actions, related ticket: https://toil.kitemaker.co/0JhYl8-relayclub/8sxeDu-v2_project/items/1007 */}
            {isSearchLoading && !temporarilyDisableStopButton && (
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

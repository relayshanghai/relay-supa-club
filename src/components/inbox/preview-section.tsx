import type { MessagesGetMessage } from 'types/email-engine/account-account-messages-get';
import type { SearchResponseMessage } from 'types/email-engine/account-account-search-post';
import { PreviewCard } from './preview-card';

export const PreviewSection = ({
    messages,
    selectedMessages,
    handleGetThreadEmails,
    loadingSelectedMessages,
    onSelect,
}: {
    messages: MessagesGetMessage[];
    selectedMessages: SearchResponseMessage[] | null;
    handleGetThreadEmails: (message: MessagesGetMessage) => Promise<void>;
    loadingSelectedMessages: boolean;
    onSelect?: (message: MessagesGetMessage) => void;
}) => {
    return (
        <div className="h-full overflow-y-auto border-r-2 border-tertiary-200 bg-white">
            {messages.map((message) => (
                <div key={message.id}>
                    <PreviewCard
                        onSelect={onSelect}
                        message={message}
                        selectedMessage={selectedMessages ? selectedMessages[selectedMessages.length - 1] : null}
                        handleGetThreadEmails={handleGetThreadEmails}
                        loadingSelectedMessages={loadingSelectedMessages}
                    />
                </div>
            ))}
        </div>
    );
};

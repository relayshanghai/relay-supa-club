import type { MessagesGetMessage } from 'types/email-engine/account-account-messages-get';
import type { SearchResponseMessage } from 'types/email-engine/account-account-search-post';
import { PreviewCard } from './preview-card';

export const PreviewSection = ({
    messages,
    selectedMessages,
    handleGetThreadEmails,
    loadingSelectedMessages,
}: {
    messages: MessagesGetMessage[];
    selectedMessages: SearchResponseMessage[] | null;
    handleGetThreadEmails: (message: MessagesGetMessage) => Promise<void>;
    loadingSelectedMessages: boolean;
}) => {
    return (
        <div className="h-full overflow-y-auto border-r-2 border-tertiary-200 bg-white">
            {messages.map((message) => (
                <div key={message.id}>
                    <PreviewCard
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

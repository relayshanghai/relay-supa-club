import type { MessagesGetMessage } from 'types/email-engine/account-account-messages-get';
import { PreviewCard } from './preview-card';

export const PreviewSection = ({
    messages,
    handleGetThreadEmails,
    loadingSelectedMessages,
}: {
    messages: MessagesGetMessage[];
    handleGetThreadEmails: (message: MessagesGetMessage) => Promise<void>;
    loadingSelectedMessages: boolean;
}) => {
    return (
        <div className="h-full overflow-y-auto border-r-2 border-tertiary-200">
            {messages.map((message) => (
                <div key={message.id}>
                    <PreviewCard
                        message={message}
                        handleGetThreadEmails={handleGetThreadEmails}
                        loadingSelectedMessages={loadingSelectedMessages}
                    />
                </div>
            ))}
        </div>
    );
};

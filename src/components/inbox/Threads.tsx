import type { SearchResponseMessage } from 'types/email-engine/account-account-search-post';

export const Threads = ({ messages }: { messages: SearchResponseMessage[] }) => {
    return (
        <div>
            <div>
                Threads
                {messages.map((message) => (
                    <div key={message.id}>{message.text.id}</div>
                ))}
            </div>
        </div>
    );
};

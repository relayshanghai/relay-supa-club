import type { SearchResponseMessage } from 'types/email-engine/account-account-search-post';
import { useCallback, useEffect, useState } from 'react';
import { clientLogger } from 'src/utils/logger-client';
import dateFormat from 'src/utils/dateFormat';
import { getMessageText } from 'src/utils/api/email-engine/handle-messages';
import { cleanEmailBody } from 'src/utils/clean-html';
import { GMAIL_SENT } from 'src/utils/api/email-engine/prototype-mocks';

export interface ThreadMessage {
    subject: string;
    id: string;
    from: string;
    date: string;
    text: string;
    isMe?: boolean;
}

export const Threads = ({ messages }: { messages: SearchResponseMessage[] }) => {
    const [threadMessages, setThreadMessages] = useState<ThreadMessage[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const getThreadEmailText = useCallback(async (messages: SearchResponseMessage[]) => {
        setThreadMessages([]);
        setLoading(true);
        try {
            messages.forEach(async (message) => {
                if (!message.text.id) {
                    throw new Error('No text id');
                }
                const { html, plain } = await getMessageText(message.text.id);
                setThreadMessages((prev) => [
                    ...prev,
                    {
                        subject: message.subject,
                        id: message.id,
                        from: message.from.name || message.from.address,
                        date: message.date,
                        text: html ?? plain,
                        isMe: message.path === GMAIL_SENT,
                    },
                ]);
            });
        } catch (error: any) {
            clientLogger(error, 'error');
            throw error.message;
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        if (!loading && threadMessages.length === 0) {
            getThreadEmailText(messages);
        }
    }, [getThreadEmailText, loading, messages, threadMessages]);

    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="flex w-full flex-col space-y-3">
                    {threadMessages.map((message) => (
                        <div
                            key={message.id}
                            className={`w-4/5 whitespace-normal rounded-md border border-primary-200 px-3 py-2 ${
                                message.isMe ? 'self-end bg-primary-100 bg-opacity-70' : 'self-start'
                            }`}
                        >
                            <div className="mb-3 flex flex-wrap justify-between">
                                <div className="text-sm font-semibold text-gray-700">{message.from}</div>
                                <div className="text-xs">{dateFormat(message.date, 'isoTime', true, true)}</div>
                            </div>
                            <div className="mb-2 text-xs font-semibold text-gray-500">{message.subject}</div>
                            {/* <div className="my-2 text-xs">{message.text}</div> */}

                            <div
                                className="text-xs"
                                dangerouslySetInnerHTML={{
                                    __html: cleanEmailBody(message.text),
                                }}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

import type { SearchResponseMessage } from 'types/email-engine/account-account-search-post';
import { useCallback, useEffect, useState } from 'react';
import { clientLogger } from 'src/utils/logger-client';
import dateFormat from 'src/utils/dateFormat';
import { getMessageText } from 'src/utils/api/email-engine/handle-messages';
import { cleanEmailBody } from 'src/utils/clean-html';

export interface ThreadMessage {
    subject: string;
    id: string;
    from: string;
    date: string;
    text: string;
}

export const Threads = ({ messages }: { messages: SearchResponseMessage[] }) => {
    //[] style received messages to left, sent messages to right
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
        getThreadEmailText(messages);
        // console.log(threadMessages);
    }, [getThreadEmailText, messages]);

    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    <div className="space-y-2">
                        {threadMessages.map((message) => (
                            <div key={message.id} className="w-4/5 rounded-md border border-primary-200 px-3 py-2">
                                <div className="mb-3 flex justify-between">
                                    <div className="text-sm text-gray-700">{message.from}</div>
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
                </div>
            )}
        </div>
    );
};

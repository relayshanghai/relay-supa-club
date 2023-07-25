import type { SearchResponseMessage } from 'types/email-engine/account-account-search-post';
import { useCallback, useEffect, useState } from 'react';
import { nextFetch } from 'src/utils/fetcher';
import { testAccount } from 'src/utils/api/email-engine/prototype-mocks';
import type { GetEmailPostRequestBody, GetEmailPostResponseBody } from 'pages/api/email-engine/email-text';
import { clientLogger } from 'src/utils/logger-client';
import dateFormat from 'src/utils/dateFormat';
// import { cleanEmailBody } from 'src/utils/clean-html';

export interface ThreadMessage {
    subject: string;
    id: string;
    from: string;
    date: string;
    text: string;
}

export const Threads = ({ messages }: { messages: SearchResponseMessage[] }) => {
    //[x] style messages to chat boxes
    //[] sort messages by date, latest at the bottom
    //[] style received messages to left, sent messages to right

    const [singleMessage, setSingleMessage] = useState<string>('');
    const [threadMessages, setThreadMessages] = useState<ThreadMessage[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const getText = useCallback(async (id: string) => {
        setLoading(true);
        const body: GetEmailPostRequestBody = {
            account: testAccount,
            emailId: id,
        };
        try {
            const { html, plain } = await nextFetch<GetEmailPostResponseBody>('email-engine/email-text', {
                method: 'POST',
                body,
            });
            setSingleMessage(html ?? plain);
        } catch (error: any) {
            clientLogger(error, 'error');
            // toast(error.message)
        }
        setLoading(false);
    }, []);

    const getThreadEmailText = useCallback(
        async (messages: SearchResponseMessage[]) => {
            setThreadMessages([]);
            messages.forEach((message) => {
                if (message.text.id) {
                    getText(message.text.id);
                }
                setThreadMessages((prev) => [
                    ...prev,
                    {
                        subject: message.subject,
                        id: message.text.id,
                        from: message.from.name || message.from.address,
                        date: message.date,
                        text: singleMessage,
                    },
                ]);
            });
        },
        [getText, singleMessage],
    );

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
                            <div key={message.id} className="w-4/5 rounded-md border border-primary-200 p-2">
                                <div className="flex justify-between">
                                    <div className="text-sm text-gray-700">{message.from}</div>
                                    <div className="text-xs">{dateFormat(message.date, 'isoTime', true, true)}</div>
                                </div>
                                <div className="text-xs font-semibold text-gray-500">{message.subject}</div>
                                {/* <div className="my-2 text-xs">{message.text}</div>
                                 */}
                                <div>{message.id}</div>
                                {/* <div
                                    className="overflow-y-auto"
                                    dangerouslySetInnerHTML={{
                                        __html: cleanEmailBody(message.text),
                                    }}
                                /> */}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

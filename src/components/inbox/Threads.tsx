import type { SearchResponseMessage } from 'types/email-engine/account-account-search-post';
import { useCallback, useEffect, useRef, useState } from 'react';
import { clientLogger } from 'src/utils/logger-client';
import { getMessageText } from 'src/utils/api/email-engine/handle-messages';
import { cleanEmailBody } from 'src/utils/clean-html';
import { testEmail } from 'src/utils/api/email-engine/prototype-mocks';
import CommentCardsSkeleton from '../campaigns/comment-cards-skeleton';
import { useTranslation } from 'react-i18next';

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

    const endOfThread = useRef<null | HTMLDivElement>(null);
    const { i18n } = useTranslation();

    const scrollToBottom = () => {
        endOfThread.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const getThreadEmailText = useCallback(async (messages: SearchResponseMessage[]) => {
        const newThreadMessages: ThreadMessage[] = [];
        setThreadMessages([]);
        setLoading(true);
        try {
            for (const message of messages) {
                if (!message.text.id) {
                    throw new Error('No text id');
                }
                const { html } = await getMessageText(message.text.id);
                newThreadMessages.push({
                    subject: message.subject,
                    id: message.id,
                    from: message.from.name || message.from.address,
                    date: message.date,
                    text: html,
                    isMe: message.from.address === testEmail,
                });
            }
            setThreadMessages(newThreadMessages);
        } catch (error: any) {
            clientLogger(error, 'error');
            throw new Error('Error fetching thread: ' + error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!loading && threadMessages.length === 0) {
            getThreadEmailText(messages);
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading, messages]);

    useEffect(() => {
        scrollToBottom();
    }, [threadMessages]);

    return (
        <div className="h-full overflow-y-auto p-3">
            {loading ? (
                <CommentCardsSkeleton />
            ) : (
                <div className="flex w-full flex-col space-y-6">
                    {threadMessages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex w-[31.25rem] flex-col ${message.isMe ? 'self-end' : 'self-start'}`}
                        >
                            <div
                                className={`whitespace-normal rounded-md border border-primary-200 px-3 py-2 ${
                                    message.isMe ? ' bg-primary-100 bg-opacity-70' : ''
                                }`}
                            >
                                <div className="mb-3 flex flex-wrap justify-between">
                                    <div className="text-sm font-semibold text-gray-700">{message.from}</div>
                                </div>
                                <div
                                    className="text-xs"
                                    dangerouslySetInnerHTML={{
                                        __html: cleanEmailBody(message.text),
                                    }}
                                />
                            </div>
                            <div className={`${message.isMe ? 'self-end' : 'self-start'} mt-3 text-xs text-gray-400`}>
                                {new Date(message.date).toLocaleDateString(i18n.language, {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                })}{' '}
                                {new Date(message.date).toLocaleTimeString(i18n.language)}
                            </div>
                        </div>
                    ))}
                    <div ref={endOfThread} />
                </div>
            )}
        </div>
    );
};

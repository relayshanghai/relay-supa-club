import type { SearchResponseMessage } from 'types/email-engine/account-account-search-post';
import { useCallback, useEffect, useRef, useState } from 'react';
import { clientLogger } from 'src/utils/logger-client';
import { getMessageText } from 'src/utils/api/email-engine/handle-messages';
import { cleanEmailBody } from 'src/utils/clean-html';
import { testEmail } from 'src/utils/api/email-engine/prototype-mocks';
import CommentCardsSkeleton from '../campaigns/comment-cards-skeleton';
import { useTranslation } from 'react-i18next';
import type { ReplyTo } from 'types/email-engine/account-account-message-get';
import { ChevronDown } from '../icons';

export interface ThreadMessage {
    subject: string;
    id: string;
    from: string;
    to: ReplyTo[];
    cc: ReplyTo[];
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
                    to: message.to,
                    cc: message.cc,
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
        <div className="h-full overflow-y-auto p-6">
            {loading ? (
                <CommentCardsSkeleton />
            ) : (
                <div className="flex w-full flex-col space-y-6">
                    {threadMessages.map((message) => (
                        <div key={message.id} className="rounded-lg bg-white">
                            <div className="border-b-2 border-gray-200 p-6">
                                <div className="mb-3 text-lg font-semibold text-gray-400">
                                    From: <span className="text-gray-600">{message.isMe ? 'Me' : message.from}</span>{' '}
                                </div>
                                <div className="mb-3 text-sm font-medium text-gray-400">
                                    To: <span className="font-light">{message.to[0]?.address}</span>{' '}
                                </div>
                            </div>
                            <details className="p-6">
                                <summary className="flex list-none justify-end">
                                    <div className="mr-3 font-medium text-gray-300">
                                        {' '}
                                        {new Date(message.date).toLocaleDateString(i18n.language, {
                                            month: 'short',
                                            day: 'numeric',
                                        })}{' '}
                                        {new Date(message.date).toLocaleTimeString(i18n.language, {
                                            hour: 'numeric',
                                            minute: 'numeric',
                                        })}
                                    </div>
                                    <ChevronDown className="h-6 w-6 flex-none stroke-gray-400 stroke-2 text-white" />
                                </summary>
                                <div
                                    className="text-sm"
                                    dangerouslySetInnerHTML={{
                                        __html: cleanEmailBody(message.text),
                                    }}
                                />
                            </details>
                        </div>
                    ))}
                    <div ref={endOfThread} />
                </div>
            )}
        </div>
    );
};

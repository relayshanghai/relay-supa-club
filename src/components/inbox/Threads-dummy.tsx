import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUser } from 'src/hooks/use-user';
import { cleanEmailBody } from 'src/utils/clean-html';
import type { ReplyTo } from 'types/email-engine/account-account-message-get';
import type { SearchResponseMessage } from 'types/email-engine/account-account-search-post';
import CommentCardsSkeleton from '../campaigns/comment-cards-skeleton';
import { ChevronDown } from '../icons';
import { dummyThread } from './dummy_data';

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

export const Threads = ({
    messages,
}: {
    messages: SearchResponseMessage[];
    onInfluencerClick?: (message: ThreadMessage['from']) => void;
}) => {
    const { profile } = useUser();
    const [threadMessages, setThreadMessages] = useState<ThreadMessage[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const endOfThread = useRef<null | HTMLDivElement>(null);
    const { i18n, t } = useTranslation();

    const scrollToBottom = () => {
        endOfThread.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const getThreadEmailText = useCallback(
        async (messages: SearchResponseMessage[]) => {
            const newThreadMessages: ThreadMessage[] = [];
            setThreadMessages([]);
            setLoading(true);
            for (const message of messages) {
                const threads = dummyThread.filter((thread) => thread.threadId.includes(message.threadId)) || {
                    html: '<p>This is the HTML content for thread 3.</p>',
                    plain: 'This is the plain text content for thread 3.',
                };
                threads[newThreadMessages.length] &&
                    newThreadMessages.push({
                        subject: message.subject,
                        id: message.id,
                        from: message.from.name || message.from.address,
                        to: message.to,
                        cc: message.cc,
                        date: message.date,
                        text: threads[newThreadMessages.length].html,
                        isMe: message.from.address === profile?.sequence_send_email,
                    });
            }
            setThreadMessages(newThreadMessages);
            setLoading(false);
        },
        [profile?.sequence_send_email],
    );

    const lastThreadMessageId = useMemo(() => threadMessages[threadMessages.length - 1]?.id, [threadMessages]);

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
                        <div key={message.id} className="rounded-lg border bg-white shadow-sm hover:border-primary-500">
                            <div className="border-b-2 border-gray-200 p-6">
                                <div className="mb-3 text-lg font-semibold text-gray-400">
                                    {t('inbox.from')}:{' '}
                                    <span className="text-gray-600 hover:underline-offset-4">
                                        {message.isMe ? 'Me' : message.from}
                                    </span>{' '}
                                </div>
                                <div className="mb-3 pl-2 text-sm font-medium text-gray-400">
                                    {t('inbox.to')}: <span className="font-light">{message.to[0]?.address}</span>{' '}
                                </div>
                                {message.cc?.length > 0 && (
                                    <div className="mb-3 text-sm font-medium text-gray-400">
                                        {t('inbox.cc')}:{' '}
                                        <span className="font-light">{message.cc?.map((c) => c.address + ', ')}</span>{' '}
                                    </div>
                                )}
                            </div>
                            <details className="group px-6 py-2" open={lastThreadMessageId === message.id}>
                                <summary className="flex cursor-pointer list-none items-center justify-end focus-visible:outline-none focus-visible:ring focus-visible:ring-primary-200">
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
                                    <ChevronDown className="h-6 w-6 flex-none stroke-gray-400 stroke-2 text-white transition-transform group-open:-rotate-90" />
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

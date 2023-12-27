import { useCallback, useEffect, useState } from 'react';
import { MessagesComponent } from 'src/components/inbox/wip/message-component';
import { ReplyEditor } from 'src/components/inbox/wip/reply-editor';
import { ThreadHeader } from 'src/components/inbox/wip/thread-header';
import { type ThreadInfo, ThreadPreview, Message } from 'src/components/inbox/wip/thread-preview';
import { useUser } from 'src/hooks/use-user';
import { nextFetch } from 'src/utils/fetcher';
import { Filter, FilterType } from 'src/components/inbox/wip/filter';
import useSWR from 'swr';
import type { CurrentInbox } from 'src/components/inbox/wip/thread-preview';
import { now } from 'src/utils/datetime';
import { nanoid } from 'nanoid';
import { sendReply } from 'src/components/inbox/wip/utils';
import { useSequences } from 'src/hooks/use-sequences';

const fetcher = async (url: string) => {
    const res = await nextFetch(url);
    console.log('fetcher', res);
    return res;
};

const ThreadProvider = ({
    threadId,
    currentInbox,
    selectedThread,
}: {
    threadId: string;
    currentInbox: CurrentInbox;
    selectedThread: ThreadInfo;
}) => {
    const {
        data: messages,
        error: messagesError,
        isLoading,
        isValidating,
        mutate: refreshMessages,
    } = useSWR<Message[], any>(`outreach/threads/${threadId}`, fetcher, {
        revalidateOnFocus: true,
    });

    console.log(messages);

    const sampleFunction = useCallback(
        async (replyBody: string) => {
            await sendReply({
                replyBody: replyBody,
                threadId,
            });
            console.log('inside sendreply', messages);
            return messages;
        },
        [messages, threadId],
    );

    const handleReply = useCallback(
        (replyBody: string) => {
            refreshMessages(
                async (cache) => {
                    await sendReply({
                        replyBody: replyBody,
                        threadId,
                    });
                    console.log('inside sendreply', cache);
                    return [
                        {
                            date: '2023-12-22T07:03:57.000Z',
                            unread: false,
                            id: nanoid(),
                            from: {
                                name: 'LMNAO',
                                address: 'jiggling.potato@gmail.com',
                            },
                            to: [
                                {
                                    name: 'Suvojit Ghosh',
                                    address: 'ghoshsuvojit2012@gmail.com',
                                },
                            ],
                            cc: [],
                            replyTo: [
                                {
                                    name: 'LMNAO',
                                    address: 'jiggling.potato@gmail.com',
                                },
                            ],
                            subject: 'Re: 3rd Follow-up',
                            body: replyBody,
                        },
                        ...(cache ?? []),
                    ];
                },
                {
                    optimisticData: (cached) => {
                        const lol = [
                            {
                                date: '2023-12-22T07:03:57.000Z',
                                unread: false,
                                id: nanoid(),
                                from: {
                                    name: 'LMNAO',
                                    address: 'jiggling.potato@gmail.com',
                                },
                                to: [
                                    {
                                        name: 'Suvojit Ghosh',
                                        address: 'ghoshsuvojit2012@gmail.com',
                                    },
                                ],
                                cc: [],
                                replyTo: [
                                    {
                                        name: 'LMNAO',
                                        address: 'jiggling.potato@gmail.com',
                                    },
                                ],
                                subject: 'Re: 3rd Follow-up',
                                body: replyBody,
                            },
                            ...(cached ?? []),
                        ];
                        console.log('messages opt', lol);
                        return lol;
                    },
                    revalidate: false,
                },
            );
        },
        [threadId, refreshMessages],
    );

    if (messagesError) return <div>Error loading messages</div>;
    if (!messages) return <div>Loading messages...</div>;

    return (
        <>
            {/*<ThreadHeader currentInbox={currentInbox} threadInfo={{ ...selectedThread, messages }} />*/}

            <MessagesComponent currentInbox={currentInbox} messages={messages} />

            <ReplyEditor influencerEmail={selectedThread.sequenceInfluencers.email} onReply={handleReply} />
        </>
    );
};

const InboxPreview = () => {
    const { profile } = useUser();
    const currentInbox = {
        email: profile?.sequence_send_email,
    };
    const { sequences } = useSequences();
    const allSequences = sequences
        ?.filter((sequence) => sequence.company_id === profile?.company_id)
        .map((sequence) => {
            return {
                id: sequence.id,
                name: sequence.name,
            };
        });
    const [filters, setFilters] = useState<FilterType>({
        threadStatus: [],
        funnelStatus: [],
        sequences: [],
    });

    console.log('filter', filters);

    const {
        data: threads,
        error: threadsError,
        isLoading: isThreadsLoading,
    } = useSWR<ThreadInfo[], any>([filters], async () => {
        const res = await nextFetch('outreach/threads', {
            method: 'POST',
            body: filters,
        });
        console.log('threads', res);
        return res;
    });

    const [selectedThread, setSelectedThread] = useState(threads ? threads[0] : null);

    useEffect(() => {
        console.log(threads);
        if (threads) setSelectedThread(threads[0]);
    }, [threads]);

    if (!currentInbox.email) return <>Nothing to see here</>;
    return (
        <div className="grid h-full max-h-screen grid-cols-12 space-y-4 p-4">
            <section className="col-span-3 flex flex-col overflow-scroll">
                <Filter
                    messageCount={{ unopened: 4, unreplied: 1, replied: 5 }}
                    allSequences={allSequences ?? []}
                    filters={filters}
                    onChangeFilter={(newFilter: FilterType) => setFilters(newFilter)}
                />
                {threads ? (
                    threads.map((thread) => (
                        <ThreadPreview
                            key={thread.threadInfo.id}
                            sequenceInfluencer={thread.sequenceInfluencers}
                            threadInfo={thread}
                            _currentInbox={currentInbox}
                            selected={!!selectedThread && selectedThread.threadInfo.id === thread.threadInfo.id}
                            onClick={() => setSelectedThread(thread)}
                        />
                    ))
                ) : isThreadsLoading ? (
                    <>Loading</>
                ) : (
                    <>No threads here!</>
                )}
            </section>
            <section className="col-span-9 flex h-full flex-col">
                {selectedThread && (
                    <ThreadProvider
                        currentInbox={currentInbox}
                        threadId={selectedThread.threadInfo.threadId}
                        selectedThread={selectedThread}
                    />
                )}
            </section>
        </div>
    );
};

export default InboxPreview;

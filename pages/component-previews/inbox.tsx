import { useCallback, useEffect, useState } from 'react';
import { MessagesComponent } from 'src/components/inbox/wip/message-component';
import { ReplyEditor } from 'src/components/inbox/wip/reply-editor';
// import { ThreadHeader } from 'src/components/inbox/wip/thread-header';
import { type ThreadInfo, ThreadPreview, type Message as BaseMessage } from 'src/components/inbox/wip/thread-preview';
import { useUser } from 'src/hooks/use-user';
import { nextFetch } from 'src/utils/fetcher';
import { Filter, type FilterType } from 'src/components/inbox/wip/filter';
import useSWR from 'swr';
import type { CurrentInbox } from 'src/components/inbox/wip/thread-preview';
import { nanoid } from 'nanoid';
import { sendReply } from 'src/components/inbox/wip/utils';
import { useSequences } from 'src/hooks/use-sequences';
import { apiFetch } from 'src/utils/api/api-fetch';

const fetcher = async (url: string) => {
    const res = await apiFetch(url, {});
    return res.content;
};

type Message = BaseMessage & { isLocal?: true };

/**
 * Generate local Message object with isLocal attribute
 */
const generateLocalData = (params: { body: string }): Message => {
    const localId = nanoid(10);
    return {
        date: '2023-12-22T07:03:57.000Z',
        unread: false,
        id: localId,
        from: {
            name: 'LMNAO',
            address: 'jiggling.potato@gmail.com',
        },
        to: [
            {
                name: 'Suvojit Ghosh - ' + localId,
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
        body: params.body,
        isLocal: true,
    };
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
        mutate,
    } = useSWR<Message[], any>(`/api/outreach/threads/${threadId}`, fetcher, {
        // Note that this is disabled globally in SWRConfig
        revalidateOnFocus: true,
        refreshInterval: 5000,
        // Check if cached and fresh data are NOT the same, update if equal
        // i.e. returning FALSE updates the cache
        // Seems like compare is ran twice switching the "fresh" and "cached" data
        compare: (cached, fresh) => {
            // Do not update cache if both are undefined
            if (fresh === undefined && cached === undefined) {
                // console.log('UNDEFINED', { result: true, fresh, cached });
                return true;
            }

            // Update cache if fresh is empty
            if (!fresh && cached) {
                // console.log('NO FRESH YES CACHE', { result: true, fresh, cached });
                return false;
            }

            // Do not update cache if ids are equal
            if (cached && fresh && fresh.length === cached.length && fresh.length > 0 && cached.length > 0) {
                // if (cached[0].id !== fresh[0].id) {
                //     console.log('EQUAL', {
                //         result: cached[0].id === fresh[0].id,
                //         cached: cached[0].id,
                //         fresh: fresh[0].id,
                //     });
                // }

                return cached[0].id === fresh[0].id;
            }

            // console.log('UNEQUAL', {
            //     result: (fresh?.length ?? 0) < (cached?.length ?? 0),
            //     cached: (cached ?? [{ id: null }])[0].id,
            //     fresh: (fresh ?? [{ id: null }])[0].id,
            //     cachedLen: cached?.length,
            //     freshLen: fresh?.length,
            // });

            // Do not update the cache if fresh data has less items than the cached
            return (fresh?.length ?? 0) < (cached?.length ?? 0);
        },
    });

    const handleReply = useCallback(
        (replyBody: string) => {
            mutate(
                async (cache) => {
                    sendReply({
                        replyBody: replyBody,
                        threadId,
                    });
                    // Retain local data with generated data
                    const localMessage = generateLocalData({ body: replyBody });
                    // console.log('from mutator callback', cache, localMessage);
                    return [localMessage, ...(cache ?? [])];
                },
                {
                    // Optimistically update the UI
                    // Seems like this is discarded when MutatorCallback ^ resolves
                    optimisticData: (cache) => {
                        const localMessage = generateLocalData({ body: replyBody });
                        // console.log('from optimistic data', cache, localMessage);
                        return [localMessage, ...(cache ?? [])];
                    },
                    revalidate: false,
                    rollbackOnError: true,
                },
            );
        },
        [threadId, mutate],
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

    // console.log('filter', filters);

    const {
        data: threads,
        error: _threadsError,
        isLoading: isThreadsLoading,
    } = useSWR<ThreadInfo[], any>([filters], async () => {
        const res = await nextFetch('outreach/threads', {
            method: 'POST',
            body: filters,
        });
        // console.log('threads', res);
        return res;
    });

    const [selectedThread, setSelectedThread] = useState(threads ? threads[0] : null);

    useEffect(() => {
        // console.log(threads);
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

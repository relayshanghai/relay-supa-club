import type { UIEventHandler } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MessagesComponent } from 'src/components/inbox/wip/message-component';
import { ReplyEditor } from 'src/components/inbox/wip/reply-editor';
import { ThreadHeader } from 'src/components/inbox/wip/thread-header';
import {
    ThreadPreview,
    type Message as BaseMessage,
    ThreadPreviewSkeleton,
} from 'src/components/inbox/wip/thread-preview';
import type { ThreadContact, Thread as ThreadInfo, EmailContact } from 'src/utils/outreach/types';
import { useUser } from 'src/hooks/use-user';
import { Filter, type FilterType } from 'src/components/inbox/wip/filter';
import useSWRInfinite from 'swr/infinite';
import useSWR from 'swr';
import type { CurrentInbox } from 'src/components/inbox/wip/thread-preview';
import { nanoid } from 'nanoid';
import { sendForward, sendReply } from 'src/components/inbox/wip/utils';
import { useSequences } from 'src/hooks/use-sequences';
import { apiFetch } from 'src/utils/api/api-fetch';
import { Input } from 'shadcn/components/ui/input';
import { ProfileScreen } from 'src/components/influencer-profile/screens/profile-screen';
import type { GetThreadsApiRequest, GetThreadsApiResponse } from 'src/utils/endpoints/get-threads';
import type { UpdateThreadApiRequest, UpdateThreadApiResponse } from 'src/utils/endpoints/update-thread';
import { formatDate, now } from 'src/utils/datetime';
import { serverLogger } from 'src/utils/logger-server';
import { Search } from 'src/components/icons';
import { Layout } from 'src/components/layout';
import type { SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';
import { useAddress } from 'src/hooks/use-address';
import type { Attachment } from 'types/email-engine/account-account-message-get';
import { useTranslation } from 'react-i18next';
import { useCompany } from 'src/hooks/use-company';
import type { SequenceInfluencersPutRequestBody } from 'pages/api/sequence-influencers';
import { t } from 'i18next';
import { sortByUpdatedAtDesc } from 'src/components/inbox/helpers';
import { Skeleton } from 'shadcn/components/ui/skeleton';

const fetcher = async (url: string) => {
    const res = await apiFetch<any>(url);
    return res.content;
};

type Message = BaseMessage & { isLocal?: true };

const fileExtensionRegex = /.[^.\\/]*$/;

export const getAttachmentStyle = (filename: string) => {
    const extension = filename?.match(fileExtensionRegex)?.[0].replace('.', '');
    switch (extension) {
        case 'pdf':
            return 'bg-red-100 hover:bg-red-50 text-red-400 stroke-red-400';
        case 'xls' || 'xlsx' || 'csv':
            return 'bg-green-100 hover:bg-green-50 text-green-400 stroke-green-400';
        case 'doc' || 'docx':
            return 'bg-blue-100 hover:bg-blue-50 text-blue-400 stroke-blue-400';
        case 'ppt' || 'pptx':
            return 'bg-yellow-100 hover:bg-yellow-50 text-yellow-400 stroke-yellow-400';
        case 'png' || 'jpeg' || 'jpg' || 'svg' || 'webp':
            return 'bg-violet-100 hover:bg-violet-50 text-violet-400 stroke-violet-400';
        default:
            return 'bg-gray-100 hover:bg-gray-50 text-gray-400 stroke-gray-400';
    }
};

const emptyMessage: Message = {
    date: '2024-01-16T06:46:00.000Z',
    unread: false,
    id: 'empty-message-1',
    from: {
        name: 'No messages yet',
        address: 'sample@boostbot.ai',
    },
    to: [
        {
            name: 'You',
            address: 'you@example.com',
        },
    ],
    cc: [],
    replyTo: [],
    attachments: [],
    subject: 'Nothing to show here... yet',
    body: "<p>Make sure to contact some influencers from your <a href='/sequences'>Sequences</a> and come check your inbox in a day or two!</p>",
};

const emptyThread = {
    threadInfo: {
        id: 'f770bc12-d10d-467b-880b-43b43ea24412',
        thread_id: '1788228375458170330',
        sequence_influencer_id: '99257908-639b-4725-b62f-70f4581de67b',
        email_engine_account_id: 'oth98ylp8yhi87l5',
        last_reply_id: 'AAAAAQAAAsU',
        thread_status: 'unreplied',
        deleted_at: null,
        created_at: '2024-01-16T01:14:30.000Z',
        updated_at: '2024-01-16T01:24:04.443Z',
    },
    sequenceInfluencer: {
        id: '99257908-639b-4725-b62f-70f4581de67b',
        name: 'No messages yet',
        username: 'Check again later',
    },
    influencerSocialProfile: undefined,
    contacts: [
        {
            id: 'dcb43606-66e8-4074-845f-2c077713f908',
            name: 'LMNAO',
            address: 'jiggling.potato@gmail.com',
            created_at: '2024-01-16T06:43:41.651Z',
            type: 'user',
        },
        {
            id: '7e49423c-af84-4dcc-85ac-8eeb6883ff6e',
            name: 'Austinjpg',
            address: 'suvo.suvojitghosh@gmail.com',
            created_at: '2024-01-16T06:44:46.440Z',
            type: 'influencer',
        },
    ],
    sequenceInfo: {
        created_at: '2024-01-16T06:15:41.107Z',
        updated_at: '2024-01-16T06:15:41.107Z',
        company_id: 'd7326229-dbeb-41aa-8b9b-4baeb63d0d7f',
        name: 'General collaboration',
        auto_start: false,
        id: '055870b7-1d6a-46ed-b205-9b32b34bfd83',
        manager_first_name: 'William Edward X',
        manager_id: '591a6cba-301e-5690-81ef-4d1742d41871',
        deleted: false,
        productName: 'Widget X',
    },
};

/**
 * Generate local Message object with isLocal attribute
 */
const generateLocalData = (params: {
    body: string;
    from: EmailContact;
    to: EmailContact[];
    cc: EmailContact[];
    subject: string;
    attachments: Attachment[];
}): Message => {
    const localId = nanoid(10);
    return {
        date: now(),
        unread: false,
        id: localId,
        from: params.from,
        to: params.to,
        cc: params.cc,
        attachments: params.attachments,
        replyTo: params.to,
        subject: params.subject,
        body: params.body,
        isLocal: true,
    };
};

const getContactsToReply = (contacts: ThreadContact[], email?: string | null) => {
    const account = !email ? contacts.find((contact) => contact.type === 'user') : { address: email };
    if (!account) {
        throw new Error('Thread did not originate from boostbot');
    }

    const to = contacts.filter((contact) => {
        return contact.address !== account.address && ['cc', 'bcc'].includes(contact.type) === false;
    });

    const cc = contacts.filter((contact) => {
        return contact.address !== account.address && ['cc', 'bcc'].includes(contact.type) === true;
    });
    return { to, cc };
};

export type ThreadData = {
    threads: ThreadInfo[];
    totals: {
        unreplied: number;
        unopened: number;
        replied: number;
    };
    totalFiltered: number;
};

const ThreadProvider = ({
    threadId,
    currentInbox,
    selectedThread,
    filteredMessageIds,
    markAsReplied,
}: {
    threadId: string;
    currentInbox: CurrentInbox;
    selectedThread: ThreadInfo;
    filteredMessageIds?: string[];
    markAsReplied: (threadId: string) => void;
}) => {
    const {
        data: messages,
        error: messagesError,
        isLoading: isMessageLoading,
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
                return true;
            }

            // Update cache if fresh is empty
            if (!fresh && cached) {
                return false;
            }

            // Do not update cache if ids are equal
            if (cached && fresh && fresh.length === cached.length && fresh.length > 0 && cached.length > 0) {
                return cached[0].id === fresh[0].id;
            }

            // Do not update the cache if fresh data has less items than the cached
            return (fresh?.length ?? 0) < (cached?.length ?? 0);
        },
    });
    const { company } = useCompany();
    const [attachments, setAttachments] = useState<string[]>([]);
    const [replyClicked, setReplyClicked] = useState(false);
    const allUniqueParticipants = selectedThread.contacts;
    const contactsToReply = getContactsToReply(allUniqueParticipants, currentInbox.email);

    const handleAttachmentSelect = (files: string[]) => {
        if (!files) return serverLogger('No files attached');
        setAttachments((attached) => {
            return [...attached, ...files];
        });
    };

    useEffect(() => {
        setAttachments([]);
        setReplyClicked(false);
    }, [threadId]);

    const handleReply = useCallback(
        (replyBody: string, toList: EmailContact[], ccList: EmailContact[]) => {
            mutate(
                async (cache) => {
                    if (attachments && attachments.length > 0) {
                        const htmlAttachments = attachments.map((attachment) => {
                            return `<a target="__blank" href="${window.origin}/inbox/download/${company?.id}/attachments/${attachment}">${attachment}</a>`;
                            // return `<a target="__blank" href="${window.origin}/api/inbox/download-presign-url?path=${company?.id}/attachments/${attachment}">${attachment}</a>`;
                        });
                        // attach link of attachments to the html body content of the email
                        replyBody = `${replyBody}
                            <br/><br/>
                            <b>Attachments:</b><br/>
                            ${htmlAttachments.join('<br/>')}`;
                    }
                    sendReply({
                        replyBody: replyBody,
                        threadId,
                        cc: ccList,
                        to: toList,
                    });
                    // Retain local data with generated data
                    const localMessage = generateLocalData({
                        body: replyBody,
                        from: { name: 'Me', address: currentInbox.email || '' },
                        to: toList,
                        cc: ccList,
                        subject: messages?.[messages.length - 1]?.subject ?? '',
                        attachments: [],
                    });
                    setAttachments([]);
                    return [localMessage, ...(cache ?? [])];
                },
                {
                    // Optimistically update the UI
                    // Seems like this is discarded when MutatorCallback ^ resolves
                    optimisticData: (cache) => {
                        const localMessage = generateLocalData({
                            body: replyBody,
                            from: { name: 'Me', address: currentInbox.email || '' },
                            to: toList,
                            cc: ccList,
                            subject: messages?.[messages.length - 1]?.subject ?? '',
                            attachments: [],
                        });
                        return [localMessage, ...(cache ?? [])];
                    },
                    revalidate: false,
                    rollbackOnError: true,
                },
            );
            markAsReplied(threadId);
        },
        [threadId, mutate, markAsReplied, currentInbox, messages, attachments, company],
    );

    const handleForward = useCallback(
        (message: Message, forwardedTo: EmailContact[]) => {
            mutate(
                async (cache) => {
                    sendForward(message, forwardedTo);
                    // Retain local data with generated data
                    const localMessage = generateLocalData({
                        body: message.body,
                        from: { name: 'Me', address: currentInbox.email || '' },
                        to: message.to,
                        cc: message.cc,
                        subject: messages?.[messages.length - 1]?.subject ?? '',
                        attachments: message.attachments,
                    });
                    return [localMessage, ...(cache ?? [])];
                },
                {
                    // Optimistically update the UI
                    // Seems like this is discarded when MutatorCallback ^ resolves
                    optimisticData: (cache) => {
                        const localMessage = generateLocalData({
                            body: message.body,
                            from: { name: 'Me', address: currentInbox.email || '' },
                            to: message.to,
                            cc: message.cc,
                            subject: messages?.[messages.length - 1]?.subject ?? '',
                            attachments: message.attachments,
                        });
                        return [localMessage, ...(cache ?? [])];
                    },
                    revalidate: false,
                    rollbackOnError: true,
                },
            );
        },
        [mutate, currentInbox, messages],
    );

    const handleRemoveAttachment = useCallback(
        (file: string) => {
            setAttachments((attached) => attached && [...attached.filter((f) => f !== file)]);
        },
        [setAttachments],
    );
    const messageContainerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (messageContainerRef.current) {
            // scroll to bottom of messages container when new messages are loaded and rendered
            setTimeout(() => {
                messageContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 500);
        }
    }, [messages]);
    if (!messages && isMessageLoading) {
        return (
            <div className="m-4 flex flex-col space-y-4">
                {Array(4)
                    .fill(0)
                    .map((_, index) => (
                        <Skeleton key={index} className="flex h-12 rounded-lg bg-gray-300" />
                    ))}
            </div>
        );
    }
    if (messagesError || !Array.isArray(messages)) return <div>Error loading messages</div>;

    return (
        <div className="flex h-full flex-col bg-zinc-50">
            <div className="flex-none bg-zinc-50">
                <ThreadHeader
                    threadInfo={selectedThread}
                    messages={messages}
                    participants={allUniqueParticipants.map((participant) =>
                        participant.address === currentInbox.email ? 'Me' : participant.name ?? participant.address,
                    )}
                />
            </div>

            <div style={{ height: 10 }} className="m-5 flex-auto justify-center overflow-auto bg-zinc-50">
                <MessagesComponent
                    currentInbox={currentInbox}
                    messages={messages}
                    focusedMessageIds={filteredMessageIds}
                    onForward={handleForward}
                />
                <div ref={messageContainerRef} />
            </div>

            <div className="m-5 bg-white">
                <div className={`${replyClicked ? 'block' : 'hidden'}`}>
                    <ReplyEditor
                        defaultContacts={contactsToReply}
                        onReply={handleReply}
                        attachments={attachments}
                        handleRemoveAttachment={handleRemoveAttachment}
                        handleAttachmentSelect={handleAttachmentSelect}
                    />
                </div>
                <div
                    onClick={() => setReplyClicked(true)}
                    className={`w-full cursor-text rounded-lg border-2 border-gray-100 px-4 py-2 text-gray-300 ${
                        !replyClicked ? 'block' : 'hidden'
                    }`}
                >
                    {t('inbox.replyToThread')}
                </div>
            </div>
        </div>
    );
};

const optimisticUpdateSequenceInfluencer = (
    currentData: ThreadData[],
    newSequenceInfluencerData: SequenceInfluencersPutRequestBody,
): ThreadData[] => {
    // find the
    if (!currentData[0].threads) {
        return currentData;
    }
    // Find the index of the thread page that needs updating
    const pageIndex = currentData.findIndex(
        (page) =>
            page.threads.findIndex(
                (thread) => thread.threadInfo.sequence_influencer_id === newSequenceInfluencerData.id,
            ) !== -1,
    );

    const influencerIndex = currentData[pageIndex].threads.findIndex(
        (thread) => thread.threadInfo.sequence_influencer_id === newSequenceInfluencerData.id,
    );

    if (pageIndex === -1 || influencerIndex === -1) {
        return currentData;
    }

    const newThreadPages = [...currentData];
    const newThreads = [...newThreadPages[pageIndex].threads];
    const currentInfluencer = newThreads[influencerIndex].sequenceInfluencer;
    if (!currentInfluencer) {
        return currentData;
    }
    newThreads[influencerIndex] = {
        ...newThreads[influencerIndex],
        sequenceInfluencer: {
            ...currentInfluencer,
            ...newSequenceInfluencerData,
        },
    };
    newThreadPages[pageIndex] = { ...newThreadPages[pageIndex], threads: newThreads };

    return newThreadPages;
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

    const [searchTerm, setSearchTerm] = useState<string>('');

    const [loading, setLoading] = useState(false);

    const [filters, setFilters] = useState<FilterType>({
        threadStatus: [],
        funnelStatus: [],
        sequences: [],
        page: 0,
    });

    const getKey = useCallback(
        (
            page: number,
            previousPageData: {
                threads: ThreadInfo[];
                totals: {
                    unreplied: number;
                    unopened: number;
                    replied: number;
                };
                totalFiltered: number;
            },
        ) => {
            // If the previous page data is empty, we've reached the end and should not fetch more
            if (previousPageData && !previousPageData.threads.length) return null;
            // This function should return an array with the arguments for the fetcher
            // The `pageIndex` is zero-based and SWR will call this function with incremented `pageIndex`
            return {
                url: '/api/outreach/threads',
                params: { ...filters, searchTerm, page },
            };
        },
        [filters, searchTerm],
    );

    const {
        data,
        error: _threadsError,
        mutate: refreshThreads,
        size,
        setSize,
        isLoading: isThreadsLoading,
    } = useSWRInfinite(
        getKey,
        async ({ url, params }): Promise<ThreadData> => {
            setLoading(true);
            const { content } = await apiFetch<GetThreadsApiResponse, GetThreadsApiRequest>(url, {
                body: params,
            });
            const totals = {
                unreplied: content?.totals.find((t) => t.thread_status === 'unreplied')?.thread_status_total ?? 0,
                unopened: content?.totals.find((t) => t.thread_status === 'unopened')?.thread_status_total ?? 0,
                replied: content?.totals.find((t) => t.thread_status === 'replied')?.thread_status_total ?? 0,
            };

            setLoading(false);
            return { threads: content.data, totals: totals, totalFiltered: content.totalFiltered };
        },
        { revalidateFirstPage: false, revalidateOnFocus: true },
    );

    const threadsInfo = useMemo(() => {
        return {
            threads: (data && data.length > 0 && data.flatMap((page) => page.threads)) || undefined,
            totals: (data && data.length > 0 && data[0]?.totals) || undefined,
            totalFiltered: (data && data.length > 0 && data[0].totalFiltered) || undefined,
        };
    }, [data]);

    const threads =
        data &&
        data
            .flatMap((page) => page.threads)
            .reduce((uniqueThreads, currentThread) => {
                const isDuplicate = uniqueThreads.some(
                    (thread) => thread.threadInfo.thread_id === currentThread.threadInfo.thread_id,
                );
                if (!isDuplicate) {
                    uniqueThreads.push(currentThread);
                }
                return uniqueThreads;
            }, [] as ThreadInfo[]);

    const totals = useMemo(() => {
        return threadsInfo
            ? {
                  unopened: threadsInfo?.totals?.unopened || 0,
                  unreplied: threadsInfo?.totals?.unreplied || 0,
                  replied: threadsInfo?.totals?.replied || 0,
              }
            : { unopened: 0, unreplied: 0, replied: 0 };
    }, [threadsInfo]);
    const [selectedThread, setSelectedThread] = useState(threads ? threads[0] : null);

    const markThreadAsSelected = (thread: ThreadInfo) => {
        if (!thread) return;
        refreshThreads();
        if (thread.threadInfo.thread_status === 'unopened') {
            apiFetch<UpdateThreadApiResponse, UpdateThreadApiRequest>('/api/outreach/threads/{id}', {
                path: { id: thread.threadInfo.thread_id },
                body: {
                    thread_status: 'unreplied',
                },
            });
        }
        setSelectedThread(thread);
    };

    const markAsReplied = async (threadId: string) => {
        const thread = threads?.find((t) => t.threadInfo.thread_id === threadId);
        if (!thread) return;

        if (thread.threadInfo.thread_status === 'unreplied') {
            await apiFetch<UpdateThreadApiResponse, UpdateThreadApiRequest>('/api/outreach/threads/{id}', {
                path: { id: thread.threadInfo.thread_id },
                body: {
                    thread_status: 'replied',
                },
            });
        }

        refreshThreads();
    };

    const today = formatDate(new Date().toISOString(), '[date] [monthShort] [fullYear]');

    // Create a ref for the last thread element
    const lastThreadRef = useRef<HTMLDivElement>(null);

    // Callback function to load more items when the last one is observed
    const loadMoreThreads = useCallback(() => {
        // If there are no more items to load, return
        if (threadsInfo?.threads?.length === threadsInfo?.totalFiltered || loading) return;

        // Increase the page number
        setSize(size + 1);
    }, [size, setSize, threadsInfo?.threads, threadsInfo?.totalFiltered, loading]);

    const { address } = useAddress(selectedThread?.sequenceInfluencer);

    const onThreadContainerScroll: UIEventHandler<HTMLDivElement> = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollTop + clientHeight > scrollHeight - 5 && !isThreadsLoading) {
            loadMoreThreads();
        }
    };
    const onThreadListContainerScroll = useCallback(onThreadContainerScroll, [isThreadsLoading, loadMoreThreads]);
    useEffect(() => {
        if (threads && !selectedThread) markThreadAsSelected(threads[0]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [threads, selectedThread]);

    const threadsGroupedByUpdatedAt = useMemo(
        () =>
            threads?.reduce((acc, thread) => {
                if (!thread.threadInfo.updated_at) {
                    return acc;
                }
                const key = formatDate(thread.threadInfo.updated_at, '[date] [monthShort]');
                if (!acc[key]) {
                    acc[key] = [];
                }
                acc[key].push(thread);
                return acc;
            }, {} as { [key: string]: ThreadInfo[] }),
        [threads],
    );

    if (!currentInbox.email) return <>Nothing to see here</>;
    return (
        <Layout>
            <div className="flex h-full max-h-screen bg-white">
                <section
                    className="w-[280px] shrink-0 flex-col items-center gap-2 overflow-y-auto"
                    onScroll={onThreadListContainerScroll}
                >
                    <section className="flex w-full flex-col gap-4 p-2">
                        <SearchBar onSearch={(term) => setSearchTerm(term)} />
                        <Filter
                            messageCount={totals}
                            allSequences={allSequences ?? []}
                            filters={filters}
                            onChangeFilter={(newFilter: FilterType) => {
                                setSize(1);
                                refreshThreads();
                                threadsGroupedByUpdatedAt && setFilters(newFilter);
                            }}
                        />
                    </section>
                    {(() => {
                        if (!threadsGroupedByUpdatedAt && (isThreadsLoading || loading)) {
                            return (
                                <>
                                    <div className="inline-flex h-5 items-center justify-start gap-2.5 border-b border-gray-50 px-4 py-1">
                                        <div className="font-['Poppins'] text-[10px] font-medium leading-3 tracking-tight text-gray-400">
                                            Loading...
                                        </div>
                                    </div>
                                    <ThreadPreviewSkeleton />
                                </>
                            );
                        } else if (threadsGroupedByUpdatedAt) {
                            return (
                                <div className="flex w-full flex-col">
                                    {Object.keys(threadsGroupedByUpdatedAt)
                                        .sort((a, b) => {
                                            const dateA =
                                                threadsGroupedByUpdatedAt[a][0].threadInfo.last_reply_date ||
                                                threadsGroupedByUpdatedAt[a][0].threadInfo.updated_at;
                                            const dateB =
                                                threadsGroupedByUpdatedAt[b][0].threadInfo.last_reply_date ||
                                                threadsGroupedByUpdatedAt[b][0].threadInfo.updated_at;
                                            return sortByUpdatedAtDesc(dateA, dateB);
                                        })
                                        .map((date) => (
                                            <div key={date}>
                                                <div className="inline-flex h-5 items-center justify-start gap-2.5 border-b border-gray-50 px-4 py-1">
                                                    <div className="font-['Poppins'] text-[10px] font-medium leading-3 tracking-tight text-gray-400">
                                                        {date === today ? 'Today' : date}
                                                    </div>
                                                </div>
                                                {threadsGroupedByUpdatedAt[date].map((thread, index) => (
                                                    <div
                                                        key={thread.threadInfo.id}
                                                        ref={
                                                            index === threadsGroupedByUpdatedAt[date].length - 4
                                                                ? lastThreadRef
                                                                : null
                                                        }
                                                    >
                                                        <ThreadPreview
                                                            sequenceInfluencer={
                                                                thread.sequenceInfluencer as NonNullable<
                                                                    typeof thread.sequenceInfluencer
                                                                >
                                                            }
                                                            threadInfo={thread}
                                                            currentInbox={currentInbox}
                                                            selected={
                                                                !!selectedThread &&
                                                                selectedThread.threadInfo.id === thread.threadInfo.id
                                                            }
                                                            onClick={() => markThreadAsSelected(thread)}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    {((threadsInfo?.threads?.length ?? 0) < (threadsInfo?.totalFiltered ?? 0) ||
                                        loading) && (
                                        <>
                                            <div className="inline-flex h-5 items-center justify-start gap-2.5 border-b border-gray-50 px-4 py-1">
                                                <div className="font-['Poppins'] text-[10px] font-medium leading-3 tracking-tight text-gray-400">
                                                    Loading...
                                                </div>
                                            </div>
                                            <ThreadPreviewSkeleton />
                                        </>
                                    )}
                                </div>
                            );
                        } else {
                            return (
                                <ThreadPreview
                                    sequenceInfluencer={emptyThread.sequenceInfluencer as SequenceInfluencerManagerPage}
                                    // @ts-ignore
                                    threadInfo={emptyThread}
                                    _currentInbox={currentInbox}
                                    selected={false}
                                    onClick={() => {
                                        //
                                    }}
                                />
                            );
                        }
                    })()}
                </section>
                <section className={`h-full flex-auto flex-col`}>
                    {selectedThread ? (
                        <>
                            <ThreadProvider
                                currentInbox={currentInbox}
                                threadId={selectedThread.threadInfo.thread_id}
                                selectedThread={selectedThread}
                                markAsReplied={markAsReplied}
                            />
                        </>
                    ) : isThreadsLoading ? (
                        <div className="h-16 w-full animate-pulse bg-gray-100" />
                    ) : (
                        <div className="flex h-full flex-col bg-zinc-50">
                            <div className="flex-none bg-zinc-50">
                                <ThreadHeader
                                    // @ts-ignore
                                    threadInfo={emptyThread}
                                    messages={[emptyMessage]}
                                    participants={['Me']}
                                />
                            </div>

                            <div style={{ height: 10 }} className="m-5 flex-auto justify-center bg-zinc-50">
                                <MessagesComponent
                                    currentInbox={currentInbox}
                                    messages={[emptyMessage]}
                                    focusedMessageIds={['empty-message-1']}
                                    onForward={() => {
                                        //
                                    }}
                                />
                            </div>

                            <div className="w-full cursor-text rounded-lg border-2 border-gray-100 bg-white px-4 py-2 text-gray-300">
                                No conversation to reply to yet
                            </div>
                        </div>
                    )}
                </section>
                <section className="w-[360px] shrink-0 grow-0 overflow-y-auto">
                    {selectedThread && address && selectedThread.sequenceInfluencer && threadsInfo && (
                        <ProfileScreen
                            profile={selectedThread?.sequenceInfluencer}
                            influencerData={selectedThread?.influencerSocialProfile}
                            className="bg-white"
                            address={address}
                            onUpdateInfluencer={(update, revalidate) => {
                                refreshThreads(
                                    (previous) => {
                                        if (!previous) {
                                            return previous;
                                        }
                                        /** just changes the TheadInfo local data for the influencer, does not trigger a database update */
                                        return optimisticUpdateSequenceInfluencer(previous, update);
                                    },
                                    { revalidate },
                                );
                            }}
                        />
                    )}
                </section>
            </div>
        </Layout>
    );
};

const SearchBar = ({ onSearch }: { onSearch: (searchTerm: string) => void }) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const { t } = useTranslation();
    return (
        <div className="flex h-9 w-full flex-row items-center justify-between rounded-md border border-gray-200 bg-white px-2 shadow">
            <Search className="h-5 w-5 fill-gray-400" />
            <Input
                className="focus:ring-none focus-visible:ring-none border-none text-xs shadow-none placeholder:text-gray-400 focus-visible:ring-0"
                placeholder={t('inbox.searchPlaceholder') || 'Search inbox'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        onSearch(searchTerm);
                    }
                }}
                onBlur={() => onSearch(searchTerm)}
            />
        </div>
    );
};

export default InboxPreview;

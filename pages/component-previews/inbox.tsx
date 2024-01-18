import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MessagesComponent } from 'src/components/inbox/wip/message-component';
import { ReplyEditor } from 'src/components/inbox/wip/reply-editor';
import { ThreadHeader } from 'src/components/inbox/wip/thread-header';
import { ThreadPreview, type Message as BaseMessage } from 'src/components/inbox/wip/thread-preview';
import type { AttachmentFile, ThreadContact, Thread as ThreadInfo, EmailContact } from 'src/utils/outreach/types';
import { useUser } from 'src/hooks/use-user';
import { Filter, type FilterType } from 'src/components/inbox/wip/filter';
import useSWR from 'swr';
import type { CurrentInbox } from 'src/components/inbox/wip/thread-preview';
import { nanoid } from 'nanoid';
import { sendForward, sendReply } from 'src/components/inbox/wip/utils';
import { useSequences } from 'src/hooks/use-sequences';
import { apiFetch } from 'src/utils/api/api-fetch';
import { Input } from 'shadcn/components/ui/input';
import type { ProfileValue } from 'src/components/influencer-profile/screens/profile-screen';
import { ProfileScreen } from 'src/components/influencer-profile/screens/profile-screen';
import { mapProfileToFormData } from 'src/components/inbox/helpers';
import type { GetThreadsApiRequest, GetThreadsApiResponse } from 'src/utils/endpoints/get-threads';
import type { UpdateThreadApiRequest, UpdateThreadApiResponse } from 'src/utils/endpoints/update-thread';
import { formatDate, now } from 'src/utils/datetime';
import type { AttachmentFieldProps } from 'src/components/inbox/wip/attachment-field';
import { serverLogger } from 'src/utils/logger-server';
import { Search, Spinner } from 'src/components/icons';
import { Layout } from 'src/components/layout';
import type { SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';
import { useAddress } from 'src/hooks/use-address';
import type { Attachment } from 'types/email-engine/account-account-message-get';

const fetcher = async (url: string) => {
    const res = await apiFetch<any>(url);
    return res.content;
};

type Message = BaseMessage & { isLocal?: true };

const fileExtensionRegex = /.[^.\\/]*$/;

export const getAttachmentStyle = (filename: string) => {
    const extension = filename.match(fileExtensionRegex)?.[0].replace('.', '');
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

    const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
    const [replyClicked, setReplyClicked] = useState(false);
    const allUniqueParticipants = selectedThread.contacts;
    const contactsToReply = getContactsToReply(allUniqueParticipants, currentInbox.email);

    const handleAttachmentSelect: AttachmentFieldProps['onChange'] = (files, error) => {
        if (error) return serverLogger(error);
        if (files === null) return serverLogger('No files attached');
        setAttachments((attached) => {
            const attachedPool = attached.map((a) => a.id);
            const filtered = files.filter((f) => attachedPool.includes(f.id) === false);
            return [...attached, ...filtered];
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
                    sendReply({
                        replyBody: replyBody,
                        threadId,
                        cc: ccList,
                        to: toList,
                        attachments,
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
        [threadId, mutate, markAsReplied, currentInbox, messages, attachments],
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
        (file: AttachmentFile) => {
            setAttachments((attached) => attached && [...attached.filter((f) => f.id !== file.id)]);
        },
        [setAttachments],
    );

    if (!messages && isMessageLoading) return <div className="m-4 flex h-16 animate-pulse rounded-lg bg-gray-400" />;
    if (messagesError || !Array.isArray(messages)) return <div>Error loading messages</div>;
    return (
        <div className="flex h-full flex-col bg-zinc-50">
            <div className="flex-none bg-zinc-50 p-1">
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
                    Reply to thread
                </div>
            </div>
        </div>
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
    const [page, setPage] = useState(0);

    const [filters, setFilters] = useState<FilterType>({
        threadStatus: [],
        funnelStatus: [],
        sequences: [],
        page,
    });

    const [searchResults, setSearchResults] = useState<{ [key: string]: string[] }>({});
    const [threads, setThreads] = useState<ThreadInfo[]>([]);

    const handleSearch = useCallback(
        async (searchTerm: string) => {
            if (!searchTerm || threads.length === 0) {
                setSearchResults({});
                return;
            }
            // @inbox-note it is easy to just put the type here but
            // we want to validate those types in the endpoint instead of casting/inferring the type
            const res = await apiFetch<{ [key: string]: string[] }, { query: { searchTerm: string } }>(
                '/api/outreach/search',
                {
                    query: { searchTerm },
                },
            );
            setSearchResults(res.content);
        },
        [threads],
    );

    const {
        data: threadsInfo,
        error: _threadsError,
        isLoading: isThreadsLoading,
    } = useSWR(
        [filters, page, searchResults],
        async () => {
            const { content } = await apiFetch<GetThreadsApiResponse, GetThreadsApiRequest>('/api/outreach/threads', {
                body: { ...filters, threadIds: Object.keys(searchResults), page },
            });

            const totals = {
                unreplied: content.totals.find((t) => t.thread_status === 'unreplied')?.thread_status_total ?? 0,
                unopened: content.totals.find((t) => t.thread_status === 'unopened')?.thread_status_total ?? 0,
                replied: content.totals.find((t) => t.thread_status === 'replied')?.thread_status_total ?? 0,
            };

            return { threads: content.data, totals: totals };
        },
        { revalidateOnFocus: true },
    );

    // merge and dedupe previous threads to the newly fetched ones
    useEffect(() => {
        if (!threadsInfo || threadsInfo.threads.length <= 0) return;

        setThreads((previousThreads) => {
            const existingThreadIds = previousThreads.map((thread) => thread.threadInfo.thread_id);
            const uniqueThreads = threadsInfo.threads.filter(
                (thread) => !existingThreadIds.includes(thread.threadInfo.thread_id),
            );

            return [...previousThreads, ...uniqueThreads];
        });
    }, [threadsInfo]);

    const totals = useMemo(() => threadsInfo?.totals ?? { unopened: 0, unreplied: 0, replied: 0 }, [threadsInfo]);

    const [selectedThread, setSelectedThread] = useState(threads ? threads[0] : null);
    const [initialValue, setLocalProfile] = useState<ProfileValue | null>(null);

    const markThreadAsSelected = (thread: ThreadInfo) => {
        if (!thread) return;
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

    const markAsReplied = (threadId: string) => {
        const thread = threads?.find((t) => t.threadInfo.thread_id === threadId);
        if (!thread) return;

        if (thread.threadInfo.thread_status === 'unreplied') {
            apiFetch<UpdateThreadApiResponse, UpdateThreadApiRequest>('/api/outreach/threads/{id}', {
                path: { id: thread.threadInfo.thread_id },
                body: {
                    thread_status: 'replied',
                },
            });
        }
    };

    const today = formatDate(new Date().toISOString(), '[date] [monthShort] [fullYear]');

    // Create a ref for the last thread element
    const lastThreadRef = useRef<HTMLDivElement>(null);

    // Callback function to load more items when the last one is observed
    const loadMoreThreads = useCallback(() => {
        const totalThreads = totals.replied + totals.unopened + totals.unreplied;
        if (threads && threads.length > 0 && threads.length < totalThreads && !isThreadsLoading) {
            setPage(Math.floor(threads.length / totalThreads) + 1);
        }
    }, [setPage, threads, totals, isThreadsLoading]);

    const { address } = useAddress(selectedThread?.sequenceInfluencer?.influencer_social_profile_id);

    useEffect(() => {
        if (!threadsInfo) return;
        const currentThread = lastThreadRef.current;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isThreadsLoading) {
                    loadMoreThreads();
                }
            },
            { threshold: 1.0 },
        );

        if (lastThreadRef.current) {
            observer.observe(lastThreadRef.current);
        }

        // Clean up observer on component unmount
        return () => {
            if (currentThread) {
                observer.unobserve(currentThread);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadMoreThreads, lastThreadRef.current, threadsInfo, isThreadsLoading]);

    useEffect(() => {
        if (threads && !selectedThread) markThreadAsSelected(threads[0]);
    }, [threads, selectedThread]);

    useEffect(() => {
        if (selectedThread?.sequenceInfluencer) {
            setLocalProfile(mapProfileToFormData(selectedThread.sequenceInfluencer));
        }
    }, [selectedThread]);

    const threadsGroupedByUpdatedAt = threads?.reduce((acc, thread) => {
        if (!thread.threadInfo.updated_at) {
            return acc;
        }
        const key = formatDate(thread.threadInfo.updated_at, '[date] [monthShort] [fullYear]');
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(thread);
        return acc;
    }, {} as { [key: string]: ThreadInfo[] });

    if (!currentInbox.email) return <>Nothing to see here</>;
    return (
        <Layout>
            <div className="flex h-full max-h-screen bg-white">
                <section className="w-[280px] flex-col items-center gap-2 overflow-y-auto">
                    <section className="flex w-full flex-col gap-4 p-2">
                        <SearchBar onSearch={handleSearch} />
                        <Filter
                            messageCount={totals}
                            allSequences={allSequences ?? []}
                            filters={filters}
                            onChangeFilter={(newFilter: FilterType) => {
                                threadsGroupedByUpdatedAt && setFilters(newFilter);
                            }}
                        />
                    </section>
                    {threadsGroupedByUpdatedAt ? (
                        <div className="flex w-full flex-col">
                            {Object.keys(threadsGroupedByUpdatedAt).map((date) => (
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
                                                index === threadsGroupedByUpdatedAt[date].length - 1
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
                        </div>
                    ) : isThreadsLoading ? (
                        <div className="h-16 animate-pulse bg-gray-400" />
                    ) : (
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
                    )}
                    {isThreadsLoading && <Spinner className="h-6 w-6 fill-primary-400" />}
                </section>
                <section className={`h-full flex-auto flex-col`}>
                    {selectedThread ? (
                        <ThreadProvider
                            currentInbox={currentInbox}
                            threadId={selectedThread.threadInfo.thread_id}
                            selectedThread={selectedThread}
                            markAsReplied={markAsReplied}
                            filteredMessageIds={searchResults[selectedThread.threadInfo.thread_id]}
                        />
                    ) : (
                        <div className="flex h-full flex-col bg-zinc-50">
                            <div className="flex-none bg-zinc-50 p-1">
                                <ThreadHeader
                                    // @ts-ignore
                                    threadInfo={emptyThread}
                                    messages={[emptyMessage]}
                                    participants={['Me']}
                                />
                            </div>

                            <div
                                style={{ height: 10 }}
                                className="m-5 flex-auto justify-center overflow-auto bg-zinc-50"
                            >
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
                <section className="w-[360px] overflow-y-auto">
                    {initialValue && selectedThread && address && selectedThread.sequenceInfluencer && (
                        <ProfileScreen
                            // @ts-ignore
                            profile={selectedThread?.sequenceInfluencer}
                            influencerData={selectedThread?.influencerSocialProfile}
                            className="bg-white"
                            address={address}
                        />
                    )}
                </section>
            </div>
        </Layout>
    );
};

const SearchBar = ({ onSearch }: { onSearch: (searchTerm: string) => void }) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    return (
        <div className="flex h-9 w-full flex-row items-center justify-between rounded-md border border-gray-200 bg-white px-2 shadow">
            <Search className="h-5 w-5 fill-gray-400" />
            <Input
                className="focus:ring-none focus-visible:ring-none border-none text-xs shadow-none placeholder:text-gray-400 focus-visible:ring-0"
                placeholder="Search mailbox"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        onSearch(searchTerm);
                    }
                }}
            />
        </div>
    );
};

export default InboxPreview;

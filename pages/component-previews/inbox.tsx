import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MessagesComponent } from 'src/components/inbox/wip/message-component';
import { ReplyEditor } from 'src/components/inbox/wip/reply-editor';
import { ThreadHeader } from 'src/components/inbox/wip/thread-header';
import { ThreadPreview, type Message as BaseMessage } from 'src/components/inbox/wip/thread-preview';
import type { AttachmentFile, ThreadContact, Thread as ThreadInfo } from 'src/utils/outreach/types';
import type { EmailContact } from 'src/utils/outreach/types';
import { useUser } from 'src/hooks/use-user';
import { Filter, type FilterType } from 'src/components/inbox/wip/filter';
import useSWR from 'swr';
import type { CurrentInbox } from 'src/components/inbox/wip/thread-preview';
import { nanoid } from 'nanoid';
import { sendForward, sendReply } from 'src/components/inbox/wip/utils';
import { useSequences } from 'src/hooks/use-sequences';
import { apiFetch } from 'src/utils/api/api-fetch';
import { Input } from 'shadcn/components/ui/input';
import { ProfileScreenProvider, useUiState } from 'src/components/influencer-profile/screens/profile-screen-context';
import type { ProfileValue } from 'src/components/influencer-profile/screens/profile-screen';
import { ProfileScreen } from 'src/components/influencer-profile/screens/profile-screen';
import { mapProfileToFormData } from 'src/components/inbox/helpers';
import { useSequenceInfluencers } from 'src/hooks/use-sequence-influencers';
import { useSequenceInfluencerNotes } from 'src/hooks/use-sequence-influencer-notes';
import { NotesListOverlayScreen } from 'src/components/influencer-profile/screens/notes-list-overlay';
import type { GetThreadsApiRequest, GetThreadsApiResponse } from 'src/utils/endpoints/get-threads';
import type { UpdateThreadApiRequest, UpdateThreadApiResponse } from 'src/utils/endpoints/update-thread';
import { formatDate, now } from 'src/utils/datetime';
import type { AttachmentFieldProps } from 'src/components/inbox/wip/attachment-field';
import { serverLogger } from 'src/utils/logger-server';
import { Search, Spinner } from 'src/components/icons';
import { Layout } from 'src/components/layout';

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

/**
 * Generate local Message object with isLocal attribute
 */
const generateLocalData = (params: {
    body: string;
    from: EmailContact;
    to: EmailContact[];
    cc: EmailContact[];
    subject: string;
    attachments: AttachmentFile[];
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
        isLoading: isMessagesLoading,
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
                    // console.log('from mutator callback', cache, localMessage);
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
                        // console.log('from optimistic data', cache, localMessage);
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
                    // console.log('from mutator callback', cache, localMessage);
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
                        // console.log('from optimistic data', cache, localMessage);
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

    if (!messages || isMessagesLoading) return <div>Loading messages...</div>;
    if (messagesError || !Array.isArray(messages)) {
        console.log(messages);
        return <div>Error loading messages</div>;
    }

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

            <div className="m-2 flex-none bg-white">
                {replyClicked ? (
                    <ReplyEditor
                        defaultContacts={contactsToReply}
                        onReply={handleReply}
                        attachments={attachments}
                        handleRemoveAttachment={handleRemoveAttachment}
                        handleAttachmentSelect={handleAttachmentSelect}
                    />
                ) : (
                    <div
                        onClick={() => setReplyClicked(true)}
                        className="w-full cursor-text rounded-lg border-2 border-gray-100 px-4 py-2 text-gray-300"
                    >
                        Reply to thread
                    </div>
                )}
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

    const handleSearch = async (searchTerm: string) => {
        if (!searchTerm) {
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
    };

    const [threads, setThreads] = useState<ThreadInfo[]>([]);

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
    const [uiState, setUiState] = useUiState();

    const [selectedThread, setSelectedThread] = useState(threads ? threads[0] : null);
    const [initialValue, setLocalProfile] = useState<ProfileValue | null>(null);
    const { refreshSequenceInfluencers } = useSequenceInfluencers();
    const { getNotes, saveSequenceInfluencer } = useSequenceInfluencerNotes();

    const handleNoteListOpen = useCallback(() => {
        if (!selectedThread?.sequenceInfluencer) return;
        getNotes.call(selectedThread?.sequenceInfluencer.id);
    }, [getNotes, selectedThread?.sequenceInfluencer]);

    const handleNoteListClose = useCallback(() => {
        setUiState((s) => {
            return { ...s, isNotesListOverlayOpen: false };
        });
        getNotes.refresh();
    }, [getNotes, setUiState]);

    const handleUpdate = useCallback(
        (data: Partial<ProfileValue>) => {
            if (!selectedThread?.sequenceInfluencer) return;

            saveSequenceInfluencer.call(selectedThread?.sequenceInfluencer.id, data).then((profile) => {
                // @note updates local state without additional query
                //       this will cause issue showing previous state though
                setLocalProfile(mapProfileToFormData(profile));
                saveSequenceInfluencer.refresh();

                refreshSequenceInfluencers();
            });
        },
        [saveSequenceInfluencer, selectedThread?.sequenceInfluencer, refreshSequenceInfluencers, setLocalProfile],
    );

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
            <div className="grid h-full max-h-screen grid-cols-12 bg-white">
                <section className="col-span-2 flex w-full flex-col items-center gap-2 overflow-y-auto">
                    <section className="flex w-full flex-col gap-4 p-2">
                        <SearchBar onSearch={handleSearch} />
                        <Filter
                            messageCount={totals}
                            allSequences={allSequences ?? []}
                            filters={filters}
                            onChangeFilter={(newFilter: FilterType) => setFilters(newFilter)}
                        />
                    </section>
                    {threadsGroupedByUpdatedAt ? (
                        <div className="flex w-full flex-col">
                            {Object.keys(threadsGroupedByUpdatedAt).map((date) => (
                                <div key={date}>
                                    <p className="px-2 py-1 text-xs font-semibold text-gray-400">
                                        {date === today ? 'Today' : date}
                                    </p>
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
                                                _currentInbox={currentInbox}
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
                        <Spinner className="h-6 w-6 fill-primary-400" />
                    ) : (
                        <>No threads here!</>
                    )}
                    {isThreadsLoading && <Spinner className="h-6 w-6 fill-primary-400" />}
                </section>
                <section className="col-span-6 flex h-full flex-col">
                    {selectedThread && (
                        <ThreadProvider
                            currentInbox={currentInbox}
                            threadId={selectedThread.threadInfo.thread_id}
                            selectedThread={selectedThread}
                            markAsReplied={markAsReplied}
                            filteredMessageIds={searchResults[selectedThread.threadInfo.thread_id]}
                        />
                    )}
                </section>
                {initialValue && selectedThread && selectedThread.sequenceInfluencer && (
                    <section className="col-span-4 h-full overflow-x-clip overflow-y-scroll">
                        <ProfileScreenProvider initialValue={initialValue}>
                            <ProfileScreen
                                profile={selectedThread?.sequenceInfluencer}
                                influencerData={selectedThread?.influencerSocialProfile}
                                className="bg-white"
                                onCancel={() => {
                                    //
                                }}
                                onUpdate={handleUpdate}
                            />
                        </ProfileScreenProvider>
                        <NotesListOverlayScreen
                            notes={getNotes.data}
                            isLoading={getNotes.isLoading}
                            isOpen={uiState.isNotesListOverlayOpen}
                            onClose={handleNoteListClose}
                            onOpen={handleNoteListOpen}
                            influencerSocialProfileId={selectedThread?.sequenceInfluencer?.id}
                        />
                    </section>
                )}
            </div>
        </Layout>
    );
};

const SearchBar = ({ onSearch }: { onSearch: (searchTerm: string) => void }) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    return (
        <div className="flex w-full flex-row items-center justify-between rounded-lg border border-gray-200 bg-white px-2">
            <Search className="h-5 w-5 fill-gray-400" />
            <Input
                className="focus-visible:ring-none border-none bg-white text-sm placeholder:text-gray-400 focus:border-none focus-visible:outline-none"
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

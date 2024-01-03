import { useCallback, useEffect, useRef, useState } from 'react';
import { MessagesComponent } from 'src/components/inbox/wip/message-component';
import { ReplyEditor } from 'src/components/inbox/wip/reply-editor';
import { ThreadHeader } from 'src/components/inbox/wip/thread-header';
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
import { Input } from 'shadcn/components/ui/input';
import { ProfileScreenProvider, useUiState } from 'src/components/influencer-profile/screens/profile-screen-context';
import { ProfileScreen, ProfileValue } from 'src/components/influencer-profile/screens/profile-screen';
import { mapProfileToFormData } from 'src/components/inbox/helpers';
import { useSequenceInfluencers } from 'src/hooks/use-sequence-influencers';
import { useSequenceInfluencerNotes } from 'src/hooks/use-sequence-influencer-notes';
import { NotesListOverlayScreen } from 'src/components/influencer-profile/screens/notes-list-overlay';
import { THREAD_STATUS } from 'src/utils/outreach/constants';

const fetcher = async (url: string) => {
    const res = await apiFetch<any>(url);
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
    filteredMessageIds,
    markAsReplied,
}: {
    threadId: string;
    currentInbox: CurrentInbox;
    selectedThread: ThreadInfo;
    filteredMessageIds?: string[];
    markAsReplied: () => void;
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
            markAsReplied();
        },
        [threadId, mutate, markAsReplied],
    );

    if (messagesError) return <div>Error loading messages</div>;
    if (!messages) return <div>Loading messages...</div>;

    return (
        <div className="flex h-full flex-col justify-between">
            <div className="h-full">
                <ThreadHeader currentInbox={currentInbox} threadInfo={{ ...selectedThread, messages }} />
                <div className="h-[50vh] overflow-scroll">
                    <MessagesComponent
                        currentInbox={currentInbox}
                        messages={messages}
                        focusedMessageIds={filteredMessageIds}
                    />
                </div>
            </div>
            <ReplyEditor
                influencer={{
                    name: selectedThread.sequenceInfluencers.name,
                    address: selectedThread.sequenceInfluencers.email,
                }}
                onReply={handleReply}
            />
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
    const [filters, setFilters] = useState<FilterType>({
        threadStatus: [],
        funnelStatus: [],
        sequences: [],
    });

    const [searchResults, setSearchResults] = useState<{ [key: string]: string[] }>({});

    const handleSearch = async (searchTerm: string) => {
        if (!searchTerm) {
            setSearchResults({});
            return;
        }
        const res = await apiFetch<{ [key: string]: string[] }, { query: { searchTerm: string } }>(
            '/api/outreach/search',
            {
                query: { searchTerm },
            },
        );
        console.log(res);
        setSearchResults(res.content);
    };

    const {
        data: threadsInfo,
        error: _threadsError,
        isLoading: isThreadsLoading,
    } = useSWR<
        {
            threads: ThreadInfo[];
            totals: {
                threadStatus: THREAD_STATUS;
                threadStatusTotal: number;
            }[];
        },
        any
    >(
        [filters, searchResults],
        async () => {
            const res = await nextFetch('outreach/threads', {
                method: 'POST',
                body: { filters, threadIds: Object.keys(searchResults) },
            });
            return { threads: res.data, totals: res.totals };
        },
        { refreshInterval: 500 },
    );
    const threads = threadsInfo?.threads;
    const totals = {
        unreplied: threadsInfo?.totals.find((t) => t.threadStatus === 'unreplied')?.threadStatusTotal ?? 0,
        unopened: threadsInfo?.totals.find((t) => t.threadStatus === 'unopened')?.threadStatusTotal ?? 0,
        replied: threadsInfo?.totals.find((t) => t.threadStatus === 'replied')?.threadStatusTotal ?? 0,
    };
    const [uiState, setUiState] = useUiState();

    const [selectedThread, setSelectedThread] = useState(threads ? threads[0] : null);
    const [initialValue, setLocalProfile] = useState<ProfileValue | null>(null);
    const { refreshSequenceInfluencers } = useSequenceInfluencers();
    const { getNotes, saveSequenceInfluencer } = useSequenceInfluencerNotes();

    const handleNoteListOpen = useCallback(() => {
        if (!selectedThread?.sequenceInfluencers) return;
        getNotes.call(selectedThread?.sequenceInfluencers.id);
    }, [getNotes, selectedThread?.sequenceInfluencers]);

    const handleNoteListClose = useCallback(() => {
        setUiState((s) => {
            return { ...s, isNotesListOverlayOpen: false };
        });
        getNotes.refresh();
    }, [getNotes, setUiState]);

    const handleUpdate = useCallback(
        (data: Partial<ProfileValue>) => {
            if (!selectedThread?.sequenceInfluencers) return;

            saveSequenceInfluencer.call(selectedThread?.sequenceInfluencers.id, data).then((profile) => {
                // @note updates local state without additional query
                //       this will cause issue showing previous state though
                setLocalProfile(mapProfileToFormData(profile));
                saveSequenceInfluencer.refresh();

                refreshSequenceInfluencers();
            });
        },
        [saveSequenceInfluencer, selectedThread?.sequenceInfluencers, refreshSequenceInfluencers, setLocalProfile],
    );

    const markThreadAsSelected = (thread: ThreadInfo) => {
        if (thread.threadInfo.threadStatus === 'unopened') {
            apiFetch('/api/outreach/threads/{threadId}', {
                method: 'POST',
                path: { threadId: thread.threadInfo.threadId },
                query: {
                    id: thread.threadInfo.threadId,
                },
                body: {
                    threadStatus: 'unreplied',
                },
            });
        }
        setSelectedThread(thread);
    };

    const markAsReplied = (thread: ThreadInfo) => {
        if (thread.threadInfo.threadStatus === 'unreplied') {
            apiFetch('/api/outreach/threads/{threadId}', {
                method: 'POST',
                path: { threadId: thread.threadInfo.threadId },
                query: {
                    id: thread.threadInfo.threadId,
                },
                body: {
                    threadStatus: 'replied',
                },
            });
        }
    };

    useEffect(() => {
        // console.log(threads);
        if (threads) markThreadAsSelected(threads[0]);
    }, [threads]);

    useEffect(() => {
        if (selectedThread?.sequenceInfluencers) {
            setLocalProfile(mapProfileToFormData(selectedThread.sequenceInfluencers));
        }
    }, [selectedThread]);

    console.log(selectedThread?.sequenceInfluencers);

    if (!currentInbox.email) return <>Nothing to see here</>;
    return (
        <div className="grid h-full max-h-screen grid-cols-12 space-y-4 p-4">
            <section className="col-span-3 flex flex-col gap-2 overflow-scroll">
                <SearchBar onSearch={handleSearch} />
                <Filter
                    messageCount={totals}
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
                            onClick={() => markThreadAsSelected(thread)}
                        />
                    ))
                ) : isThreadsLoading ? (
                    <>Loading</>
                ) : (
                    <>No threads here!</>
                )}
            </section>
            <section className="col-span-5 flex h-full flex-col">
                {selectedThread && (
                    <ThreadProvider
                        currentInbox={currentInbox}
                        threadId={selectedThread.threadInfo.threadId}
                        selectedThread={selectedThread}
                        markAsReplied={markAsReplied}
                        filteredMessageIds={searchResults[selectedThread.threadInfo.threadId]}
                    />
                )}
            </section>
            {initialValue && (
                <section className="col-span-4">
                    <ProfileScreenProvider initialValue={initialValue}>
                        <ProfileScreen
                            profile={selectedThread?.sequenceInfluencers}
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
                        influencerSocialProfileId={selectedThread?.sequenceInfluencers?.id}
                    />
                </section>
            )}
        </div>
    );
};

const SearchBar = ({ onSearch }: { onSearch: (searchTerm: string) => void }) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    return (
        <div className="flex w-full flex-row items-center justify-between">
            <Input
                className="focus:border-primary-400 focus-visible:ring-primary-400"
                placeholder="Search something"
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

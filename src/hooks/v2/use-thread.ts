import type { ReplyRequest } from 'pages/api/v2/threads/[id]/reply-request';
import { ThreadStatusRequest, type FunnelStatusRequest, type GetThreadsRequest } from 'pages/api/v2/threads/request';
import type { GetThreadResponse, ThreadMessageCountResponse } from 'pages/api/v2/threads/response';
import { useCallback, useEffect, useState } from 'react';
import { type ThreadEntity } from 'src/backend/database/thread/thread-entity';
import { ThreadStatus } from 'src/backend/database/thread/thread-status';
import { type FilterRequest } from 'src/components/inbox/thread-list/filter/thread-list-filter';
import { useApiClient } from 'src/utils/api-client/request';
import awaitToError from 'src/utils/await-to-error';
import { create } from 'src/utils/zustand';

export interface ThreadStore {
    threads: ThreadEntity[];
    selectedThread?: ThreadEntity;
    appendThreads: (threads: ThreadEntity[]) => void;
    setThreads: (threads: ThreadEntity[]) => void;
    setSelectedThread: (thread: ThreadEntity) => void;
    setLoading: (loading: boolean) => void;
    loading: boolean;
    setThreadFunnelStatus: (threadId?: string, status?: FunnelStatusRequest) => void;
}
export const useThreadStore = create<ThreadStore>((set) => ({
    threads: [] as ThreadEntity[],
    appendThreads: (threads: ThreadEntity[]) => set((state) => ({ ...state, threads: [...state.threads, ...threads] })),
    setThreads: (threads: ThreadEntity[]) => set({ threads }),
    setSelectedThread: (selectedThread: ThreadEntity) => set({ selectedThread }),
    loading: false,
    setLoading: (loading: boolean) => set({ loading }),
    setThreadFunnelStatus: (threadId?: string, status?: FunnelStatusRequest) => {
        set((state) => {
            if (threadId === undefined || status === undefined) return state;
            const updatedThreads = state.threads.findIndex((thread) => thread.id === threadId);
            if (updatedThreads > -1) {
                const thread = state.threads[updatedThreads];
                if (thread.sequenceInfluencer) {
                    thread.sequenceInfluencer.funnelStatus = status;
                }
            }
            return { threads: state.threads };
        });
    },
}));

export const useThreadReply = () => {
    const { apiClient, error, loading } = useApiClient();
    const { threads, setThreads } = useThreadStore((state) => ({
        threads: state.threads,
        setThreads: state.setThreads,
    }));
    const reply = async (threadId: string, request: ReplyRequest) => {
        const [, response] = await awaitToError(apiClient.post(`/v2/threads/${threadId}/reply`, request));
        if (response) {
            const updatedThreads = threads.map((thread) => {
                if (thread.id === threadId) {
                    thread.threadStatus = ThreadStatus.REPLIED;
                }
                return thread;
            });
            setThreads(updatedThreads);
        }
    };
    return {
        reply,
        loading,
        error,
    };
};

export const useThread = () => {
    const {
        threads,
        loading: threadLoading,
        setLoading: setThreadLoading,
        selectedThread,
        setSelectedThread,
        setThreads,
        appendThreads,
    } = useThreadStore();
    const { apiClient, loading, error } = useApiClient();
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filter, setFilters] = useState<FilterRequest>({
        funnelStatus: [],
        threadStatus: ThreadStatusRequest.ALL,
        sequences: [],
    });
    const [page, setPage] = useState<number>(1);
    const [messageCount, setMessageCount] = useState<ThreadMessageCountResponse>({
        all: 0,
        unopened: 0,
        unreplied: 0,
    });
    const [isNextAvailable, setIsNextAvailable] = useState<boolean>(true);
    const [selectedThreadId, setSelectedThreadId] = useState<string>();
    const readThreadIds = useCallback(
        async (ids: string[]) => {
            const [err, response] = await awaitToError(apiClient.patch('/v2/threads/read', { ids }));
            if (!err || response) {
                // set selected thread as read
                const mustUpdateToReadIndex = threads.findIndex((thread) => ids.includes(thread.id));
                if (mustUpdateToReadIndex > -1) {
                    const updatedThreads = threads.map((thread) => {
                        if (ids.includes(thread.id)) {
                            thread.threadStatus = ThreadStatus.REPLIED;
                        }
                        return thread;
                    });
                    setThreads(updatedThreads);
                }
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [selectedThreadId],
    );
    useEffect(() => {
        (async () => {
            if (selectedThread?.threadId) {
                await awaitToError(readThreadIds([selectedThread?.id]));
            }
        })();
        setSelectedThreadId(selectedThread?.id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedThread]);
    useEffect(() => {
        if (selectedThreadId && selectedThreadId !== selectedThread?.id) {
            getAndSelectThread(selectedThreadId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedThreadId]);
    const getAllThread = async (request: GetThreadsRequest) => {
        if (loading) return;
        if (request.page === 1) setThreads([]);

        const params: Record<string, any> = {
            ...request,
        };
        if (request.funnelStatus && request.funnelStatus.length > 0) {
            params.funnelStatus = request.funnelStatus?.join(',');
        }
        if (request.sequences && request.sequences.length > 0) params.sequences = request.sequences?.join(',');

        const [, response] = await awaitToError(apiClient.get<GetThreadResponse>('/v2/threads', { params }));
        if (response) {
            if (params.page === response?.data.totalPages) setIsNextAvailable(false);
            else setIsNextAvailable(true);

            if (request.page === 1) setThreads(response?.data.items);
            else appendThreads(response?.data.items);
            setMessageCount(response?.data.messageCount);
            if (!selectedThread && response?.data.items.length) getAndSelectThread(response?.data.items[0].id);
        }
    };
    const getAndSelectThread = async (threadId: string) => {
        setThreadLoading(true);
        const [, response] = await awaitToError(apiClient.get<ThreadEntity>(`/v2/threads/${threadId}`));
        setThreadLoading(false);
        if (response) {
            setSelectedThread(response.data);
        }
    };
    return {
        selectedThread,
        setSelectedThread: getAndSelectThread,
        getAllThread,
        messageCount,
        loading: loading || threadLoading,
        error,
        threads,
        isNextAvailable,
        searchTerm,
        setSearchTerm,
        filter,
        setFilters,
        page,
        setPage,
    };
};

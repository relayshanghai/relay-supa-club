import type { ReplyRequest } from 'pages/api/v2/threads/[id]/reply-request';
import { type FunnelStatusRequest, type GetThreadsRequest } from 'pages/api/v2/threads/request';
import type { GetThreadResponse, ThreadMessageCountResponse } from 'pages/api/v2/threads/response';
import { useState } from 'react';
import { type ThreadEntity } from 'src/backend/database/thread/thread-entity';
import { ThreadStatus } from 'src/backend/database/thread/thread-status';
import { useApiClient } from 'src/utils/api-client/request';
import awaitToError from 'src/utils/await-to-error';

import { create } from 'zustand';

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
        setLoading: setThreadLoading,
        selectedThread,
        setSelectedThread,
        setThreads,
        appendThreads,
    } = useThreadStore();
    const { apiClient, loading, error } = useApiClient();
    const [messageCount, setMessageCount] = useState<ThreadMessageCountResponse>({
        all: 0,
        unopened: 0,
        unreplied: 0,
    });
    const [isNextAvailable, setIsNextAvailable] = useState<boolean>(true);
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

            if (request.page === 1) setThreads(response?.data.items);
            else appendThreads(response?.data.items);
            setMessageCount(response?.data.messageCount);
            if (!selectedThread) getAndSelectThread(response?.data.items[0].id);
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
        loading,
        error,
        threads,
        isNextAvailable,
    };
};

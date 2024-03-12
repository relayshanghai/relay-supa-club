import { type GetThreadsRequest } from "pages/api/v2/threads/request";
import type { GetThreadResponse, ThreadMessageCountResponse } from "pages/api/v2/threads/response";
import { useState } from "react";
import type { ThreadEntity } from "src/backend/database/thread/thread-entity";
import { useApiClient } from "src/utils/api-client/request"
import awaitToError from "src/utils/await-to-error";

import { create } from 'zustand'

export interface ThreadStore {
    threads: ThreadEntity[];
    selectedThread?: ThreadEntity;
    appendThreads: (threads: ThreadEntity[]) => void;
    setThreads: (threads: ThreadEntity[]) => void;
    setSelectedThread: (thread: ThreadEntity) => void;
    setLoading: (loading: boolean) => void;
    loading: boolean;
}
export const useThreadStore = create<ThreadStore>((set) => ({
    threads: [] as ThreadEntity[],
    appendThreads: (threads: ThreadEntity[]) => 
        set((state) => ({ ...state, threads: [...state.threads, ...threads] })),
    setThreads: (threads: ThreadEntity[]) => set({ threads }),
    setSelectedThread: (selectedThread: ThreadEntity) => set({ selectedThread }),
    loading: false,
    setLoading: (loading: boolean) => set({ loading })
}))

export const useThread = () => {
    const {
        threads,
        setLoading: setThreadLoading,
        selectedThread,
        setSelectedThread,
        setThreads,
        appendThreads,
    } = useThreadStore();
    const {
        apiClient,
        loading,
        error
    } = useApiClient();
    const [messageCount, setMessageCount] = useState<ThreadMessageCountResponse>({
        all: 0,
        unopened: 0,
        unreplied: 0
    });
    const [isNextAvailable, setIsNextAvailable] = useState<boolean>(true);
    const getAllThread = async (request: GetThreadsRequest) => {
        if(loading) return;
        if(request.page === 1) 
            setThreads([])
        
        const params: Record<string, any> = {
            ...request,
        }
        if(request.funnelStatus && request.funnelStatus.length > 0) {
            params.funnelStatus = request.funnelStatus?.join(',')
        }
        if(request.sequences && request.sequences.length > 0)
            params.sequences = request.sequences?.join(',')

        const [,response] = await awaitToError(apiClient.get<GetThreadResponse>('/v2/threads', { params }));
        if(response) {
            if(params.page === response?.data.totalPages) setIsNextAvailable(false)
            
            if(request.page === 1) 
                setThreads(response?.data.items)
            else 
                appendThreads(response?.data.items);
            setMessageCount(response?.data.messageCount);
            if(!selectedThread) getAndSelectThread(response?.data.items[0].id)
        }
    }
    const getAndSelectThread = async(threadId: string) => {
        setThreadLoading(true);
        const [,response] = await awaitToError(apiClient.get<ThreadEntity>(`/v2/threads/${threadId}`));
        setThreadLoading(false);
        if(response) {
            setSelectedThread(response.data);
        }
    
    }
    return {
        selectedThread,
        setSelectedThread: getAndSelectThread,
        getAllThread,
        messageCount,
        loading,
        error,
        threads,
        isNextAvailable
    }
}
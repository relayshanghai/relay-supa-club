import type { GetThreadsRequest } from "pages/api/v2/threads/request";
import type { GetThreadResponse, ThreadMessageCountResponse } from "pages/api/v2/threads/response";
import { useState } from "react";
import type { ThreadEntity } from "src/backend/database/thread/thread-entity";
import { useApiClient } from "src/utils/api-client/request"
import awaitToError from "src/utils/await-to-error";

import { create } from 'zustand'

interface SortedThread {
    date: string;
    threads: ThreadEntity[];
}

export interface ThreadStore {
    threads: SortedThread[];
    appendThreads: (threads: ThreadEntity[]) => void;
}
export const useThreadStore = create<ThreadStore>((set) => ({
    threads: [] as SortedThread[],
    appendThreads: (threads: ThreadEntity[]) => {
        const sortedThreads = threads.reduce((acc, thread) => {
            const date = new Date(thread.lastReplyDate as Date).toDateString();
            const index = acc.findIndex((sortedThread) => sortedThread.date === date);
            if(index === -1) {
                acc.push({
                    date,
                    threads: [thread]
                })
            } else {
                acc[index].threads.push(thread);
            }
            return acc;
        }, [] as SortedThread[])
        set({ threads: sortedThreads });
    },
    resetThread: () => set({ threads: [] as SortedThread[] })
}))

export const useThread = () => {
    const {
        threads,
        appendThreads
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
    const getAllThread = async (request: GetThreadsRequest) => {
        const [,response] = await awaitToError(apiClient.get<GetThreadResponse>('/v2/threads', { params: request }));
        if(response) {
            appendThreads(response?.data.items);
            setMessageCount(response?.data.messageCount);
        }
    }

    return {
        getAllThread,
        messageCount,
        loading,
        error,
        threads
    }
}
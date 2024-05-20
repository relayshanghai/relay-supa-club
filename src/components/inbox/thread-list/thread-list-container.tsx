import { useEffect, useMemo, useState } from 'react';
import type { ThreadEntity } from 'src/backend/database/thread/thread-entity';
import { formatDate } from 'src/utils/datetime';
import ThreadListItem, { ThreadListItemSkeleton } from './thread-list-item';
import { useThread } from 'src/hooks/v2/use-thread';

export default function ThreadListContainer({
    threads: _threads,
    loading,
}: {
    readonly threads: ThreadEntity[];
    readonly loading: boolean;
}) {
    const { selectedThread, setSelectedThread } = useThread();
    const [selectedThreadId, setSelectedThreadId] = useState<string | undefined>();
    const [threads, setThreads] = useState<ThreadEntity[]>([]);
    const today = formatDate(new Date().toISOString(), '[date] [monthShort] [fullYear]');

    useEffect(() => {
        console.log(_threads);
        setThreads(_threads);
    }, [_threads]);

    const threadsGroupedByUpdatedAt = useMemo(
        () =>
            threads?.reduce((acc, thread) => {
                const date = thread.lastReplyDate || thread.updatedAt;
                if (!date) {
                    return acc;
                }
                const key = formatDate(date.toString(), '[date] [monthShort]');
                if (!acc[key]) {
                    acc[key] = [];
                }
                acc[key].push(thread);
                return acc;
            }, {} as { [key: string]: ThreadEntity[] }),
        [threads],
    );
    useEffect(() => {
        setSelectedThreadId;
    }, [selectedThread]);
    return (
        <div className="flex w-full flex-col">
            {Object.keys(threadsGroupedByUpdatedAt)
                .sort((a, b) => {
                    const dateA = new Date(a);
                    const dateB = new Date(b);
                    return dateB.getTime() - dateA.getTime();
                })
                .map((date) => (
                    <div key={date}>
                        <div className="inline-flex h-5 items-center justify-start gap-2.5 border-b border-gray-50 px-4 py-1">
                            <div className="font-['Poppins'] text-[10px] font-medium leading-3 tracking-tight text-gray-400">
                                {date === today ? 'Today' : date}
                            </div>
                        </div>
                        {threadsGroupedByUpdatedAt[date].map((thread) => (
                            <div key={thread.id}>
                                <ThreadListItem
                                    thread={thread}
                                    selected={thread.id === selectedThreadId}
                                    onClick={() => {
                                        setSelectedThreadId(thread.id);
                                        setSelectedThread(thread.id);
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                ))}
            {loading && <ThreadListItemSkeleton />}
        </div>
    );
}

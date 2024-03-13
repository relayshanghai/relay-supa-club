'use client';
import { type UIEventHandler, useCallback, useEffect, useState } from 'react';
import ThreadListInputSearch from './thread-list-input-search';
import { type FilterRequest, ThreadListFilter } from './filter/thread-list-filter';
import { ThreadStatusRequest } from 'pages/api/v2/threads/request';
import { useThread } from 'src/hooks/v2/use-thread';
import ThreadListContainer from './thread-list-container';

export default function ThreadList() {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filter, setFilters] = useState<FilterRequest>({
        funnelStatus: [],
        threadStatus: ThreadStatusRequest.ALL,
        sequences: [],
    });
    const [page, setPage] = useState<number>(1);
    const { threads, getAllThread, loading, isNextAvailable, messageCount } = useThread();
    const triggerGetThread = useCallback(() => {
        if (loading) return;
        getAllThread({
            searchTerm,
            ...filter,
            page: page,
            size: 30,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm, filter, page]);
    useEffect(triggerGetThread, [searchTerm, filter, page, triggerGetThread]);

    const onThreadContainerScroll: UIEventHandler<HTMLDivElement> = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollTop + clientHeight > scrollHeight - 5 && !loading && isNextAvailable) {
            setPage(page + 1);
        }
    };
    const onThreadListContainerScroll = useCallback(onThreadContainerScroll, [loading, setPage, page, isNextAvailable]);

    return (
        <section
            className="w-[280px] shrink-0 flex-col items-center gap-2 overflow-y-auto"
            onScroll={onThreadListContainerScroll}
        >
            <section className="flex w-full flex-col gap-4 p-2">
                <ThreadListInputSearch
                    onSearch={(value) => {
                        setPage(1);
                        setSearchTerm(value);
                    }}
                />
                <ThreadListFilter
                    filters={filter}
                    messageCount={messageCount}
                    onChangeFilter={(value) => {
                        setPage(1);
                        setFilters(value);
                    }}
                />
            </section>
            <ThreadListContainer loading={loading} threads={threads} />
        </section>
    );
}

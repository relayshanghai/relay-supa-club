'use client';
import { type UIEventHandler, useCallback, useEffect } from 'react';
import ThreadListInputSearch from './thread-list-input-search';
import { ThreadListFilter } from './filter/thread-list-filter';
import { useThread } from 'src/hooks/v2/use-thread';
import ThreadListContainer from './thread-list-container';
import { debounce } from 'lodash';
import { useInboxFilter } from 'src/store/reducers/inbox-filter';
export default function ThreadList() {
    const {
        threads,
        getAllThread,
        loading,
        isNextAvailable,
        messageCount,
        filter,
        setFilters,
        searchTerm,
        setSearchTerm,
        page,
        setPage,
    } = useThread();
    const { setFilterLoading } = useInboxFilter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const triggerGetThread = useCallback(
        debounce((searchTerm, filter, page) => {
            if (loading) return;
            getAllThread({
                searchTerm,
                ...filter,
                page: page,
                size: 30,
            }).finally(() => setFilterLoading(false));
        }, 1),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    useEffect(() => {
        triggerGetThread(searchTerm, filter, page);
    }, [searchTerm, filter, page, triggerGetThread]);

    const onThreadContainerScroll: UIEventHandler<HTMLDivElement> = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollTop + clientHeight > scrollHeight - 5 && !loading && isNextAvailable) {
            setPage(page + 1);
        }
    };
    const onThreadListContainerScroll = useCallback(onThreadContainerScroll, [loading, setPage, page, isNextAvailable]);

    return (
        <section
            id="inbox-thread-list"
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
                        setFilterLoading(true);
                    }}
                />
            </section>
            <ThreadListContainer loading={loading} threads={threads} />
        </section>
    );
}

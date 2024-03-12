import { useState } from "react";
import ThreadListInputSearch from "./thread-list-input-search";
import { type FilterRequest, ThreadListFilter } from "./filter/thread-list-filter";
import { ThreadStatusRequest } from "pages/api/v2/threads/request";
import { useThread } from "src/hooks/v2/use-thread";

export default function ThreadList() {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filter, setFilters] = useState<FilterRequest>({
        funnelStatus: [],
        threadStatus: ThreadStatusRequest.ALL,
        sequences: []
    });
    const [page, setPage] = useState<number>(10);
    const size = 25;
    const { 
        threads,
        getAllThread,
        messageCount
    } = useThread();
    
    return (
        <section
            className="w-[280px] shrink-0 flex-col items-center gap-2 overflow-y-auto"
            // onScroll={onThreadListContainerScroll}
        >
            <section className="flex w-full flex-col gap-4 p-2">
                <ThreadListInputSearch
                    onSearch={setSearchTerm}
                />
                <ThreadListFilter
                    filters={filter}
                    messageCount={messageCount}
                    onChangeFilter={
                        setFilters
                    }
                />
            </section>
        </section>
    )
}
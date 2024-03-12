import type { FunnelStatusRequest, ThreadStatusRequest } from 'pages/api/v2/threads/request';
import { useTranslation } from 'react-i18next';
import { Popover, PopoverContent, PopoverTrigger } from 'shadcn/components/ui/popover';
import { ChevronDown, FilterFunnel } from 'src/components/icons';
import ThreadListFilterStatus from './thread-list-filter-status';
import ThreadListFilterFunnelStatus from './thread-list-filter-funnel-status';
import ThreadListFilterSequence from './thread-list-filter-sequence';

export interface FilterRequest {
    threadStatus: ThreadStatusRequest;
    funnelStatus: FunnelStatusRequest[];
    sequences: string[];
} 

export const ThreadListFilter = ({
    messageCount,
    filters,
    onChangeFilter,
}: {
    messageCount: {
        [key in ThreadStatusRequest]: number;
    };
    filters: FilterRequest;
    onChangeFilter: (filters: FilterRequest) => void;
}) => {
    const { t } = useTranslation();
    return (
        <Popover>
            <PopoverTrigger>
                <div className="flex h-9 w-full flex-row items-center justify-between rounded-md border border-gray-200 bg-white px-2 py-1 text-gray-400 shadow">
                    <div className="flex items-center gap-3 px-0.5 py-1 text-xs">
                        <FilterFunnel className="h-4 w-4 stroke-gray-400" />
                        {t('inbox.filters.title')}
                    </div>
                    <ChevronDown className="h-4 w-4 stroke-gray-400" />
                </div>
            </PopoverTrigger>
            <PopoverContent className="max-h-[300px] space-y-3 overflow-y-auto">
                <ThreadListFilterStatus
                    onChange={(threadStatus: ThreadStatusRequest) => onChangeFilter({ ...filters, threadStatus })}
                    messageCount={messageCount}
                    status={filters.threadStatus}
                />
                <ThreadListFilterFunnelStatus
                    status={filters.funnelStatus ?? []}
                    onChange={(funnelStatus: FunnelStatusRequest[]) => onChangeFilter({ ...filters, funnelStatus })}
                />
                <ThreadListFilterSequence
                    selectedSequenceIds={filters.sequences ?? []}
                    onChange={(selectedSequence: string[]) =>
                        onChangeFilter({ ...filters, sequences: selectedSequence })
                    }
                />
            </PopoverContent>
        </Popover>
    );
};


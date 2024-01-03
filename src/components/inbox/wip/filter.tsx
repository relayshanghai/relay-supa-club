import { useCallback } from 'react';
import { Button } from 'shadcn/components/ui/button';
import { Checkbox } from 'shadcn/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from 'shadcn/components/ui/popover';
import { ChevronDown, FilterFunnel } from 'src/components/icons';
import { COLLAB_OPTIONS } from 'src/components/influencer/constants';
import type { FunnelStatus } from 'src/utils/api/db';
import type { SequenceThreadsFilter, ThreadsFilter } from 'src/utils/endpoints/get-threads';
import type { THREAD_STATUS } from 'src/utils/outreach/constants';

const CounterStyles: {
    [key in THREAD_STATUS]: string;
} = {
    unopened: 'bg-pink-100 text-pink-500',
    unreplied: 'bg-blue-100 text-blue-500',
    replied: '',
};

export type FilterSequence = SequenceThreadsFilter;

export type FilterType = ThreadsFilter;

type filterStatusButtons = {
    label: string;
    status?: THREAD_STATUS;
    enabledCondition: (status: THREAD_STATUS[]) => boolean;
};

const filterStatusButtons: filterStatusButtons[] = [
    {
        label: 'Unread',
        status: 'unopened',
        enabledCondition: (status: THREAD_STATUS[]) => status.includes('unopened'),
    },
    {
        label: 'Unreplied',
        status: 'unreplied',
        enabledCondition: (status: THREAD_STATUS[]) => status.includes('unreplied'),
    },
    {
        label: 'All',
        status: undefined, // No specific status for 'All'
        enabledCondition: (status: THREAD_STATUS[]) => status.length === 0,
    },
];

export const Filter = ({
    messageCount,
    allSequences = [],
    filters,
    onChangeFilter,
}: {
    messageCount: {
        [key in THREAD_STATUS]: number;
    };
    allSequences: FilterSequence[];
    filters: FilterType;
    onChangeFilter: (newFilter: FilterType) => void;
}) => {
    return (
        <Popover>
            <PopoverTrigger>
                <div className="flex items-center justify-between rounded border border-gray-200 bg-white px-2 py-1 text-gray-400">
                    <div className="flex items-center gap-2">
                        <FilterFunnel className="w-4- h-4 stroke-gray-400" />
                        Filters
                    </div>
                    <ChevronDown className="h-4 w-4 stroke-gray-400" />
                </div>
            </PopoverTrigger>
            <PopoverContent className="space-y-3">
                <FilterByStatus
                    status={filters.threadStatus ?? []}
                    onChange={(threadStatus: THREAD_STATUS[]) => onChangeFilter({ ...filters, threadStatus })}
                    messageCount={messageCount}
                />
                <FilterByFunnelStatus
                    status={filters.funnelStatus ?? []}
                    onChange={(funnelStatus: FunnelStatus[]) => onChangeFilter({ ...filters, funnelStatus })}
                />
                <FilterBySequence
                    allSequences={allSequences}
                    selectedSequences={filters.sequences ?? []}
                    onChange={(selectedSequence: FilterSequence[]) =>
                        onChangeFilter({ ...filters, sequences: selectedSequence })
                    }
                />
            </PopoverContent>
        </Popover>
    );
};

const FilterByStatus = ({
    status,
    onChange,
    messageCount,
}: {
    status: THREAD_STATUS[];
    onChange: (status: THREAD_STATUS[]) => void;
    messageCount: {
        [key in THREAD_STATUS]: number;
    };
}) => {
    const handleUpdateStatus = useCallback(
        (buttonStatus?: THREAD_STATUS) => {
            if (!buttonStatus) {
                onChange([]);
                return;
            }
            if (status.length === 0) {
                onChange([buttonStatus]);
            } else {
                if (status.includes(buttonStatus)) {
                    onChange(status.filter((s) => s !== buttonStatus));
                } else {
                    onChange([...status, buttonStatus]);
                }
            }
        },
        [status, onChange],
    );

    return (
        <div className="flex flex-col">
            <p className="text-xs font-medium text-gray-400">Filter by status</p>
            {filterStatusButtons.map((button, index) => (
                <Button
                    key={index}
                    onClick={() => handleUpdateStatus(button.status)}
                    className={`w-full cursor-pointer justify-between ${
                        button.enabledCondition(status) && 'bg-gray-50'
                    }`}
                    variant="destructive"
                >
                    <span>{button.label}</span>
                    {button.status && (
                        <div className={`aspect-square h-5 w-5 rounded-full ${CounterStyles[button.status]}`}>
                            {messageCount[button.status]}
                        </div>
                    )}
                </Button>
            ))}
        </div>
    );
};

const FilterByFunnelStatus = ({
    status,
    onChange,
}: {
    status: FunnelStatus[];
    onChange: (status: FunnelStatus[]) => void;
}) => {
    const handleUpdateFunnelStatus = useCallback(
        (checkStatus: FunnelStatus) => {
            if (!checkStatus) {
                onChange([]);
                return;
            }
            if (status.length === 0) {
                onChange([checkStatus]);
            } else {
                if (status.includes(checkStatus)) {
                    onChange(status.filter((s) => s !== checkStatus));
                } else {
                    onChange([...status, checkStatus]);
                }
            }
        },
        [status, onChange],
    );

    return (
        <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-gray-400">Filter by status</p>
            {Object.keys(COLLAB_OPTIONS).map((option) => (
                <div key={option} className="flex items-center gap-2">
                    <Checkbox
                        value={option}
                        checked={status.includes(option as FunnelStatus)}
                        onCheckedChange={() => {
                            handleUpdateFunnelStatus(option as FunnelStatus);
                        }}
                    />
                    <span
                        className={`${COLLAB_OPTIONS[option].style} flex items-center gap-2 rounded px-2 py-1 text-sm`}
                    >
                        {COLLAB_OPTIONS[option].icon}
                        {option}
                    </span>
                </div>
            ))}
        </div>
    );
};

const FilterBySequence = ({
    allSequences,
    selectedSequences,
    onChange,
}: {
    allSequences: FilterSequence[];
    selectedSequences: FilterSequence[];
    onChange: (status: FilterSequence[]) => void;
}) => {
    const handleUpdateFunnelStatus = useCallback(
        (checkSequence: FilterSequence) => {
            if (!checkSequence) {
                onChange([]);
                return;
            }
            if (selectedSequences.length === 0) {
                onChange([checkSequence]);
            } else {
                if (selectedSequences.some((selectedSequence) => selectedSequence.id === checkSequence.id)) {
                    onChange(selectedSequences.filter((s) => s.id !== checkSequence.id));
                } else {
                    onChange([...selectedSequences, checkSequence]);
                }
            }
        },
        [selectedSequences, onChange],
    );

    return (
        <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-gray-400">Filter by sequence</p>
            {allSequences.map((sequence) => (
                <div key={sequence.id} className="flex items-center gap-2">
                    <Checkbox
                        checked={selectedSequences.some((selectedSequence) => selectedSequence.id === sequence.id)}
                        onCheckedChange={() => {
                            handleUpdateFunnelStatus(sequence);
                        }}
                    />
                    <span className="flex items-center gap-2 rounded px-2 py-1 text-sm">{sequence.name}</span>
                </div>
            ))}
        </div>
    );
};

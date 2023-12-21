import { useCallback, useState } from 'react';
import { Button } from 'shadcn/components/ui/button';
import { Checkbox } from 'shadcn/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from 'shadcn/components/ui/popover';
import { COLLAB_OPTIONS } from 'src/components/influencer/constants';
import type { FunnelStatus } from 'src/utils/api/db';

export type FilterStatusEnum = 'unread' | 'unreplied';

const CounterStyles: {
    [key in FilterStatusEnum]: string;
} = {
    unread: 'bg-pink-100 text-pink-500',
    unreplied: 'bg-blue-100 text-blue-500',
};

export type FilterSequence = {
    id: string;
    name: string;
};

export type FilterType = {
    status: FilterStatusEnum[];
    collabStatus: FunnelStatus[];
    sequence: FilterSequence[];
};

type filterStatusButtons = {
    label: string;
    status?: FilterStatusEnum;
    enabledCondition: (status: FilterStatusEnum[]) => boolean;
};

const filterStatusButtons: filterStatusButtons[] = [
    {
        label: 'Unread',
        status: 'unread',
        enabledCondition: (status: FilterStatusEnum[]) => status.includes('unread'),
    },
    {
        label: 'Unreplied',
        status: 'unreplied',
        enabledCondition: (status: FilterStatusEnum[]) => status.includes('unreplied'),
    },
    {
        label: 'All',
        status: undefined, // No specific status for 'All'
        enabledCondition: (status: FilterStatusEnum[]) => status.length === 0,
    },
];

const allSequences: FilterSequence[] = [
    {
        id: '1',
        name: 'Sequence 1',
    },
    {
        id: '2',
        name: 'Sequence 2',
    },
];

export const Filter = ({
    messageCount,
}: {
    messageCount: {
        [key in FilterStatusEnum]: number;
    };
}) => {
    const [filter, setFilter] = useState<FilterType>({
        status: ['unread'],
        collabStatus: ['Negotiating'],
        sequence: allSequences,
    });

    const submitFilters = useCallback(
        (open: boolean) => {
            if (!open) {
                // eslint-disable-next-line no-console
                console.log(filter);
            }
        },
        [filter],
    );

    return (
        <Popover onOpenChange={submitFilters}>
            <PopoverTrigger>Open</PopoverTrigger>
            <PopoverContent className="space-y-3">
                <FilterByStatus
                    status={filter.status}
                    onChange={(status: FilterStatusEnum[]) => setFilter({ ...filter, status })}
                    messageCount={messageCount}
                />
                <FilterByFunnelStatus
                    status={filter.collabStatus}
                    onChange={(collabStatus: FunnelStatus[]) => setFilter({ ...filter, collabStatus })}
                />
                <FilterBySequence
                    allSequences={allSequences}
                    selectedSequences={filter.sequence}
                    onChange={(selectedSequence: FilterSequence[]) =>
                        setFilter({ ...filter, sequence: selectedSequence })
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
    status: FilterStatusEnum[];
    onChange: (status: FilterStatusEnum[]) => void;
    messageCount: {
        [key in FilterStatusEnum]: number;
    };
}) => {
    const handleUpdateStatus = useCallback(
        (buttonStatus?: FilterStatusEnum) => {
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

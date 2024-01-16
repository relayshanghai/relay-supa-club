import Link from 'next/link';
import type { Message } from './thread-preview';
import type { Thread as ThreadInfo } from 'src/utils/outreach/types';
import { useState } from 'react';
import { Collapse, Expand } from 'src/components/icons';
import { formatDate } from 'src/utils/datetime';

export const ThreadHeader = ({
    threadInfo,
    messages,
    participants,
}: {
    threadInfo: ThreadInfo;
    messages: Message[];
    participants: string[];
}) => {
    const [expanded, setExpanded] = useState(false);

    const ToggleExpanded = expanded ? Collapse : Expand;

    return (
        <div
            className={`flex w-full justify-between bg-white px-4 py-8 shadow-lg ${
                expanded && 'flex-col'
            } relative gap-4`}
        >
            <ToggleExpanded
                className="absolute right-2 top-2 h-4 w-4 cursor-pointer stroke-gray-500"
                onClick={() => setExpanded(!expanded)}
            />
            <span className="font-['Poppins'] text-lg font-bold tracking-tight text-gray-700">
                {messages[messages.length - 1].subject}
            </span>
            <div className="flex flex-col justify-between sm:flex-row">
                <div className="flex flex-col gap-2">
                    <div className="inline-flex h-14 items-center justify-start gap-3">
                        <div className="inline-flex flex-col items-start justify-center gap-2">
                            <div className="font-['Poppins'] text-sm font-semibold leading-normal tracking-tight text-gray-700">
                                Product:
                            </div>
                            <div className="font-['Poppins'] text-sm font-semibold leading-normal tracking-tight text-gray-700">
                                Sequence:
                            </div>
                        </div>
                        <div className="inline-flex shrink grow basis-0 flex-col items-start justify-center gap-2">
                            {threadInfo.sequenceInfo && (
                                <>
                                    <div className="font-['Poppins'] text-sm font-medium leading-normal tracking-tight text-gray-700">
                                        {threadInfo.sequenceInfo.productName}
                                    </div>
                                    <div className="font-['Poppins'] text-sm font-medium leading-normal tracking-tight text-gray-700 underline">
                                        <Link
                                            className="text-primary-500"
                                            href={`/sequences/${threadInfo.sequenceInfo.id}`}
                                        >
                                            {threadInfo.sequenceInfo.name}
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                {expanded && (
                    <div className="flex flex-col gap-2">
                        <div className="inline-flex h-14 items-end justify-start gap-3">
                            <div className="inline-flex flex-col items-end justify-center gap-2">
                                <div className="font-['Poppins'] text-sm font-semibold leading-normal tracking-tight text-gray-700">
                                    Participants:
                                </div>
                                <div className="font-['Poppins'] text-sm font-semibold leading-normal tracking-tight text-gray-700">
                                    First reply:
                                </div>
                            </div>
                            <div className="inline-flex shrink grow basis-0 flex-col items-start justify-center gap-2">
                                <div className="font-['Poppins'] text-sm font-medium leading-normal tracking-tight text-gray-700">
                                    {participants.join(', ')}
                                </div>
                                <div className="font-['Poppins'] text-sm font-medium leading-normal tracking-tight text-gray-700">
                                    {formatDate(messages[0].date, '[date] [monthShort] [fullYear]')}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

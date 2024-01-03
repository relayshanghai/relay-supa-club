import Link from 'next/link';
import type { CurrentInbox, Message, ThreadInfo } from './thread-preview';
import { useState } from 'react';
import { Collapse, Expand } from 'src/components/icons';
import { formatDate } from 'src/utils/datetime';

export const ThreadHeader = ({
    threadInfo,
    messages,
    currentInbox,
}: {
    threadInfo: ThreadInfo;
    messages: Message[];
    currentInbox: CurrentInbox;
}) => {
    const allNames = [
        ...messages.map((message) => {
            return message.from.address === currentInbox.email ? 'Me' : message.from.name;
        }),
        ...messages.flatMap((message) =>
            message.cc.map((cc) => {
                return cc.address === currentInbox.email ? 'Me' : cc.name;
            }),
        ),
        ...messages.flatMap((message) =>
            message.to.map((to) => {
                return to.address === currentInbox.email ? 'Me' : to.name;
            }),
        ),
    ];

    const uniqueNames = allNames.filter((name, index, array) => array.indexOf(name) === index).join(', ');

    const [expanded, setExpanded] = useState(true);

    const ToggleExpanded = expanded ? Expand : Collapse;

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
            <span className="text-xl">Re: {messages[0].subject}</span>
            <div className="flex flex-col justify-between sm:flex-row">
                <div className="flex flex-col gap-2">
                    {threadInfo.sequenceInfo && (
                        <span>
                            Sequence:{' '}
                            <Link className="text-primary-500" href={`sequence/${threadInfo.sequenceInfo.id}`}>
                                {threadInfo.sequenceInfo.name}
                            </Link>
                        </span>
                    )}
                    {threadInfo.sequenceInfo && expanded && <p>{threadInfo.sequenceInfo.productName}</p>}
                </div>
                {expanded && (
                    <div className="flex flex-col gap-2">
                        <p>Participants: {uniqueNames}</p>
                        <p>First Reply: {formatDate(messages[0].date, '[date] [monthShort] [fullYear]')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

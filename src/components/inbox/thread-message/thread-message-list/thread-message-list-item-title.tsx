import { useEffect, useState } from 'react';
import type { Email } from 'src/backend/database/thread/email-entity';
import { formatDate } from 'src/utils/datetime';

export default function ThreadMessageListItemTitle({
    expanded,
    message,
    myEmail,
}: {
    expanded: boolean;
    message: Email;
    myEmail?: string;
}) {
    const [headerExpanded, setHeaderExpanded] = useState(false);
    useEffect(() => {
        if (!expanded) {
            setHeaderExpanded(false);
        }
    }, [expanded]);
    if (headerExpanded) {
        return (
            <dl
                onClick={(e) => {
                    e.stopPropagation();
                    expanded && setHeaderExpanded(!headerExpanded);
                }}
                className="flex gap-x-4 text-primary-400"
            >
                <div className="col-start-auto">
                    <dt className="text-right">From:</dt>
                    <dt className="text-right">To:</dt>
                    {message.cc?.length > 0 && <dt className="text-right">Cc:</dt>}
                    <dt className="text-right" />
                </div>
                <div className="col-auto text-start">
                    <dd>
                        <span className="font-semibold text-primary-700">{message.from.name}</span>{' '}
                        {`<${message.from.address}>`}
                    </dd>
                    {message.to.map((contact) => (
                        <dd key={`to-item-${contact.address}`}>
                            <span className="font-semibold text-primary-700">{contact.name}</span>{' '}
                            {`<${contact.address}>`}
                        </dd>
                    ))}
                    {message.cc?.map((contact) => (
                        <dd key={`cc-item-${contact.address}`}>
                            <span className="font-semibold text-primary-700">{contact.name}</span>{' '}
                            {`<${contact.address}>`}
                        </dd>
                    ))}
                    <dd>{formatDate(message.date.toString(), '[date] [monthShort] [fullYear]')}</dd>
                </div>
            </dl>
        );
    } else
        return (
            <p>
                <span className={`text-sm font-semibold ${expanded && 'text-primary-500'}`}>
                    {message.from.address === myEmail ? 'Me' : message.from.name}
                </span>
                <span
                    onClick={(e) => {
                        if (expanded) {
                            e.stopPropagation();
                            setHeaderExpanded(!headerExpanded);
                        }
                    }}
                    className={`text-sm ${expanded && 'text-primary-500'} px-4`}
                >
                    {expanded && (
                        <span>
                            Sent to {message.to.map((to) => (to.address === myEmail ? 'Me' : to.name || to.address))}
                        </span>
                    )}
                    {expanded && message.cc?.length > 0 && (
                        <span> and {message.cc.map((cc) => cc.name || cc.address).join(', ')}</span>
                    )}
                </span>
            </p>
        );
}

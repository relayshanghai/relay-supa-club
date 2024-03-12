import { useEffect, useState } from 'react';
import { Accordion } from 'shadcn/components/ui/accordion';
import type { Email } from 'src/backend/database/thread/email-entity';
import ThreadMessageListItem from './thread-message-list-item';

export default function ThreadMessageList({
    messages,
    myEmail,
    focusedMessageIds,
}: {
    messages: Email[];
    myEmail: string;
    focusedMessageIds?: string[];
}) {
    const [openMessage, setOpenMessage] = useState<string[]>([messages[0]?.id]);

    useEffect(() => {
        if (focusedMessageIds && focusedMessageIds.length > 0) {
            setOpenMessage([...focusedMessageIds]);
        } else if (messages.length > 0) {
            setOpenMessage([messages[0]?.id]);
        }
    }, [messages, focusedMessageIds]);

    return (
        <Accordion
            type="multiple"
            id={messages[0]?.id}
            className="space-y-4 bg-gray-50"
            value={openMessage}
            onValueChange={(value) => {
                setOpenMessage(value);
            }}
        >
            {messages
                .slice(0) // Make shallow copy before reversing
                .reverse()
                .map((message) => (
                    <>
                        <ThreadMessageListItem key={message.id} message={message} myEmail={myEmail} />
                    </>
                ))}
        </Accordion>
    );
}

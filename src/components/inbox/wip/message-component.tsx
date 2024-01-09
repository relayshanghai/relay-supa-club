import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from 'shadcn/components/ui/accordion';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from 'shadcn/components/ui/dropdown-menu';
import type { Message, CurrentInbox } from './thread-preview';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ThreeDots } from 'src/components/icons';
import { formatDate } from 'src/utils/datetime';
import { SelectValue } from '@radix-ui/react-select';

const MessageTitle = ({
    expanded,
    message,
    myEmail,
}: {
    expanded: boolean;
    message: Message;
    myEmail?: string | null;
}) => {
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
                    {message.cc.length > 0 && <dt className="text-right">Cc:</dt>}
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
                    {message.cc.map((contact) => (
                        <dd key={`cc-item-${contact.address}`}>
                            <span className="font-semibold text-primary-700">{contact.name}</span>{' '}
                            {`<${contact.address}>`}
                        </dd>
                    ))}
                    <dd>{formatDate(message.date, '[date] [monthShort] [fullYear]')}</dd>
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
                    {expanded && <span>Sent to {message.to.map((to) => to.name || to.address)}</span>}
                    {expanded && message.cc.length > 0 && (
                        <span> and {message.cc.map((cc) => cc.name || cc.address).join(', ')}</span>
                    )}
                </span>
            </p>
        );
};

const MessageComponent = ({ message, myEmail }: { message: Message; myEmail?: string | null }) => {
    const [messageExpanded, setMessageExpanded] = useState(false);
    const [quoteExpanded, setQuoteExpanded] = useState(false);
    const messageRef = useRef<HTMLDivElement>(null);
    const parser = new DOMParser();
    const emailDoc = parser.parseFromString(message.body, 'text/html');

    // Extract the quoted part
    const quotedPart = emailDoc.querySelector('.gmail_quote');

    if (quotedPart) {
        quotedPart.parentNode?.removeChild(quotedPart);
    }

    useEffect(() => {
        if (messageRef.current) setMessageExpanded(messageRef.current.dataset.state === 'open');
    }, [messageRef, messageRef.current?.dataset.state]);

    return (
        <AccordionItem
            ref={messageRef}
            className={`${messageExpanded ? 'stroke-primary-700 text-primary-700' : 'stroke-black'}`}
            onClick={() => setMessageExpanded(!messageExpanded)}
            value={message.id}
        >
            <AccordionTrigger
                className={`p-4 hover:no-underline ${messageExpanded && 'flex items-start bg-primary-50'}`}
                showChevron={false}
            >
                <MessageTitle expanded={messageExpanded} message={message} myEmail={myEmail} />
                <section className="flex items-center gap-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger onClick={(e) => e.stopPropagation()}>
                            <ThreeDots className="h-4 w-4 " />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
                            <DropdownMenuItem>Forward</DropdownMenuItem>
                            <DropdownMenuItem>Reply</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <span className="w-16">{formatDate(message.date, '[date] [monthShort]')}</span>
                </section>
            </AccordionTrigger>
            <AccordionContent onClick={(e) => e.stopPropagation()} className="p-4 text-black">
                <div dangerouslySetInnerHTML={{ __html: emailDoc.body.innerHTML }} />
                <section className="w-full">
                    <div className="h-fit w-fit rounded-sm bg-gray-200 px-1 transition-all hover:bg-gray-100">
                        <ThreeDots
                            onClick={() => setQuoteExpanded(!quoteExpanded)}
                            className="mt-4 h-4 w-4 rotate-90"
                        />
                    </div>
                    {quoteExpanded && quotedPart?.innerHTML && (
                        <>
                            <div className="my-4 h-0.5 w-full bg-gray-200" />
                            <div
                                className="font-semibold text-gray-400"
                                dangerouslySetInnerHTML={{ __html: quotedPart?.innerHTML }}
                            />
                        </>
                    )}
                </section>
            </AccordionContent>
        </AccordionItem>
    );
};

export const MessagesComponent = ({
    messages,
    currentInbox,
    focusedMessageIds,
}: {
    messages: Message[];
    currentInbox: CurrentInbox;
    focusedMessageIds?: string[];
}) => {
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
            className="w-full bg-white"
            value={openMessage}
            onValueChange={(value) => {
                setOpenMessage(value);
            }}
        >
            {messages
                .slice(0) // Make shallow copy before reversing
                .reverse()
                .map((message) => (
                    <MessageComponent key={message.id} message={message} myEmail={currentInbox.email} />
                ))}
        </Accordion>
    );
};
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from 'shadcn/components/ui/accordion';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from 'shadcn/components/ui/dropdown-menu';
import type { Message } from './thread-preview';
import { useEffect, useRef, useState } from 'react';
import { ThreeDots } from 'src/components/icons';

const MessageTitle = ({ expanded, message }: { expanded: boolean; message: Message }) => {
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
                    <dt className="text-right">Cc:</dt>
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
                    <dd>{message.date?.toDateString()}</dd>
                </div>
            </dl>
        );
    } else
        return (
            <p>
                <span className={`text-sm font-semibold ${expanded && 'text-primary-500'}`}>{message.from.name}</span>
                <span
                    onClick={(e) => {
                        if (expanded) {
                            e.stopPropagation();
                            setHeaderExpanded(!headerExpanded);
                        }
                    }}
                    className={`text-sm ${expanded && 'text-primary-500'} px-4`}
                >
                    Sent to {message.to.map((to) => to.name)} and {message.cc.map((cc) => cc.name)}
                </span>
            </p>
        );
};

type QuoteMessageComponentProps = {
    quoteMessages: Message[];
    index: number;
};

const QuotedMessage = ({ quoteMessages, index }: QuoteMessageComponentProps) => {
    const message = quoteMessages[index];
    if (message)
        return (
            <div className="text-sm">
                <p className="mt-4 text-gray-500">
                    {`On ${message.date.toDateString()} ${message.from.name} <`}
                    <span className="text-primary-400">{`${message.from.address}`}</span> {`> wrote:`}
                </p>
                <div className="ml-2 border-l-2 border-l-gray-500 pl-3">
                    {/* Render the quoted message */}
                    <p className="text-gray-400">{message.body}</p>
                    {/* Render nested quoted messages */}
                    {quoteMessages.length > 0 && index < quoteMessages.length - 1 && (
                        <QuotedMessage
                            key={quoteMessages[index + 1].id}
                            quoteMessages={quoteMessages.slice(0, quoteMessages.length)}
                            index={index + 1}
                        />
                    )}
                </div>
            </div>
        );
    else return <></>;
};

export const formatDate = (inputDate: Date) => {
    return new Intl.DateTimeFormat('en-US', {
        day: '2-digit',
        month: 'short',
    }).format(inputDate);
};

const MessageComponent = ({ message, quote }: { message: Message; quote: Message[] }) => {
    const [messageExpanded, setMessageExpanded] = useState(false);
    const [quoteExpanded, setQuoteExpanded] = useState(false);
    const messageRef = useRef<HTMLDivElement>(null);

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
                <MessageTitle expanded={messageExpanded} message={message} />
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
                    <span className="w-16">{formatDate(message.date)}</span>
                </section>
            </AccordionTrigger>
            <AccordionContent onClick={(e) => e.stopPropagation()} className="p-4 text-black">
                {message.body}
                <section className="w-full">
                    <div className="h-fit w-fit rounded-sm bg-gray-200 px-1 transition-all hover:bg-gray-100">
                        <ThreeDots
                            onClick={() => setQuoteExpanded(!quoteExpanded)}
                            className="mt-4 h-4 w-4 rotate-90"
                        />
                    </div>
                    {quoteExpanded && (
                        <>
                            <div className="my-4 h-0.5 w-full bg-gray-200" />
                            <QuotedMessage quoteMessages={quote} index={0} />
                        </>
                    )}
                </section>
            </AccordionContent>
        </AccordionItem>
    );
};

export const MessagesComponent = ({ messages }: { messages: Message[] }) => {
    return (
        <Accordion type="multiple" className="hover: w-full bg-white">
            {messages.map((message, index) => (
                <MessageComponent key={message.id} message={message} quote={[...messages.slice(0, index)].reverse()} />
            ))}
        </Accordion>
    );
};

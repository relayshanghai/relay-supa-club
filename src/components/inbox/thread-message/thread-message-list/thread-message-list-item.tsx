import { AccordionContent, AccordionItem, AccordionTrigger } from 'shadcn/components/ui/accordion';
import { useEffect, useRef, useState } from 'react';
import { ThreeDots } from 'src/components/icons';
import { formatDate } from 'src/utils/datetime';
import type { Email } from 'src/backend/database/thread/email-entity';
import ThreadMessageListItemTitle from './thread-message-list-item-title';
import ThreadMessageListItemAttachment from './thread-message-list-item-attachment';

export default function ThreadMessageListItem({ message, myEmail }: { message: Email; myEmail?: string }) {
    const [messageExpanded, setMessageExpanded] = useState(false);
    const [quoteExpanded, setQuoteExpanded] = useState(false);
    const messageRef = useRef<HTMLDivElement>(null);
    const parser = new DOMParser();
    const emailDoc = parser.parseFromString(message.text.html, 'text/html');

    // Extract the quoted part
    const gmailQuotedPart = emailDoc.querySelector('.gmail_quote');

    const blockQuotedPart = emailDoc.querySelector('blockquote');

    if (blockQuotedPart) {
        blockQuotedPart.parentNode?.removeChild(blockQuotedPart);
    }

    if (gmailQuotedPart) {
        gmailQuotedPart.parentNode?.removeChild(gmailQuotedPart);
    }

    useEffect(() => {
        if (messageRef.current) setMessageExpanded(messageRef.current.dataset.state === 'open');
    }, [messageRef, messageRef.current?.dataset.state]);

    return (
        <AccordionItem
            ref={messageRef}
            className={`${
                messageExpanded ? 'stroke-primary-700 text-primary-700' : 'stroke-black'
            } rounded bg-white shadow`}
            onClick={() => setMessageExpanded(!messageExpanded)}
            value={message.id}
        >
            <AccordionTrigger
                className={`p-4 hover:no-underline ${messageExpanded && 'flex items-start bg-primary-50'}`}
                showChevron={false}
            >
                <ThreadMessageListItemTitle expanded={messageExpanded} message={message} myEmail={myEmail} />
                <section className="flex items-center gap-4">
                    <span className="w-16">{formatDate(message.date.toString(), '[date] [monthShort]')}</span>
                </section>
            </AccordionTrigger>
            <AccordionContent onClick={(e) => e.stopPropagation()} className="p-4 text-black">
                <div className="[&_a]:text-primary-500" dangerouslySetInnerHTML={{ __html: emailDoc.body.innerHTML }} />
                {message.attachments && message.attachments.length > 0 && (
                    <section className="flex w-full gap-2">
                        {message.attachments
                            .filter((attachment) => {
                                // @note there are some attachments that does not have complete data (e.g. no filename)
                                return attachment.contentType.startsWith('message/') === false;
                            })
                            .map((attachment) => (
                                <ThreadMessageListItemAttachment key={attachment.id} attachment={attachment} />
                            ))}
                    </section>
                )}
                <section className="w-full">
                    <div className="h-fit w-fit rounded-sm bg-gray-200 px-1 transition-all hover:bg-gray-100">
                        <ThreeDots
                            onClick={() => setQuoteExpanded(!quoteExpanded)}
                            className="mt-4 h-4 w-4 rotate-90"
                        />
                    </div>
                    {quoteExpanded && blockQuotedPart?.innerHTML && (
                        <>
                            <div className="my-4 h-0.5 w-full bg-gray-200" />
                            <div
                                className="font-semibold text-gray-400"
                                dangerouslySetInnerHTML={{ __html: blockQuotedPart?.innerHTML }}
                            />
                        </>
                    )}
                    {quoteExpanded && gmailQuotedPart?.innerHTML && (
                        <>
                            <div className="my-4 h-0.5 w-full bg-gray-200" />
                            <div
                                className="font-semibold text-gray-400"
                                dangerouslySetInnerHTML={{ __html: gmailQuotedPart?.innerHTML }}
                            />
                        </>
                    )}
                </section>
            </AccordionContent>
        </AccordionItem>
    );
}

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from 'shadcn/components/ui/accordion';
import type { Message, CurrentInbox } from './thread-preview';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Download, Forward, ThreeDots } from 'src/components/icons';
import { formatDate } from 'src/utils/datetime';
import { getAttachmentStyle } from 'pages/component-previews/inbox';
import { Tooltip } from 'src/components/library';
import type { EmailContact } from 'src/utils/outreach/types';
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from 'shadcn/components/ui/dialog';
import { SingleAddressSection } from './reply-editor';
import { Button } from 'shadcn/components/ui/button';
import { truncatedText } from 'src/utils/outreach/helpers';
import type { Attachment } from 'types/email-engine/account-account-message-get';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { clientLogger } from 'src/utils/logger-client';

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
                    {expanded && (
                        <span>
                            Sent to {message.to.map((to) => (to.address === myEmail ? 'Me' : to.name || to.address))}
                        </span>
                    )}
                    {expanded && message.cc.length > 0 && (
                        <span> and {message.cc.map((cc) => cc.name || cc.address).join(', ')}</span>
                    )}
                </span>
            </p>
        );
};

const AttachmentTablet = ({ attachment }: { attachment: Attachment }) => {
    const { t } = useTranslation();

    const handleDownloadAttachment = useCallback(async () => {
        if (!attachment.id) return;
        const baseUrl = '/api/outreach/attachments';
        const downloadParams = new URLSearchParams({
            id: attachment.id,
            filename: attachment.filename,
        });

        const downloadFile = fetch(`${baseUrl}?${new URLSearchParams(downloadParams)}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.blob();
            })
            .then((blob) => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = '';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                return true;
            })
            .catch((error: any) => {
                clientLogger('Attachment download failed', error.message);
                return false;
            });

        toast.promise(downloadFile, {
            loading: t('inbox.attachments.loading'),
            success: t('inbox.attachments.success'),
            error: t('inbox.attachments.error'),
        });
    }, [attachment, t]);

    return (
        <Tooltip position="right" content={attachment.filename}>
            <button
                type="button"
                className={`flex cursor-pointer gap-2 rounded font-semibold ${getAttachmentStyle(
                    attachment.filename,
                )} px-2 py-1 text-xs`}
                onClick={handleDownloadAttachment}
            >
                <Download className="h-4 w-4" />
                {truncatedText(attachment.filename, 10)}
            </button>
        </Tooltip>
    );
};

const MessageComponent = ({
    message,
    myEmail,
    onForward,
}: {
    message: Message;
    myEmail?: string | null;
    onForward: (message: Message, forwardedTo: EmailContact[]) => void;
}) => {
    const [messageExpanded, setMessageExpanded] = useState(false);
    const [forwardTo, setForwardTo] = useState<EmailContact[]>([]);
    const [quoteExpanded, setQuoteExpanded] = useState(false);
    const messageRef = useRef<HTMLDivElement>(null);
    const parser = new DOMParser();
    const emailDoc = parser.parseFromString(message.body, 'text/html');

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
                <MessageTitle expanded={messageExpanded} message={message} myEmail={myEmail} />
                <section className="flex items-center gap-4">
                    <Dialog>
                        <DialogTrigger>
                            <Forward className="h-4 w-4" />
                        </DialogTrigger>

                        <DialogContent>
                            <SingleAddressSection sendTo={forwardTo} setSendTo={setForwardTo} />
                            <DialogFooter>
                                <Button type="button" onClick={() => onForward(message, forwardTo)}>
                                    Save changes
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <span className="w-16">{formatDate(message.date, '[date] [monthShort]')}</span>
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
                                <AttachmentTablet key={attachment.id} attachment={attachment} />
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
};

export const MessagesComponent = ({
    messages,
    currentInbox,
    focusedMessageIds,
    onForward,
}: {
    messages: Message[];
    currentInbox: CurrentInbox;
    focusedMessageIds?: string[];
    onForward: (message: Message, forwardedTo: EmailContact[]) => void;
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
                        <MessageComponent
                            key={message.id}
                            message={message}
                            myEmail={currentInbox.email}
                            onForward={onForward}
                        />
                    </>
                ))}
        </Accordion>
    );
};

import { useThread, useThreadReply } from 'src/hooks/v2/use-thread';
import ThreadHeader from './thread-header';
import { paramDefaultValues, useMessages } from 'src/hooks/v2/use-message';
import ThreadMessageList from './thread-message-list/thread-message-list';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ThreadReply from './thread-message-reply/thread-reply';
import type { Email, EmailAttachment, EmailContact } from 'src/backend/database/thread/email-entity';
import { serverLogger } from 'src/utils/logger-server';
import { nanoid } from 'nanoid';
import { useUser } from 'src/hooks/use-user';
import { useCompany } from 'src/hooks/use-company';
import { type Paginated } from 'types/pagination';
import { type GetThreadEmailsRequest } from 'pages/api/v2/threads/[id]/emails/request';

/**
 * Generate local Message object with isLocal attribute
 */
const generateLocalData = (params: {
    body: string;
    from: EmailContact;
    to: EmailContact[];
    cc: EmailContact[];
    subject: string;
    attachments: EmailAttachment[];
}): Email => {
    const localId = nanoid(10);
    return {
        date: new Date(),
        unseen: false,
        id: localId,
        from: params.from,
        to: params.to,
        cc: params.cc,
        attachments: params.attachments,
        replyTo: params.to,
        subject: params.subject,
        text: {
            html: params.body,
        },
    } as Email;
};

export default function ThreadMessages() {
    const { profile } = useUser();
    const { company } = useCompany();
    const myEmail = profile?.email || '';
    const { selectedThread, loading } = useThread();
    const { messages, mutate, setParams, params } = useMessages();
    const endOfThread = useRef<null | HTMLDivElement>(null);
    const messageListDiv = useRef<null | HTMLDivElement>(null);

    useEffect(() => {
        setParams({
            ...paramDefaultValues,
            threadId: selectedThread?.threadId || '',
        } as GetThreadEmailsRequest);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedThread?.threadId, loading]);
    useEffect(() => {
        if (params.page === 1) {
            if ((params.page as number) < 2) {
                setParams({
                    page: 2,
                } as GetThreadEmailsRequest);
            }
        } else {
            if (params.page > 2) {
                messageListDiv.current?.scrollTo(0, 50);
            } else {
                endOfThread.current?.scrollIntoView({ behavior: 'smooth' });
            }
        }
        messageListDiv.current?.addEventListener('scroll', () => {
            // detect if user has scrolled to the bottom of the message list
            const topScroll = Math.ceil(messageListDiv.current?.scrollTop as number);
            if (topScroll == 0) {
                setParams({
                    page: params.page + 1,
                } as GetThreadEmailsRequest);
            }
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messages, loading]);
    const threadContact = useMemo(() => {
        if (selectedThread) {
            const cc =
                selectedThread.contacts
                    ?.filter((c) => ['cc', 'bcc'].includes(c.type as string))
                    .map((c) => ({
                        name: c.emailContact?.name || '',
                        address: c.emailContact?.address || '',
                    })) || [];
            const to =
                selectedThread.contacts
                    ?.filter((c) => !['cc', 'bcc', 'user'].includes(c.type as string))
                    .map((c) => ({
                        name: c.emailContact?.name || '',
                        address: c.emailContact?.address || '',
                    })) || [];
            return {
                cc,
                to,
            };
        }
        return {
            cc: [],
            to: [],
        };
    }, [selectedThread]);
    const [attachments, setAttachments] = useState<string[]>([]);

    const handleAttachmentSelect = (files: string[]) => {
        if (!files) return serverLogger('No files attached');
        setAttachments((attached) => {
            return [...attached, ...files];
        });
    };

    const handleRemoveAttachment = useCallback(
        (file: string) => {
            setAttachments((attached) => attached && [...attached.filter((f) => f !== file)]);
        },
        [setAttachments],
    );
    const { reply, loading: replyLoading } = useThreadReply();
    const handleReply = useCallback(
        async (replyBody: string, toList: EmailContact[], ccList: EmailContact[]) => {
            mutate(
                async (cache: Paginated<Email> | undefined): Promise<Paginated<Email>> => {
                    if (attachments && attachments.length > 0) {
                        const htmlAttachments = attachments.map((attachment) => {
                            return `<a target="__blank" href="${window.origin}/api/files/download-presign-url?path=${company?.id}/attachments/${attachment}">${attachment}</a>`;
                        });
                        // attach link of attachments to the html body content of the email
                        replyBody = `${replyBody}
                            <br/><br/>
                            <b>Attachments:</b><br/>
                            ${htmlAttachments.join('<br/>')}`;
                    }
                    await reply(selectedThread?.id as string, {
                        content: replyBody,
                        cc: ccList,
                        to: toList,
                    });
                    // Retain local data with generated data
                    const localMessage = generateLocalData({
                        body: replyBody,
                        from: { name: 'Me', address: myEmail || '' },
                        to: toList,
                        cc: ccList,
                        subject: messages[messages.length - 1]?.subject ?? '',
                        attachments: [],
                    });
                    setAttachments([]);
                    return { ...cache, items: [localMessage, ...(cache?.items ?? [])] } as Paginated<Email>;
                },
                {
                    // Optimistically update the UI
                    // Seems like this is discarded when MutatorCallback ^ resolves
                    optimisticData: (cache: Paginated<Email> | undefined): Paginated<Email> => {
                        const localMessage = generateLocalData({
                            body: replyBody,
                            from: { name: 'Me', address: myEmail || '' },
                            to: toList,
                            cc: ccList,
                            subject: messages[messages.length - 1]?.subject ?? '',
                            attachments: [],
                        });
                        return { ...cache, items: [localMessage, ...(cache?.items ?? [])] } as Paginated<Email>;
                    },
                    revalidate: false,
                    rollbackOnError: true,
                },
            );
        },
        [selectedThread, mutate, reply, myEmail, messages, attachments, company],
    );
    return (
        <section className={`h-full flex-auto flex-col`}>
            {loading ? (
                <>
                    <div className="h-16 w-full animate-pulse bg-gray-100" />
                    <br />
                    <div className="h-16 w-full animate-pulse bg-gray-100" />
                    <br />
                    <div className="h-16 w-full animate-pulse bg-gray-100" />
                    <br />
                    <div className="h-16 w-full animate-pulse bg-gray-100" />
                    <br />
                    <div className="h-16 w-full animate-pulse bg-gray-100" />
                    <br />
                    <div className="h-16 w-full animate-pulse bg-gray-100" />
                </>
            ) : selectedThread ? (
                <div className="flex h-full flex-col bg-zinc-50">
                    <div className="flex-none bg-zinc-50">
                        <ThreadHeader
                            thread={selectedThread}
                            subject={messages && messages.length > 0 ? messages[0].subject : ''}
                        />
                    </div>

                    <div
                        style={{ height: 10 }}
                        className="m-5 flex-auto justify-center overflow-auto bg-zinc-50"
                        ref={messageListDiv}
                    >
                        <ThreadMessageList messages={messages || []} myEmail={myEmail} />
                        <div ref={endOfThread} />
                    </div>
                    <div className="m-5 bg-white">
                        <ThreadReply
                            loading={replyLoading}
                            defaultContacts={threadContact}
                            onReply={handleReply}
                            attachments={attachments}
                            handleRemoveAttachment={handleRemoveAttachment}
                            handleAttachmentSelect={handleAttachmentSelect}
                        />
                    </div>
                </div>
            ) : (
                <></>
            )}
        </section>
    );
}

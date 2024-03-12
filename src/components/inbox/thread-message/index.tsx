import { useThreadStore } from "src/hooks/v2/use-thread"
import ThreadHeader from "./thread-header"
import { useMessages } from "src/hooks/v2/use-message"
import ThreadMessageList from "./thread-message-list/thread-message-list"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import ThreadReply from "./thread-message-reply/thread-reply"
import type { EmailContact } from "src/backend/database/thread/email-entity"
import { serverLogger } from "src/utils/logger-server"

export default function ThreadMessages() {

    const { selectedThread, loading } = useThreadStore(state => ({
        selectedThread: state.selectedThread,
        loading: state.loading
    }))
    const { 
        messages,
    } = useMessages(selectedThread?.threadId as string)
    const endOfThread = useRef<null | HTMLDivElement>(null);
    const scrollToBottom = () => {
        endOfThread.current?.scrollIntoView({ behavior: 'smooth' });
    };
    useEffect(scrollToBottom, [messages])
    const threadContact = useMemo(() => {
        if (selectedThread) {
            const cc = selectedThread.contacts?.filter(c => ['cc', 'bcc'].includes(c.type as string)).map(c => ({
                name: c.emailContact?.name || '',
                address: c.emailContact?.address || '',
            })) || [];
            const to = selectedThread.contacts?.filter(c => !['cc', 'bcc', 'user'].includes(c.type as string)).map(c => ({
                name: c.emailContact?.name || '',
                address: c.emailContact?.address || '',
            })) || [];
            return {
                cc,
                to
            };
        }
        return {
            cc: [],
            to: []
        }
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

    const handleReply = (text: string, to: EmailContact[], cc: EmailContact[]) => {
        console.log('reply', text, to, cc);
    };
    return <section className={`h-full flex-auto flex-col`}>
            {
                loading ? <>
                <div className="h-16 w-full animate-pulse bg-gray-100"/>
                <br/>
                <div className="h-16 w-full animate-pulse bg-gray-100"/>
                <br/>
                <div className="h-16 w-full animate-pulse bg-gray-100"/>
                <br/>
                <div className="h-16 w-full animate-pulse bg-gray-100"/>
                <br/>
                <div className="h-16 w-full animate-pulse bg-gray-100"/>
                <br/>
                <div className="h-16 w-full animate-pulse bg-gray-100"/>
                </> :
            selectedThread ? (
                <div className="flex h-full flex-col bg-zinc-50">
                    <div className="flex-none bg-zinc-50">
                        <ThreadHeader
                            thread={selectedThread}
                            subject={
                                messages && messages.length > 0 ? messages[0].subject : ''
                            }
                            
                        />
                    </div>

                    <div style={{ height: 10 }} className="m-5 flex-auto justify-center overflow-auto bg-zinc-50">
                        <ThreadMessageList
                            messages={messages || []}
                            myEmail="test"
                        />
                        <div ref={endOfThread} />
                    </div>
                    <div className="m-5 bg-white">
                        {/* <div className={`${replyClicked ? 'block' : 'hidden'}`}> */}
                            <ThreadReply
                                defaultContacts={threadContact}
                                onReply={handleReply}
                                attachments={attachments}
                                handleRemoveAttachment={handleRemoveAttachment}
                                handleAttachmentSelect={handleAttachmentSelect}
                            />
                        {/* </div>
                        <div
                            onClick={() => setReplyClicked(true)}
                            className={`w-full cursor-text rounded-lg border-2 border-gray-100 px-4 py-2 text-gray-300 ${
                                !replyClicked ? 'block' : 'hidden'
                            }`}
                        >
                            {t('inbox.replyToThread')}
                        </div> */}
                    </div>
                </div>
            )
             : <></>

        }
    </section>
}
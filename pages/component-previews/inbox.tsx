import { useEffect, useState } from 'react';
import { MessagesComponent } from 'src/components/inbox/wip/message-component';
import { ReplyEditor } from 'src/components/inbox/wip/reply-editor';
import { ThreadHeader } from 'src/components/inbox/wip/thread-header';
import { type ThreadInfo, ThreadPreview } from 'src/components/inbox/wip/thread-preview';
import { useUser } from 'src/hooks/use-user';
import { nextFetch } from 'src/utils/fetcher';

const InboxPreview = () => {
    const [threads, setThreads] = useState<ThreadInfo[]>([]);
    const [selectedThread, setSelectedThread] = useState<ThreadInfo | null>(null);

    const { profile } = useUser();
    const currentInbox = {
        email: profile?.sequence_send_email,
    };

    useEffect(() => {
        const getThreads = async () => {
            const response = await nextFetch('outreach/threads');
            if (response && response.length > 0) {
                const res: ThreadInfo[] = await Promise.all(
                    response.map(async (thread: any) => {
                        const threadMessages = await nextFetch(`outreach/threads/${thread.threadInfo.threadId}`);
                        return {
                            ...thread,
                            messages: threadMessages,
                        };
                    }),
                );
                setThreads(res);
                setSelectedThread(res[0]);
            }
        };
        getThreads();
    }, []);

    if (!selectedThread || !currentInbox.email) return <></>;
    return (
        <div className="space-y-4 p-4">
            <section className="flex flex-col gap-4 border-4 p-4">
                Thread Previews
                <div>
                    {threads.map((thread) => (
                        <ThreadPreview
                            key={thread.threadInfo.id}
                            sequenceInfluencer={thread.sequenceInfluencers}
                            threadInfo={thread}
                            _currentInbox={currentInbox}
                            selected={selectedThread.threadInfo.id === thread.threadInfo.id}
                            onClick={() => setSelectedThread(thread)}
                        />
                    ))}
                </div>
            </section>
            <section className="flex flex-col gap-4 border-4 p-4">
                Correspondence Section
                <MessagesComponent messages={selectedThread.messages} />
            </section>
            <section className="flex flex-col gap-4 border-4 p-4">
                Thread Header
                <ThreadHeader currentInbox={currentInbox} threadInfo={selectedThread} />
            </section>
            <section className="flex flex-col gap-4 border-4 p-4">
                WYSIWYG Editor
                <ReplyEditor />
            </section>
        </div>
    );
};

export default InboxPreview;

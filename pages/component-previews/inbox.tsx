import { useState } from 'react';
import { MessagesComponent } from 'src/components/inbox/wip/message-component';
import { ReplyEditor } from 'src/components/inbox/wip/reply-editor';
import { ThreadHeader } from 'src/components/inbox/wip/thread-header';
import { ThreadPreview } from 'src/components/inbox/wip/thread-preview';
import type { FunnelStatus } from 'src/utils/api/db';
import type { CreatorPlatform } from 'types';

const sequenceInfluencer: {
    name: string;
    avatar_url: string;
    username: string;
    email: string;
    platform: CreatorPlatform;
    funnel_status: FunnelStatus;
} = {
    name: 'Pewds',
    avatar_url:
        'https://yt3.googleusercontent.com/Wx1limtM3-E41HLV0y6adT8Hj2dawlFLgsW4E_thJ50-JyDlMCFlxpT2j01xG_qxRQg4DiYmSQ=s480-c-k-c0x00ffffff-no-rj',
    username: 'pewdiepie',
    email: 'influencer@email.com',
    platform: 'youtube',
    funnel_status: 'Confirmed',
};

const threadInfo = [
    {
        id: 'id1',
        title: 'title',
        sequenceInfo: {
            sequenceId: 'seq-id1',
            sequenceName: 'Sequence Name 1',
            product: 'Product Name 1',
        },
        unread: true,
        messages: [
            {
                id: 'id1',
                from: { email: 'current_inbox@email.com', name: 'Current' },
                to: [{ email: 'influencer@email.com', name: 'Influencer Name' }],
                cc: [{ email: 'cc@email.com', name: 'CC Person' }],
                body: 'sample body 1',
                date: new Date('December 17, 1995 03:24:00'),
            },
            {
                id: 'id2',
                from: { email: 'influencer@email.com', name: 'Influencer Name' },
                to: [{ email: 'current_inbox@email.com', name: 'Current' }],
                cc: [{ email: 'cc@email.com', name: 'CC Person' }],
                body: 'sample body 2',
                date: new Date('December 18, 1995 03:24:00'),
            },
        ],
    },
    {
        id: 'id2',
        title: 'title',
        sequenceInfo: {
            sequenceId: 'seq-id2',
            sequenceName: 'Sequence Name 2',
            product: 'Product Name 2',
        },
        unread: false,
        messages: [
            {
                id: 'id1',
                from: { email: 'current_inbox@email.com', name: 'Current' },
                to: [{ email: 'influencer@email.com', name: 'Influencer Name' }],
                cc: [{ email: 'cc@email.com', name: 'CC Person' }],
                body: 'sample body 1',
                date: new Date('December 17, 1995 03:24:00'),
            },
            {
                id: 'id2',
                from: { email: 'influencer@email.com', name: 'Influencer Name' },
                to: [{ email: 'current_inbox@email.com', name: 'Current' }],
                cc: [{ email: 'cc@email.com', name: 'CC Person' }],
                body: 'sample body 2',
                date: new Date('December 18, 1995 03:24:00'),
            },
            {
                id: 'id2',
                from: { email: 'current_inbox@email.com', name: 'Current' },
                to: [{ email: 'influencer@email.com', name: 'Influencer Name' }],
                cc: [{ email: 'cc@email.com', name: 'CC Person' }],
                body: 'sample body 3',
                date: new Date('December 19, 1995 03:24:00'),
            },
        ],
    },
    {
        id: 'id3',
        title: 'title',
        sequenceInfo: {
            sequenceId: 'seq-id1',
            sequenceName: 'Sequence Name 1',
            product: 'Product Name 1',
        },
        unread: false,
        messages: [
            {
                id: 'id1',
                from: { email: 'current_inbox@email.com', name: 'Current' },
                to: [{ email: 'influencer@email.com', name: 'Influencer Name' }],
                cc: [{ email: 'cc@email.com', name: 'CC Person' }],
                body: 'sample body 1',
                date: new Date('December 17, 1995 03:24:00'),
            },
            {
                id: 'id2',
                from: { email: 'influencer@email.com', name: 'Influencer Name' },
                to: [{ email: 'current_inbox@email.com', name: 'Current' }],
                cc: [{ email: 'cc@email.com', name: 'CC Person' }],

                body: 'sample body 2',
                date: new Date('December 18, 1995 03:24:00'),
            },
            {
                id: 'id3',
                from: { email: 'current_inbox@email.com', name: 'Current' },
                to: [{ email: 'influencer@email.com', name: 'Influencer Name' }],
                cc: [{ email: 'cc@email.com', name: 'CC Person' }],
                body: 'sample body 3',
                date: new Date('December 19, 1995 03:24:00'),
            },
            {
                id: 'id4',
                from: { email: 'influencer@email.com', name: 'Influencer Name' },
                to: [{ email: 'current_inbox@email.com', name: 'Current' }],
                cc: [{ email: 'cc@email.com', name: 'CC Person' }],

                body: 'sample body 4',
                date: new Date('December 20, 1995 03:24:00'),
            },
        ],
    },
];

const currentInbox = {
    email: 'current_inbox@email.com',
};

const InboxPreview = () => {
    const [selectedThread, setSelectedThread] = useState(threadInfo[0]);
    return (
        <div className="space-y-4 p-4">
            <section className="flex flex-col gap-4 border-4 p-4">
                Thread Previews
                <div>
                    {threadInfo.map((thread) => (
                        <ThreadPreview
                            key={thread.id}
                            sequenceInfluencer={sequenceInfluencer}
                            threadInfo={thread}
                            currentInbox={currentInbox}
                            selected={selectedThread.id === thread.id}
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

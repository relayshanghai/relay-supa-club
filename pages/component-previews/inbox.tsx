import { ThreadPreview } from 'src/components/inbox/wip/thread-preview';
import type { CreatorPlatform } from 'types';

const sequenceInfluencer: {
    name: string;
    avatar_url: string;
    username: string;
    email: string;
    platform: CreatorPlatform;
} = {
    name: 'Pewds',
    avatar_url:
        'https://yt3.googleusercontent.com/Wx1limtM3-E41HLV0y6adT8Hj2dawlFLgsW4E_thJ50-JyDlMCFlxpT2j01xG_qxRQg4DiYmSQ=s480-c-k-c0x00ffffff-no-rj',
    username: 'pewdiepie',
    email: 'influencer@email.com',
    platform: 'youtube',
};

const threadInfo = {
    id: 'id',
    title: 'title',
    unread: false,
    messages: [
        {
            id: 'id',
            from: 'current_inbox@email.com',
            to: ['influencer@email.com'],
            cc: ['cc@email.com'],
        },
        {
            id: 'id',
            from: 'influencer@email.com',
            to: ['current_inbox@email.com'],
            cc: ['cc@email.com'],
        },
    ],
};

const currentInbox = {
    email: 'current_inbox@email.com',
};

const InboxPreview = () => {
    return (
        <div className="p-4">
            <ThreadPreview
                sequenceInfluencer={sequenceInfluencer}
                threadInfo={threadInfo}
                currentInbox={currentInbox}
                selected={true}
            />
        </div>
    );
};

export default InboxPreview;

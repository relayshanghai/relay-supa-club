import type { sequence_influencers } from 'drizzle/schema';
import { Avatar, AvatarFallback, AvatarImage } from 'shadcn/components/ui/avatar';
import { Card, CardContent } from 'shadcn/components/ui/card';
import { Instagram, Tiktok, Youtube } from 'src/components/icons';
import { COLLAB_OPTIONS } from 'src/components/influencer/constants';
import type { THREAD_STATUS } from 'src/utils/outreach/constants';
import type { AttachmentFile, EmailContact } from 'src/utils/outreach/types';
import type { Thread as ThreadInfo } from 'src/utils/outreach/types';
import type { CreatorPlatform } from 'types';

export type Message = {
    id: string;
    from: EmailContact;
    to: EmailContact[];
    replyTo: EmailContact[];
    attachments: AttachmentFile[];
    cc: EmailContact[];
    body: string;
    date: string;
    subject?: string;
    unread: boolean;
};

export type CurrentInbox = {
    email?: string | null;
};

type ThreadPreviewProps = {
    sequenceInfluencer: typeof sequence_influencers.$inferInsert;
    threadInfo: ThreadInfo;
    _currentInbox: CurrentInbox;
    selected: boolean;
    onClick: () => void;
};

const getPlatformIcon = (platform: CreatorPlatform) => {
    switch (platform) {
        case 'youtube':
            return Youtube;
        case 'tiktok':
            return Tiktok;
        case 'instagram':
            return Instagram;
        default:
            return Youtube;
    }
};

const getUnreadMarker = (status: THREAD_STATUS) => {
    switch (status) {
        case 'unopened':
            return <span className="absolute -right-1 -top-1 aspect-square h-2 w-2 rounded-full bg-red-500" />;
        case 'unreplied':
            return <span className="absolute -right-1 -top-1 aspect-square h-2 w-2 rounded-full bg-blue-500" />;
        default:
            return <></>;
    }
};

export const ThreadPreview = ({ sequenceInfluencer, threadInfo, selected, onClick }: ThreadPreviewProps) => {
    const { name, avatar_url, username, platform, funnel_status } = sequenceInfluencer;

    // Get components conditionally
    const Icon = getPlatformIcon(platform as CreatorPlatform);
    const UnreadMarker = getUnreadMarker(threadInfo.threadInfo.thread_status as THREAD_STATUS);

    return (
        <Card
            onClick={onClick}
            className={`flex cursor-pointer rounded-none ${
                selected && 'border-l-4 border-l-primary-500 bg-primary-200'
            } transition-all`}
        >
            <CardContent className="w-full p-4">
                <div className="flex items-center gap-4">
                    <section className="relative">
                        <Avatar>
                            <AvatarImage src={avatar_url ?? ''} />
                            <AvatarFallback>{name ? name[0] : 'I'}</AvatarFallback>
                        </Avatar>
                        <Icon className="absolute -right-2 -top-1 h-5 w-5" />
                    </section>
                    <span>
                        <p className={`font-semibold ${selected && 'text-primary-600'}`}>{name}</p>
                        <p className="text-primary-400">
                            <span className="text-primary-600">@</span>
                            {username}
                        </p>
                    </span>
                </div>
            </CardContent>
            <CardContent className="mt-5">
                <div className={`relative ${COLLAB_OPTIONS[funnel_status].style} aspect-square rounded-sm p-1`}>
                    {COLLAB_OPTIONS[funnel_status].icon}
                    {UnreadMarker}
                </div>
            </CardContent>
        </Card>
    );
};

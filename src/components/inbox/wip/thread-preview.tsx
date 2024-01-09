import type { sequence_influencers } from 'drizzle/schema';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from 'shadcn/components/ui/avatar';
import { Card, CardContent } from 'shadcn/components/ui/card';
import { Instagram, Tiktok, Youtube } from 'src/components/icons';
import { COLLAB_OPTIONS } from 'src/components/influencer/constants';
import type { THREAD_STATUS } from 'src/utils/outreach/constants';
import type { EmailContact } from 'src/utils/outreach/types';
import type { Thread as ThreadInfo } from 'src/utils/outreach/types';
import type { CreatorPlatform } from 'types';

export type Message = {
    id: string;
    from: EmailContact;
    to: EmailContact[];
    replyTo: EmailContact[];
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
            return <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500" />;
        case 'unreplied':
            return <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-blue-500" />;
        default:
            return <></>;
    }
};

export const ThreadPreview = ({
    sequenceInfluencer,
    threadInfo,
    _currentInbox,
    selected,
    onClick,
}: ThreadPreviewProps) => {
    const { name, avatar_url, username, platform, url, funnel_status } = sequenceInfluencer;

    // Get components conditionally
    const Icon = getPlatformIcon(platform as CreatorPlatform);
    const UnreadMarker = getUnreadMarker(threadInfo.threadInfo.thread_status as THREAD_STATUS);

    return (
        <Card
            onClick={onClick}
            className={`flex cursor-pointer rounded-none ${
                selected && 'border-l-4 border-l-primary-700 bg-primary-200'
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
                        <p>{name}</p>
                        <Link className="text-primary-400" href={url ?? ''}>
                            @{username}
                        </Link>
                    </span>
                </div>
            </CardContent>
            <CardContent className="mt-5">
                <div className={`relative ${COLLAB_OPTIONS[funnel_status].style} rounded-sm p-1`}>
                    {COLLAB_OPTIONS[funnel_status].icon}
                    {UnreadMarker}
                </div>
            </CardContent>
        </Card>
    );
};
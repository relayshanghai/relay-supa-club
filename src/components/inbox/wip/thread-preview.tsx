import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from 'shadcn/components/ui/avatar';
import { Card, CardContent } from 'shadcn/components/ui/card';
import { Instagram, Tiktok, Youtube } from 'src/components/icons';
import { COLLAB_OPTIONS } from 'src/components/influencer/constants';
import type { FunnelStatus } from 'src/utils/api/db';
import type { CreatorPlatform } from 'types';

export type EmailContact = { address: string; name: string };

export type Message = {
    id: string;
    from: EmailContact;
    to: EmailContact[];
    cc: EmailContact[];
    body: string;
    date: Date;
};

export type ThreadInfo = {
    id: string;
    title: string;
    sequenceInfo: {
        sequenceId: string;
        sequenceName: string;
        product: string;
    };
    unread: boolean;
    messages: Message[];
};

export type CurrentInbox = {
    email: string;
};

type ThreadPreviewProps = {
    sequenceInfluencer: {
        name: string;
        avatar_url: string;
        username: string;
        email: string;
        platform: CreatorPlatform;
        funnel_status: FunnelStatus;
    };
    threadInfo: ThreadInfo;
    currentInbox: CurrentInbox;
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

const getUnreadMarker = (unread: boolean, replied: boolean) => {
    if (unread) {
        return <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500" />;
    } else if (replied) {
        return <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-blue-500" />;
    }
    return <></>;
};

export const ThreadPreview = ({
    sequenceInfluencer,
    threadInfo,
    currentInbox,
    selected,
    onClick,
}: ThreadPreviewProps) => {
    const { name, avatar_url, username, platform, funnel_status, email: influencerEmail } = sequenceInfluencer;
    const { messages, unread } = threadInfo;
    const { email: _currentInboxEmail } = currentInbox;
    const lastMessage = messages[messages.length - 1];

    // Get components conditionally
    const Icon = getPlatformIcon(platform);
    const UnreadMarker = getUnreadMarker(unread, influencerEmail === lastMessage.from.address);

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
                        <Link className="text-primary-400" href="www.lol.com">
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

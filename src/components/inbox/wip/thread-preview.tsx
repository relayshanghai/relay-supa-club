import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from 'shadcn/components/ui/avatar';
import { Card, CardContent } from 'shadcn/components/ui/card';
import { Clock, Instagram, Tiktok, Youtube } from 'src/components/icons';
import type { CreatorPlatform } from 'types';

type ThreadInfo = {
    id: string;
    title: string;
    unread: boolean;
    messages: {
        id: string;
        from: string;
        to: string[];
        cc: string[];
    }[];
};

type CurrentInbox = {
    email: string;
};

type ThreadPreviewProps = {
    sequenceInfluencer: {
        name: string;
        avatar_url: string;
        username: string;
        email: string;
        platform: CreatorPlatform;
    };
    threadInfo: ThreadInfo;
    currentInbox: CurrentInbox;
    selected: boolean;
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

export const ThreadPreview = ({ sequenceInfluencer, threadInfo, currentInbox, selected }: ThreadPreviewProps) => {
    const { name, avatar_url, username, platform } = sequenceInfluencer;
    const { messages, unread } = threadInfo;
    const { email: currentInboxEmail } = currentInbox;
    const lastMessage = messages[messages.length - 1];

    // Get components conditionally
    const Icon = getPlatformIcon(platform);
    const UnreadMarker = getUnreadMarker(unread, currentInboxEmail === lastMessage.from);

    return (
        <Card
            className={`flex rounded-none ${
                selected && 'border-l-4 border-l-primary-700 bg-primary-200'
            } transition-all`}
        >
            <CardContent className="mt-5 w-full">
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
                <div className="relative bg-yellow-200">
                    <Clock className="h-5 w-5 stroke-yellow-500" />
                    {UnreadMarker}
                </div>
            </CardContent>
        </Card>
    );
};

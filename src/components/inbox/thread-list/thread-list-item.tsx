import { Avatar, AvatarFallback, AvatarImage } from 'shadcn/components/ui/avatar';
import { Card, CardContent } from 'shadcn/components/ui/card';
import { Skeleton } from 'shadcn/components/ui/skeleton';
import type { ThreadEntity } from 'src/backend/database/thread/thread-entity';
import { ThreadStatus } from 'src/backend/database/thread/thread-status';
import { Instagram, Tiktok, Youtube } from 'src/components/icons';
import { COLLAB_OPTIONS } from 'src/components/influencer/constants';
import { truncatedText } from 'src/utils/outreach/helpers';
import type { CreatorPlatform } from 'types';

const getPlatformIcon = (platform?: CreatorPlatform) => {
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

const getUnreadMarker = (status?: ThreadStatus) => {
    switch (status) {
        case 'unopened':
            return <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500" />;
        case 'unreplied':
            return <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-blue-500" />;
        default:
            return <></>;
    }
};

export const ThreadListItemSkeleton = () => {
    return (
        <Card className="flex cursor-pointer rounded-none border-x-0 border-y-[1px] border-y-gray-100 shadow-none transition-all">
            <CardContent className="w-full p-4">
                <div className="flex h-full items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full bg-gray-300" />
                    <span className="flex h-full flex-col justify-between">
                        <Skeleton className="h-4 w-24 bg-gray-300" />
                        <Skeleton className="h-4 w-24 bg-gray-300" />
                    </span>
                </div>
            </CardContent>
            <div className="mr-2 mt-3">
                <div className="relative rounded-sm p-1">
                    <Skeleton className="h-5 w-5 bg-gray-300" />
                </div>
            </div>
        </Card>
    );
};

export default function ThreadListItem({
    thread,
    onClick,
    selected,
}: {
    thread: ThreadEntity;
    selected: boolean;
    onClick: (thread: ThreadEntity) => void;
}) {
    // Get components conditionally
    const Icon = getPlatformIcon(thread.sequenceInfluencer?.platform as CreatorPlatform);
    const UnreadMarker = getUnreadMarker(selected ? ThreadStatus.OPENED : thread.threadStatus);

    return (
        <Card
            onClick={() => onClick(thread)}
            className={`flex cursor-pointer rounded-none border-x-0 border-y-[1px] border-y-gray-100 shadow-none ${
                selected && 'border-l-4 border-violet-600 bg-primary-200'
            } transition-all`}
        >
            <CardContent className="w-full p-4">
                <div className="flex items-center gap-4">
                    <section className="relative">
                        <Avatar>
                            <AvatarImage src={thread.sequenceInfluencer?.avatarUrl ?? ''} />
                            <AvatarFallback>
                                {thread.sequenceInfluencer?.name ? thread.sequenceInfluencer.name[0] : 'I'}
                            </AvatarFallback>
                        </Avatar>
                        <Icon className="absolute -bottom-1 -right-2 h-5 w-5" />
                    </section>
                    <span>
                        <p className={`text-sm font-medium ${selected && 'text-primary-600'}`}>
                            {truncatedText(thread.sequenceInfluencer?.name ?? '', 10)}
                        </p>
                        <p className="text-sm font-medium text-primary-400">
                            <span className="text-primary-600">@</span>
                            {truncatedText(thread.sequenceInfluencer?.username ?? '', 10)}
                        </p>
                    </span>
                </div>
            </CardContent>
            {thread.sequenceInfluencer?.funnelStatus && (
                <div className="mr-2 mt-3">
                    <div
                        className={`relative ${
                            COLLAB_OPTIONS[thread.sequenceInfluencer?.funnelStatus] &&
                            COLLAB_OPTIONS[thread.sequenceInfluencer?.funnelStatus]?.style
                        } rounded-sm p-1`}
                    >
                        {COLLAB_OPTIONS[thread.sequenceInfluencer?.funnelStatus] &&
                            COLLAB_OPTIONS[thread.sequenceInfluencer?.funnelStatus].icon}
                        {UnreadMarker}
                    </div>
                </div>
            )}
        </Card>
    );
}

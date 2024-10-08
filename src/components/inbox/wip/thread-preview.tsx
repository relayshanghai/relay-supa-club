import type { sequence_influencers } from 'drizzle/schema';
import { Avatar, AvatarFallback, AvatarImage } from 'shadcn/components/ui/avatar';
import { Card, CardContent } from 'shadcn/components/ui/card';
import { Instagram, Tiktok, Youtube } from 'src/components/icons';
import { COLLAB_OPTIONS } from 'src/components/influencer/constants';
import type { THREAD_STATUS } from 'src/utils/outreach/constants';
import { truncatedText } from 'src/utils/outreach/helpers';
import type { EmailContact, Thread as ThreadInfo } from 'src/utils/outreach/types';
import type { CreatorPlatform } from 'types';
import type { Attachment } from 'types/email-engine/account-account-message-get';
import { Skeleton } from 'shadcn/components/ui/skeleton';

export type Message = {
    id: string;
    from: EmailContact;
    to: EmailContact[];
    replyTo: EmailContact[];
    attachments: Attachment[];
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
    sequenceInfluencer: typeof sequence_influencers.$inferInsert | null;
    threadInfo: ThreadInfo;
    currentInbox: CurrentInbox;
    selected: boolean;
    onClick: () => void;
};

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

const getUnreadMarker = (status?: THREAD_STATUS) => {
    switch (status) {
        case 'unopened':
            return <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500" />;
        case 'unreplied':
            return <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-blue-500" />;
        default:
            return <></>;
    }
};

export const ThreadPreviewSkeleton = () => {
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

export const ThreadPreview = ({ sequenceInfluencer, threadInfo, selected, onClick }: ThreadPreviewProps) => {
    // Get components conditionally
    const Icon = getPlatformIcon(sequenceInfluencer?.platform as CreatorPlatform);
    const UnreadMarker = getUnreadMarker(threadInfo?.threadInfo?.thread_status as THREAD_STATUS);

    return (
        <Card
            onClick={onClick}
            className={`flex cursor-pointer rounded-none border-x-0 border-y-[1px] border-y-gray-100 shadow-none ${
                selected && 'border-l-4 border-violet-600 bg-primary-200'
            } transition-all`}
        >
            <CardContent className="w-full p-4">
                <div className="flex items-center gap-4">
                    <section className="relative">
                        <Avatar>
                            <AvatarImage src={sequenceInfluencer?.avatar_url ?? ''} />
                            <AvatarFallback>
                                {sequenceInfluencer?.name ? sequenceInfluencer?.name[0] : 'I'}
                            </AvatarFallback>
                        </Avatar>
                        <Icon className="absolute -bottom-1 -right-2 h-5 w-5" />
                    </section>
                    <span>
                        <p className={`text-sm font-medium ${selected && 'text-primary-600'}`}>
                            {truncatedText(sequenceInfluencer?.name ?? '', 10)}
                        </p>
                        <p className="text-sm font-medium text-primary-400">
                            <span className="text-primary-600">@</span>
                            {truncatedText(sequenceInfluencer?.username ?? '', 10)}
                        </p>
                    </span>
                </div>
            </CardContent>
            {sequenceInfluencer?.funnel_status && (
                <div className="mr-2 mt-3">
                    <div
                        className={`relative ${
                            COLLAB_OPTIONS[sequenceInfluencer.funnel_status] &&
                            COLLAB_OPTIONS[sequenceInfluencer.funnel_status]?.style
                        } rounded-sm p-1`}
                    >
                        {COLLAB_OPTIONS[sequenceInfluencer.funnel_status] &&
                            COLLAB_OPTIONS[sequenceInfluencer.funnel_status].icon}
                        {UnreadMarker}
                    </div>
                </div>
            )}
        </Card>
    );
};

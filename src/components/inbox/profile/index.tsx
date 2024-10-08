import { cls } from 'src/utils/classnames';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'shadcn/components/ui/tabs';
import { InfluencerAvatarWithFallback } from 'src/components/library/influencer-avatar-with-fallback';
import { Youtube, Tiktok, Instagram, BorderedTick, Spinner } from 'src/components/icons';
import Link from 'next/link';
import { generateUrlIfTiktok, truncatedText } from 'src/utils/outreach/helpers';
import { useTranslation } from 'react-i18next';
import ProfileManage from './profile-manage/profile-manage';
import { useManageProfileUpdating } from 'src/hooks/v2/use-sequence-influencer';
import ProfileChannel, { type ProfileChannelSection } from './profile-channel/profile-channel';
import { useThread } from 'src/hooks/v2/use-thread';
import type { ThreadEntity } from 'src/backend/database/thread/thread-entity';
import type { AddressEntity } from 'src/backend/database/influencer/address-entity';
import type { SequenceInfluencerEntity } from 'src/backend/database/sequence/sequence-influencer-entity';
import { Tooltip } from 'src/components/library';
import { Skeleton } from 'shadcn/components/ui/skeleton';

export type ProfileValue = {
    shippingDetails: ProfileChannelSection;
};

export const activeTabStyles = cls(['active', 'text-primary-500', 'border-b-2', 'border-b-primary-500']);

const SequenceInfluencerDetail = ({ sequenceInfluencer }: { sequenceInfluencer: SequenceInfluencerEntity }) => {
    const Icon =
        sequenceInfluencer?.influencerSocialProfile?.platform == 'youtube'
            ? Youtube
            : sequenceInfluencer?.influencerSocialProfile?.platform === 'tiktok'
            ? Tiktok
            : Instagram;
    return (
        <section className="relative flex items-center gap-4 p-6">
            <section className="relative z-10">
                <InfluencerAvatarWithFallback
                    bordered
                    url={sequenceInfluencer?.influencerSocialProfile?.avatarUrl}
                    name={sequenceInfluencer?.influencerSocialProfile?.username}
                    size={100}
                    className="rounded-full"
                />
                <Icon className="absolute -bottom-1 -right-1 h-8 w-8" />
            </section>
            <div className="z-10 flex flex-col justify-between gap-2">
                <Tooltip
                    content={
                        sequenceInfluencer?.influencerSocialProfile?.name ??
                        sequenceInfluencer?.influencerSocialProfile?.username ??
                        ''
                    }
                    position="bottom-center"
                    contentSize="small"
                >
                    <h1 className="whitespace-nowrap text-2xl font-semibold text-white">
                        {truncatedText(
                            sequenceInfluencer?.influencerSocialProfile?.name ??
                                sequenceInfluencer?.influencerSocialProfile?.username ??
                                '',
                            10,
                        )}
                    </h1>
                </Tooltip>
                <div className="flex flex-col">
                    <Tooltip
                        content={sequenceInfluencer?.influencerSocialProfile?.username ?? ''}
                        position="bottom-center"
                        contentSize="small"
                    >
                        {sequenceInfluencer?.influencerSocialProfile?.url ? (
                            <Link
                                href={generateUrlIfTiktok(
                                    sequenceInfluencer?.influencerSocialProfile?.url,
                                    sequenceInfluencer?.influencerSocialProfile?.username,
                                )}
                                className="text-lg font-medium text-primary-500"
                                target="_blank"
                            >
                                <span className="text-pink-500">@</span>
                                {truncatedText(sequenceInfluencer?.influencerSocialProfile?.username ?? '', 10)}
                            </Link>
                        ) : (
                            <p className="text-lg font-medium text-primary-500">
                                <span className="text-pink-500">@</span>
                                {truncatedText(sequenceInfluencer?.influencerSocialProfile?.username ?? '', 10)}
                            </p>
                        )}
                    </Tooltip>
                    <Link
                        href={`/sequences/${sequenceInfluencer?.sequence.id}`}
                        className="text-sm text-gray-400 underline"
                    >
                        {truncatedText(sequenceInfluencer?.sequence?.name ?? 'Sequence Name', 10)}
                    </Link>
                </div>
            </div>
            <div className="absolute left-0 top-0 z-0 h-[50%] w-full bg-boostbotbackground" />
        </section>
    );
};

const SequenceInfluencerDetailLoading = () => {
    return (
        <section className="relative flex items-center gap-4 p-6">
            <section className="relative z-10">
                <InfluencerAvatarWithFallback bordered size={100} className="rounded-full" />
            </section>
            <div className="z-10 flex flex-col justify-between gap-2">
                <h1 className="whitespace-nowrap text-2xl font-semibold text-white">
                    <Skeleton className="flex h-8 w-48 bg-gray-300" />
                </h1>
                <div className="flex flex-col">
                    <p className="flex flex-row text-lg font-medium text-primary-500">
                        <span className="text-pink-500">@</span>
                        <Skeleton className="ml-1 flex h-8 w-32 bg-gray-300" />
                    </p>
                    <Link href={`/sequences/#`} className="text-sm text-gray-400 underline">
                        <Skeleton className="mt-2 flex h-6 w-48 bg-gray-300" />
                    </Link>
                </div>
            </div>
            <div className="absolute left-0 top-0 z-0 h-[50%] w-full bg-boostbotbackground" />
        </section>
    );
};

const SpinnerAndTick = ({ updating }: { updating: boolean }) => {
    if (updating) {
        return <Spinner className="absolute right-4 top-4 z-10 h-6 w-6 fill-white" />;
    } else {
        return <BorderedTick className="absolute right-1 top-1 z-10 h-6 w-6 stroke-white" />;
    }
};

export default function Profile() {
    const { selectedThread, loading } = useThread();
    const { sequenceInfluencer } = selectedThread as ThreadEntity;
    const { t } = useTranslation();
    const [updating] = useManageProfileUpdating();

    return (
        <section className="w-[360px] shrink-0 grow-0 overflow-y-auto">
            <div className="relative">
                {!loading && <SpinnerAndTick updating={updating} />}
                {loading ? (
                    <SequenceInfluencerDetailLoading />
                ) : (
                    <SequenceInfluencerDetail sequenceInfluencer={sequenceInfluencer as SequenceInfluencerEntity} />
                )}
                {loading ? (
                    <div className="p-4">
                        <Skeleton className="flex h-96 w-full bg-gray-300" />
                    </div>
                ) : (
                    <Tabs defaultValue="manage" className="">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="manage">{t('profile.manageTab')}</TabsTrigger>
                            <TabsTrigger value="channel">{t('profile.channelTab')}</TabsTrigger>
                        </TabsList>
                        <TabsContent value="manage">
                            <ProfileManage
                                influencer={sequenceInfluencer as SequenceInfluencerEntity}
                                address={
                                    sequenceInfluencer?.address ||
                                    ({
                                        addressLine1: '',
                                        city: '',
                                        country: '',
                                        state: '',
                                        name: '',
                                        addressLine2: '',
                                        trackingCode: '',
                                        phoneNumber: '',
                                        postalCode: '',
                                    } as AddressEntity)
                                }
                            />
                        </TabsContent>
                        <TabsContent value="channel">
                            {sequenceInfluencer?.influencerSocialProfile && (
                                <>
                                    <ProfileChannel influencerProfile={sequenceInfluencer?.influencerSocialProfile} />
                                </>
                            )}
                        </TabsContent>
                    </Tabs>
                )}
            </div>
        </section>
    );
}

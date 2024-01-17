import type { SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';
import type { DetailedHTMLProps, HTMLAttributes } from 'react';
import { cls } from 'src/utils/classnames';
import type { ProfileNotes } from './profile-notes-tab';
import { ChannelSection, type ProfileChannelSection } from './profile-channel-section';

import type { SearchTableInfluencer } from 'types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'shadcn/components/ui/tabs';
import { InfluencerAvatarWithFallback } from 'src/components/library/influencer-avatar-with-fallback';
import { Youtube, Tiktok, Instagram, BorderedTick, Spinner } from 'src/components/icons';
import Link from 'next/link';
import { useSequence } from 'src/hooks/use-sequence';
import { ManageSection, manageSectionUpdatingAtom } from '../manage-section';
import type { Address } from 'src/backend/database/addresses';
import { useAtom } from 'jotai';
import { truncatedText } from 'src/utils/outreach/helpers';

export type ProfileValue = {
    notes: ProfileNotes;
    shippingDetails: ProfileChannelSection;
};

type Props = {
    profile: SequenceInfluencerManagerPage;
    address: Address;
    influencerData?: SearchTableInfluencer | null;
    onUpdate?: (data: ProfileValue) => void;
    onCancel?: () => void;
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export const activeTabStyles = cls(['active', 'text-primary-500', 'border-b-2', 'border-b-primary-500']);

export const ProfileScreen = ({ profile, influencerData, address }: Props) => {
    const Icon = profile.platform == 'youtube' ? Youtube : profile.platform === 'tiktok' ? Tiktok : Instagram;

    const { sequence } = useSequence(profile.sequence_id);

    const [updating, _setUpdating] = useAtom(manageSectionUpdatingAtom);

    return (
        <div className="relative">
            {updating ? (
                <Spinner className="absolute right-4 top-4 z-10 h-6 w-6 fill-white" />
            ) : (
                <BorderedTick className="absolute right-1 top-1 z-10 h-6 w-6 stroke-white" />
            )}
            <section className="relative flex items-center gap-4 p-6">
                <section className="relative z-10">
                    <InfluencerAvatarWithFallback
                        bordered
                        url={profile.avatar_url}
                        name={profile.username}
                        size={100}
                        className="rounded-full"
                    />
                    <Icon className="absolute bottom-0 right-1 h-6 w-6" />
                </section>
                <div className="z-10 flex flex-col justify-between gap-2">
                    <h1 className="whitespace-nowrap text-2xl font-semibold text-white">
                        {truncatedText(profile.name ?? profile.username ?? '', 10)}
                    </h1>
                    <div className="flex flex-col">
                        {profile.url ? (
                            <Link href={profile.url} className="text-lg font-medium text-primary-500">
                                <span className="text-pink-500">@</span>
                                {profile.username}
                            </Link>
                        ) : (
                            <p className="text-lg font-medium text-primary-500">
                                <span className="text-pink-500">@</span>
                                {profile.username}
                            </p>
                        )}

                        <Link href={`/sequences/${profile.sequence_id}`} className="text-sm text-gray-400 underline">
                            {sequence?.name ?? 'Sequence Name'}
                        </Link>
                    </div>
                </div>
                <div className="absolute left-0 top-0 z-0 h-[50%] w-full bg-boostbotbackground" />
            </section>
            <Tabs defaultValue="manage" className="">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="manage">Manage</TabsTrigger>
                    <TabsTrigger value="channel">Channel</TabsTrigger>
                </TabsList>
                <TabsContent value="manage">
                    <ManageSection influencer={profile} address={address} />
                </TabsContent>
                <TabsContent value="channel">
                    {influencerData && <ChannelSection profile={influencerData} />}
                </TabsContent>
            </Tabs>
        </div>
    );
};

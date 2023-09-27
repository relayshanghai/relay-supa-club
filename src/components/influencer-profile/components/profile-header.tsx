import type { DetailedHTMLProps, HTMLAttributes } from 'react';
import { useMemo } from 'react';
import { EmailOutlineColored, TiktokNoBg, YoutubeNoBg } from 'src/components/icons';
import type { SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';
import { imgProxy } from 'src/utils/fetcher';
import Link from 'next/link';

// @note probably exists already
export type Profile = {
    id?: string;
    influencer_id?: string;
    username: string;
    platform: string;
    name: string;
    avatar: string;
};

type Props = {
    profile: SequenceInfluencerManagerPage;
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

const translatePlatform = (platform: string) => {
    const _platform = platform.toLocaleLowerCase();
    if (_platform === 'youtube') return 'YT';
    if (_platform === 'instagram') return 'IG';
    if (_platform === 'tiktok') return 'TT';
    return 'NA';
};

export const ProfileHeader = ({ profile, ...props }: Props) => {
    // @todo platform is not provided
    const platform = useMemo(() => translatePlatform(profile.platform ?? ''), [profile.platform]);

    return (
        <div {...props}>
            <div className="inline-flex items-center justify-start gap-2">
                <div className="flex items-center justify-center rounded-full bg-gray-200 bg-opacity-50">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full">
                        {profile.avatar_url ? (
                            <img className="rounded-full" src={imgProxy(profile.avatar_url)} alt="Photo" />
                        ) : (
                            <img
                                className="rounded-full"
                                src={`https://api.dicebear.com/6.x/open-peeps/svg?seed=${profile.username}&size=96`}
                                alt="Photo"
                            />
                        )}
                    </div>
                </div>
                <div className="flex shrink grow basis-0 items-center justify-start self-stretch">
                    <div className="flex h-20 shrink grow basis-0 items-center justify-start gap-6">
                        <div className="inline-flex flex-col items-start justify-center">
                            <div>
                                <span className="text-2xl font-semibold tracking-tight text-violet-500">@</span>
                                <Link
                                    href={`/influencer/${profile.platform}/${profile.iqdata_id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <span className="text-2xl font-semibold tracking-tight text-gray-600">
                                        {profile.username}
                                    </span>
                                </Link>
                                <sup className="relative -top-4 ml-1 text-sm font-semibold leading-tight tracking-tight text-violet-500">
                                    {platform}
                                </sup>
                            </div>
                            <div className="flex flex-col items-start justify-center pl-7">
                                <Link href={`/influencer/${profile.platform}/${profile.iqdata_id}`} target="_blank">
                                    <div className="text-lg font-semibold tracking-tight text-gray-400">
                                        {profile.name}
                                    </div>
                                </Link>
                                <div className="mt-1 inline-flex items-center justify-start gap-2.5">
                                    <span className="relative h-3.5 w-3.5">
                                        <EmailOutlineColored className="stroke-primary-500" />
                                    </span>
                                    <span className="relative h-3.5 w-3.5">
                                        <TiktokNoBg />
                                    </span>
                                    <span className="relative h-3.5 w-3.5">
                                        <YoutubeNoBg />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

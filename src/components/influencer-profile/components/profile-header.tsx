import type { DetailedHTMLProps, HTMLAttributes } from 'react';
import { useMemo } from 'react';
import { EmailOutlineColored, TiktokNoBg, YoutubeNoBg } from 'src/components/icons';

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
    profile: Profile;
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

const translatePlatform = (platform: string) => {
    const _platform = platform.toLocaleLowerCase();
    if (_platform === 'youtube') return 'YT';
    if (_platform === 'instagram') return 'IG';
    if (_platform === 'tiktok') return 'TT';
    return platform;
};

export const ProfileHeader = ({ profile, ...props }: Props) => {
    const platform = useMemo(() => translatePlatform(profile.platform), [profile.platform]);

    return (
        <div {...props}>
            <div className="inline-flex items-center justify-start gap-2">
                <div className="flex items-center justify-center rounded-full bg-gray-200 bg-opacity-50">
                    <div className="flex items-center justify-center rounded-full">
                        <img className="rounded-full" src={profile.avatar} alt="Photo" />
                    </div>
                </div>
                <div className="flex shrink grow basis-0 items-center justify-start self-stretch">
                    <div className="flex h-20 shrink grow basis-0 items-center justify-start gap-6">
                        <div className="inline-flex flex-col items-start justify-center">
                            <div>
                                <span className="text-2xl font-semibold tracking-tight text-violet-500">@</span>
                                <span className="text-2xl font-semibold tracking-tight text-gray-600">
                                    {profile.username}
                                </span>
                                <sup className="relative -top-4 ml-1 text-sm font-semibold leading-tight tracking-tight text-violet-500">
                                    {platform}
                                </sup>
                            </div>
                            <div className="flex flex-col items-start justify-center pl-7">
                                <div className="text-lg font-semibold tracking-tight text-gray-400">{profile.name}</div>
                                <div className="inline-flex items-center justify-start gap-2.5">
                                    <span className="relative h-3.5 w-3.5">
                                        <EmailOutlineColored />
                                    </span>
                                    <span className="relative h-3.5 w-3.5">
                                        <TiktokNoBg />
                                    </span>
                                    <span className="relative mt-1 h-3.5 w-3.5">
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

import Link from 'next/link';
import { collabOptions } from '../constants';
import { InboxIcon } from 'src/components/icons';
import { imgProxy } from 'src/utils/fetcher';
import { type SequenceInfluencer } from 'src/utils/api/db';
import { useInfluencerSocialProfile } from 'src/hooks/use-influencer-social-profile';
import i18n from 'i18n';
import { useProfile } from 'src/hooks/use-profile';

interface InfluencerRowProps {
    index: number;
    influencer: SequenceInfluencer;
    onCheckboxChange?: () => void;
}

export const InfluencerRow = ({ index, influencer }: InfluencerRowProps) => {
    const { influencer_social_profile_id, tags, updated_at, funnel_status, added_by } = influencer;
    const { influencerSocialProfile } = useInfluencerSocialProfile(influencer_social_profile_id);
    const { profile } = useProfile(added_by);
    return (
        <tr key={influencer.id + index} className="group cursor-default text-sm  hover:bg-primary-50">
            {/* <td className="whitespace-nowrap items-center text-center display-none">
                <input className="appearance-none rounded border-gray-300 checked:text-primary-500" checked={checked} onChange={onCheckboxChange} type='checkbox' />
            </td> */}
            <td className="whitespace-nowrap px-6 py-2 font-medium">
                <div className="flex flex-row items-center gap-2">
                    <div>
                        <img
                            className="inline-block h-14 w-14 bg-slate-300"
                            src={imgProxy(influencerSocialProfile?.url || '')}
                            alt={`influencer-avatar-${influencerSocialProfile?.name}`}
                        />
                    </div>
                    <div className="flex flex-col">
                        <p className="font-semibold text-primary-600">{influencerSocialProfile?.name}</p>
                        <Link
                            className="cursor-pointer font-semibold text-gray-500"
                            href={influencerSocialProfile?.url || ''}
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            @{influencerSocialProfile?.username}
                        </Link>
                    </div>
                </div>
            </td>
            <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                <p>
                    <p
                        className={`rounded text-xs font-medium ${
                            collabOptions[funnel_status as keyof typeof collabOptions].style
                        } w-fit whitespace-nowrap px-2 py-1.5`}
                    >
                        {funnel_status}
                    </p>
                </p>
            </td>
            <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-600">{profile?.data?.first_name}</td>
            <td className="font-regular flex flex-row items-center gap-1 whitespace-nowrap p-6 text-xs text-gray-600">
                {tags.map((tag: string) => {
                    return (
                        <p key={tag} className="whitespace-nowrap rounded-md bg-primary-100 px-2 py-1 text-primary-600">
                            {tag}
                        </p>
                    );
                })}
            </td>
            <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-600">
                {new Date(updated_at).toLocaleDateString(i18n.language, {
                    month: 'short',
                    day: 'numeric',
                })}
            </td>
            <td className="whitespace-nowrap py-4 pl-6">
                <div className="relative w-fit cursor-pointer rounded-md border-2 border-primary-500 px-4 py-2">
                    <InboxIcon className="h-6 w-6 stroke-primary-500" />
                    {<div className="absolute -right-2 -top-2 h-4 w-4 rounded-full bg-red-500" />}
                </div>
            </td>
        </tr>
    );
};

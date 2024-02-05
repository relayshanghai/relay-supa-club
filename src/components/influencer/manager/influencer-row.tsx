import Link from 'next/link';
import { COLLAB_OPTIONS, PLATFORMS } from '../constants';
import { InboxIcon } from 'src/components/icons';
import i18n from 'i18n';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { type SequenceInfluencerManagerPageWithChannelData } from 'pages/api/sequence/influencers';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { GoToInbox } from 'src/utils/analytics/events/outreach/go-to-inbox';
import { useUser } from 'src/hooks/use-user';
import { InfluencerAvatarWithFallback } from 'src/components/library/influencer-avatar-with-fallback';

export type InfluencerRowProps = {
    index: number;
    influencer: SequenceInfluencerManagerPageWithChannelData;
    onCheckboxChange?: () => void;
    onRowClick?: (data: SequenceInfluencerManagerPageWithChannelData) => void;
};

export const InfluencerRow = ({ index, influencer, ...props }: InfluencerRowProps) => {
    const {
        name,
        username,
        manager_first_name,
        avatar_url,
        url,
        tags,
        updated_at,
        funnel_status,
        email,
        platform,
        added_by,
    } = influencer;
    const { profile } = useUser();
    const { t } = useTranslation();
    const handleRowClick = useCallback(
        (influencer: SequenceInfluencerManagerPageWithChannelData) => {
            props.onRowClick && props.onRowClick(influencer);
        },
        [props],
    );
    const { track } = useRudderstackTrack();

    const handleInboxClick = useCallback(
        (e: any) => {
            e.stopPropagation();
            track(GoToInbox, {
                influencer_id: influencer.id,
                has_unread_messages: null,
                current_status: funnel_status,
                is_users_influencer: added_by === profile?.id,
            });
        },
        [added_by, funnel_status, influencer.id, profile?.id, track],
    );

    return (
        <tr
            onClick={() => handleRowClick(influencer)}
            key={influencer.id + index}
            className="group cursor-default text-sm  hover:bg-primary-50"
        >
            {/* // TODO Add multiselect operations on the table */}
            {/* <td className="whitespace-nowrap items-center text-center display-none">
                <input className="appearance-none rounded border-gray-300 checked:text-primary-500" checked={checked} onChange={onCheckboxChange} type='checkbox' />
            </td> */}
            <td className="whitespace-nowrap px-6 py-2 font-medium">
                <div className="flex items-center gap-2">
                    <div className="flex-2 flex">
                        <InfluencerAvatarWithFallback url={avatar_url || ''} name={name} size={60} />
                    </div>
                    <div className="flex-1 overflow-hidden ">
                        <p className="font-semibold text-primary-600">{name}</p>
                        {url && (
                            <Link
                                className="cursor-pointer font-semibold text-gray-500"
                                href={url}
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                @{username}
                            </Link>
                        )}
                    </div>
                </div>
            </td>
            <td className="whitespace-nowrap px-6 py-4">
                <p className="font-semibold text-primary-600">{PLATFORMS[platform as keyof typeof PLATFORMS]}</p>
            </td>
            <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                <p
                    className={`rounded text-xs font-medium ${COLLAB_OPTIONS[funnel_status].style} w-fit whitespace-nowrap px-2 py-1.5`}
                >
                    {t(`manager.${funnel_status}`)}
                </p>
            </td>
            <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-600">{manager_first_name}</td>
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
                {email && (
                    <Link href="/inbox" target="_blank" rel="noopener noreferrer">
                        <div
                            onClick={handleInboxClick}
                            className="relative w-fit cursor-pointer rounded-md border-2 border-primary-500 px-4 py-2"
                        >
                            <InboxIcon className="h-6 w-6 stroke-primary-500" />
                            {/* // TODO https://toil.kitemaker.co/0JhYl8-relayclub/8sxeDu-v2_project/items/968 Add unread message indication */}
                            {/* <div className="absolute -right-2 -top-2 h-4 w-4 rounded-full bg-red-500" /> */}
                        </div>
                    </Link>
                )}
            </td>
        </tr>
    );
};

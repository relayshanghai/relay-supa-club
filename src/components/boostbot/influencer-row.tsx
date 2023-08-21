import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import type { Influencer } from 'pages/boostbot';
import { Instagram, Youtube, Tiktok, Spinner } from 'src/components/icons';
import { LockClosedIcon, LockOpenIcon, UsersIcon, ChartBarIcon } from '@heroicons/react/24/solid';
import { decimalToPercent, numberFormatter } from 'src/utils/formatter';

interface InfluencerRowProps {
    influencer: Influencer;
    handleUnlockInfluencer: (userId: string) => void;
    isLoading: boolean;
}

export const InfluencerRow = ({ influencer, handleUnlockInfluencer, isLoading }: InfluencerRowProps) => {
    const { t } = useTranslation();
    const { user_id, username, custom_name, fullname, url = '', picture, followers, engagement_rate } = influencer;

    const handle = username || custom_name || fullname || '';
    const posts = 'top_posts' in influencer && influencer.top_posts && influencer.top_posts.slice(0, 3);
    const email =
        'contacts' in influencer &&
        influencer.contacts.find((contact) => contact.type === 'email')?.formatted_value.toLowerCase();
    const Icon = url.includes('youtube') ? Youtube : url.includes('tiktok') ? Tiktok : Instagram;

    return (
        <tr className="transition-all hover:bg-primary-100">
            <td className="whitespace-nowrap px-6 py-2">
                <Link
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="table-cell text-primary-500 transition-all hover:scale-110"
                >
                    <Icon className="h-8 w-8" />
                </Link>
            </td>

            <td className="whitespace-nowrap px-4 py-2">
                <Link
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group table-cell text-sm text-primary-500"
                >
                    <div className="flex items-center">
                        <div className="relative h-12 w-12 transition-all group-hover:scale-105">
                            <img className="h-full w-full rounded-full object-cover" src={picture} alt={handle} />
                        </div>
                        <div className="ml-4">
                            <div className="font-bold leading-4 text-gray-900">{fullname}</div>
                            <span className="group-hover:underline">{handle ? `@${handle}` : null}</span>
                        </div>
                    </div>
                </Link>
            </td>

            <td className="whitespace-nowrap px-4 py-2">
                <div className="flex gap-2">
                    {posts ? (
                        posts.map((post) => (
                            <Link
                                key={post.post_id}
                                href={post.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative h-24 w-24 transition-all hover:scale-105"
                            >
                                <img src={post.thumbnail} alt={post.text} className="h-full w-full object-cover" />
                            </Link>
                        ))
                    ) : (
                        <>
                            <div className="h-24 w-24 bg-primary-200 blur-sm" />
                            <div className="h-24 w-24 bg-primary-200 blur-sm" />
                            <div className="h-24 w-24 bg-primary-200 blur-sm" />
                        </>
                    )}
                </div>
            </td>

            <td className="whitespace-nowrap px-4 py-2">
                <div className="flex flex-col gap-1 text-sm">
                    <p className="flex" title={t('boostbot.followers') ?? 'Followers'}>
                        <UsersIcon className="mr-2 h-4 w-4 flex-shrink-0 fill-slate-600" />
                        {numberFormatter(followers) ?? '-'}
                    </p>
                    <p className="flex text-primary-500" title={t('boostbot.engagementRate') ?? 'Engagement Rate'}>
                        <ChartBarIcon className="mr-2 h-4 w-4 flex-shrink-0 fill-primary-500" />
                        {decimalToPercent(engagement_rate) ?? '-'}
                    </p>
                </div>
            </td>

            <td className="whitespace-nowrap px-4 py-2">
                {email ? (
                    <a
                        href={`mailto:${email}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-primary-500 hover:underline"
                    >
                        {email}
                    </a>
                ) : isLoading ? (
                    <Spinner className="h-6 w-6 fill-primary-500 text-white" />
                ) : (
                    <div
                        className="group ml-2 table-cell p-1 pl-0 hover:cursor-pointer"
                        onClick={() => handleUnlockInfluencer(user_id)}
                    >
                        <LockClosedIcon className="h-6 w-6 fill-primary-500 group-hover:hidden" />
                        <LockOpenIcon className="relative left-[3px] hidden h-6 w-6 fill-primary-500 group-hover:block" />
                    </div>
                )}
            </td>
        </tr>
    );
};

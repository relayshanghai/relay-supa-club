import Link from 'next/link';
import type { ColumnDef } from '@tanstack/react-table';
import {
    Bars3BottomLeftIcon,
    EyeIcon,
    HandThumbUpIcon,
    LockClosedIcon,
    LockOpenIcon,
    XMarkIcon,
} from '@heroicons/react/24/solid';
import type { Influencer } from 'pages/boostbot';
import { numberFormatter } from 'src/utils/formatter';
import { Spinner } from 'src/components/icons';
import { BoostbotAccountCell } from './boostbot-account-cell';

export const columns: ColumnDef<Influencer>[] = [
    {
        id: 'account',
        header: ({ table }) => table.options.meta?.t('boostbot.table.account'),
        cell: BoostbotAccountCell,
    },
    {
        id: 'topPosts',
        header: ({ table }) => table.options.meta?.t('boostbot.table.topPosts'),
        cell: ({ row }) => {
            const influencer = row.original;
            const posts = 'top_posts' in influencer && influencer.top_posts && influencer.top_posts.slice(0, 3);
            const description = 'description' in influencer && influencer.description;
            const topicsList = influencer.topics.map((topic) => `#${topic}`).join(', ');

            return (
                <div className="flex flex-col gap-4">
                    <div className="flex gap-2">
                        {posts ? (
                            posts.map((post) => (
                                <Link
                                    key={post.post_id}
                                    href={post.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex h-40 w-40 flex-col overflow-hidden rounded-md border"
                                >
                                    <div className="flex-1 overflow-hidden">
                                        <img
                                            src={post.thumbnail}
                                            alt={post.text}
                                            className="h-full w-full object-cover transition-all group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="flex justify-between p-2 text-xs">
                                        <div className="flex items-center gap-0.5">
                                            <EyeIcon className="h-3 w-3 flex-shrink-0 fill-slate-700" />
                                            {numberFormatter(post.stat.plays || post.stat.views) ?? '-'}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <HandThumbUpIcon className="h-3 w-3 flex-shrink-0 fill-slate-700" />
                                            {numberFormatter(post.stat.likes) ?? '-'}
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <>
                                <div className="h-40 w-40 bg-primary-200 blur-sm" />
                                <div className="h-40 w-40 bg-primary-200 blur-sm" />
                                <div className="h-40 w-40 bg-primary-200 blur-sm" />
                            </>
                        )}
                    </div>

                    {description ? (
                        <p className="flex max-w-[490px] flex-grow-0 gap-1 text-xs">
                            <Bars3BottomLeftIcon className="h-4 w-4 flex-shrink-0" /> {description}
                        </p>
                    ) : null}

                    <div className="border-b border-gray-200" />
                    <p className="ml-2 text-xs">{topicsList}</p>
                </div>
            );
        },
    },
    {
        id: 'email',
        header: ({ table }) => table.options.meta?.t('boostbot.table.email'),
        cell: ({ row, table }) => {
            const influencer = row.original;

            const unlockInfluencer = () => {
                table.options.meta?.handleUnlockInfluencer(influencer);
            };

            const email =
                'contacts' in influencer &&
                influencer.contacts.find((contact) => contact.type === 'email')?.formatted_value.toLowerCase();

            return (
                <div>
                    {email ? (
                        <div className="flex items-center gap-1 break-all text-xs text-primary-500">{email}</div>
                    ) : influencer.isLoading ? (
                        <Spinner className="h-6 w-6 fill-primary-500 text-primary-200" />
                    ) : (
                        <button
                            className="group ml-2 table-cell p-1 pl-0 hover:cursor-pointer"
                            onClick={unlockInfluencer}
                            aria-label={table.options.meta?.t('boostbot.table.unlockInfluencer')}
                        >
                            <LockClosedIcon className="h-6 w-6 fill-primary-500 group-hover:hidden" />
                            <LockOpenIcon className="relative left-[3px] hidden h-6 w-6 fill-primary-500 group-hover:block" />
                        </button>
                    )}
                </div>
            );
        },
    },
    {
        id: 'remove',
        header: '',
        cell: ({ row, table }) => {
            const removeInfluencer = () => {
                table.options.meta?.removeInfluencer(row.original.user_id);
            };

            return (
                <button
                    className="flex h-6 w-6"
                    onClick={removeInfluencer}
                    aria-label={table.options.meta?.t('boostbot.table.removeInfluencer')}
                >
                    <XMarkIcon className="h-full w-full flex-shrink-0 fill-red-300 transition-all hover:scale-105 hover:fill-red-400" />
                </button>
            );
        },
    },
];

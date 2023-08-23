import Link from 'next/link';
import type { ColumnDef } from '@tanstack/react-table';
import {
    LockClosedIcon,
    LockOpenIcon,
    UsersIcon,
    EyeIcon,
    HandThumbUpIcon,
    ChatBubbleLeftIcon,
    Bars3BottomLeftIcon,
    EnvelopeIcon,
} from '@heroicons/react/24/solid';
import type { Influencer } from 'pages/boostbot';
import { numberFormatter } from 'src/utils/formatter';
import { Instagram, Youtube, Tiktok, Spinner } from 'src/components/icons';

export const columns: ColumnDef<Influencer>[] = [
    {
        id: 'account',
        header: ({ table }) => table.options.meta?.translation('boostbot.account'),
        cell: ({ row, table }) => {
            const influencer = row.original;
            const { username, custom_name, fullname, url = '', picture, followers, topics } = influencer;
            const handle = username || custom_name || fullname || '';
            const Icon = url.includes('youtube') ? Youtube : url.includes('tiktok') ? Tiktok : Instagram;
            const topicsList = topics.map((topic) => `#${topic}`).join(', ');

            return (
                <>
                    <Link href={url} target="_blank" rel="noopener noreferrer" className="group table-cell text-sm">
                        <div className="flex flex-col gap-0.5">
                            <div className="relative mb-2 h-24 w-24 transition-all group-hover:scale-105">
                                <img className="h-full w-full rounded-full object-cover" src={picture} alt={handle} />
                                <Icon className="absolute -right-2 bottom-1 h-8 w-8" />
                            </div>
                            <div className="font-bold leading-4 text-gray-900">{fullname}</div>
                            <span className="text-primary-500 group-hover:underline">
                                {handle ? `@${handle}` : null}
                            </span>
                            <p
                                className="flex gap-1 text-gray-900"
                                title={table.options.meta?.translation('boostbot.followers')}
                            >
                                <UsersIcon className="h-4 w-4 flex-shrink-0 fill-slate-700" />
                                {numberFormatter(followers) ?? '-'}
                            </p>
                        </div>
                    </Link>

                    <p className="mt-2">{topicsList}</p>
                </>
            );
        },
    },
    {
        id: 'details',
        header: ({ table }) => table.options.meta?.translation('boostbot.details'),
        cell: ({ row, table }) => {
            const influencer = row.original;
            const posts = 'top_posts' in influencer && influencer.top_posts && influencer.top_posts.slice(0, 3);
            const description = 'description' in influencer && influencer.description;
            const email =
                'contacts' in influencer &&
                influencer.contacts.find((contact) => contact.type === 'email')?.formatted_value.toLowerCase();

            const unlockInfluencer = () => {
                table.options.meta?.handleUnlockInfluencer(influencer.user_id);
            };

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
                                    <div className="overflow-hidden">
                                        <img
                                            src={post.thumbnail}
                                            alt={post.text}
                                            className="h-full w-full object-cover transition-all group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="flex justify-between p-2 text-xs">
                                        <div className="flex items-center gap-0.5">
                                            {numberFormatter(post.stat.plays) ?? '-'}
                                            <EyeIcon className="h-3 w-3 flex-shrink-0 fill-slate-700" />
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {numberFormatter(post.stat.likes) ?? '-'}
                                            <HandThumbUpIcon className="h-3 w-3 flex-shrink-0 fill-slate-700" />
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {numberFormatter(post.stat.comments) ?? '-'}
                                            <ChatBubbleLeftIcon className="h-3 w-3 flex-shrink-0 fill-slate-700" />
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <button
                                className="group relative ml-2 flex gap-2 p-1 pl-0 hover:cursor-pointer"
                                onClick={unlockInfluencer}
                                aria-label={table.options.meta?.translation('boostbot.unlockInfluencer')}
                            >
                                <div className="h-40 w-40 bg-primary-200 blur-sm" />
                                <div className="h-40 w-40 bg-primary-200 blur-sm" />
                                <div className="h-40 w-40 bg-primary-200 blur-sm" />
                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                                    {influencer.isLoading ? (
                                        <Spinner className="h-8 w-8 fill-primary-500 text-white" />
                                    ) : (
                                        <>
                                            <LockClosedIcon className="h-8 w-8 fill-primary-500 group-hover:hidden" />
                                            <LockOpenIcon className="relative left-[4px] hidden h-8 w-8 fill-primary-500 group-hover:block" />
                                        </>
                                    )}
                                </div>
                            </button>
                        )}
                    </div>

                    {description ? (
                        <p className="flex max-w-[490px] flex-grow-0 gap-1 text-xs">
                            <Bars3BottomLeftIcon className="h-4 w-4 flex-shrink-0" /> {description}
                        </p>
                    ) : null}

                    {email ? (
                        <div className="flex items-center gap-1 text-primary-500">
                            <EnvelopeIcon className="h-4 w-4 flex-shrink-0" /> {email}
                        </div>
                    ) : null}
                </div>
            );
        },
    },
    // TODO: remove after settling on format
    // {
    //     id: 'email',
    //     header: ({ table }) => table.options.meta?.translation('boostbot.email'),
    //     cell: ({ row, table }) => {
    //         const influencer = row.original;

    //         const unlockInfluencer = () => {
    //             table.options.meta?.handleUnlockInfluencer(influencer.user_id);
    //         };

    //         const email =
    //             'contacts' in influencer &&
    //             influencer.contacts.find((contact) => contact.type === 'email')?.formatted_value.toLowerCase();

    //         return (
    //             <div>
    //                 {email ? (
    //                     <a
    //                         href={`mailto:${email}`}
    //                         target="_blank"
    //                         rel="noreferrer"
    //                         className="text-xs text-primary-500 hover:underline"
    //                     >
    //                         {email}
    //                     </a>
    //                 ) : influencer.isLoading ? (
    //                     <Spinner className="h-6 w-6 fill-primary-500 text-white" />
    //                 ) : (
    //                     <button
    //                         className="group ml-2 table-cell p-1 pl-0 hover:cursor-pointer"
    //                         onClick={unlockInfluencer}
    //                         aria-label={table.options.meta?.translation('boostbot.unlockInfluencer')}
    //                     >
    //                         <LockClosedIcon className="h-6 w-6 fill-primary-500 group-hover:hidden" />
    //                         <LockOpenIcon className="relative left-[3px] hidden h-6 w-6 fill-primary-500 group-hover:block" />
    //                     </button>
    //                 )}
    //             </div>
    //         );
    //     },
    // },
    {
        id: 'select',
        header: ({ table }) => (
            <label className="flex cursor-pointer gap-1">
                <input
                    type="checkbox"
                    className="checkbox mr-0"
                    checked={table.getIsAllPageRowsSelected()}
                    aria-label={table.options.meta?.translation('boostbot.selectAll')}
                    onChange={(e) => table.toggleAllPageRowsSelected(!!e.target.checked)}
                />
                {table.options.meta?.translation('boostbot.outreach')}
            </label>
        ),
        cell: ({ row, table }) => (
            <input
                type="checkbox"
                className="checkbox mr-0"
                checked={row.getIsSelected()}
                aria-label={table.options.meta?.translation('boostbot.selectRow')}
                onChange={(e) => row.toggleSelected(!!e.target.checked)}
            />
        ),
    },
];

import Link from 'next/link';
import type { ColumnDef } from '@tanstack/react-table';
import { LockClosedIcon, LockOpenIcon, UsersIcon } from '@heroicons/react/24/solid';
import type { Influencer } from 'pages/boostbot';
import { numberFormatter } from 'src/utils/formatter';
import { Instagram, Youtube, Tiktok, Spinner } from 'src/components/icons';
import { BoostbotRemoveKolCell } from './boostbot-remove-kol-cell';
import { BoostbotTopPostsCell } from './boostbot-top-post-cell';

export const columns: ColumnDef<Influencer>[] = [
    {
        id: 'account',
        header: ({ table }) => table.options.meta?.t('boostbot.table.account'),
        cell: ({ row, table }) => {
            const influencer = row.original;
            const { username, custom_name, fullname, url = '', picture, followers } = influencer;
            const handle = username || custom_name || fullname || '';
            const Icon = url.includes('youtube') ? Youtube : url.includes('tiktok') ? Tiktok : Instagram;

            return (
                <>
                    <Link href={url} target="_blank" rel="noopener noreferrer" className="group text-xs">
                        <div className="flex flex-col items-center gap-0.5">
                            <div className="relative mb-2 h-20 w-20 transition-all group-hover:scale-105">
                                <img className="h-full w-full rounded-full object-cover" src={picture} alt={handle} />
                                <Icon className="absolute -right-2 bottom-1 h-8 w-8" />
                            </div>
                            <div className="font-bold leading-4 text-gray-900">{fullname}</div>
                            <span className="text-primary-500 group-hover:underline">
                                {handle ? `@${handle}` : null}
                            </span>
                            <p
                                className="flex items-center gap-1 text-base text-gray-900"
                                title={table.options.meta?.t('boostbot.table.followers')}
                            >
                                <UsersIcon className="h-5 w-5 flex-shrink-0 fill-slate-700" />
                                {numberFormatter(followers) ?? '-'}
                            </p>
                        </div>
                    </Link>
                </>
            );
        },
    },
    {
        id: 'topPosts',
        header: ({ table }) => table.options.meta?.t('boostbot.table.topPosts'),
        cell: BoostbotTopPostsCell,
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
        cell: BoostbotRemoveKolCell,
    },
];

import Link from 'next/link';
import type { ColumnDef } from '@tanstack/react-table';
import { LockClosedIcon, LockOpenIcon, XMarkIcon } from '@heroicons/react/24/solid';
import type { Influencer } from 'pages/boostbot';
import { Spinner } from 'src/components/icons';
import { BoostbotAccountCell } from './boostbot-account-cell';
import { BoostbotTopPostsCell } from './boostbot-top-post-cell';

export const columns: ColumnDef<Influencer>[] = [
    {
        id: 'account',
        header: ({ table }) => table.options.meta?.t('boostbot.table.account'),
        cell: BoostbotAccountCell,
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

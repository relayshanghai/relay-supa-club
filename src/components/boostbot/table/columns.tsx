import type { ColumnDef } from '@tanstack/react-table';
import { LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/solid';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import type { Influencer } from 'pages/boostbot';
import { Spinner } from 'src/components/icons';
import { BoostbotAccountCell } from './boostbot-account-cell';
import { BoostbotTopPostsCell } from './boostbot-top-post-cell';
import { copyToClipboard } from 'src/utils/copyToClipboard';

export const columns: ColumnDef<Influencer>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <input
                type="checkbox"
                className="checkbox mr-0"
                checked={table.getIsAllPageRowsSelected()}
                aria-label={table.options.meta?.t('boostbot.table.selectAll')}
                onChange={(e) => table.toggleAllPageRowsSelected(!!e.target.checked)}
            />
        ),
        cell: ({ row, table }) => (
            <input
                type="checkbox"
                className="checkbox mr-0"
                checked={row.getIsSelected()}
                aria-label={table.options.meta?.t('boostbot.table.selectInfluencer')}
                onChange={(e) => row.toggleSelected(!!e.target.checked)}
            />
        ),
    },
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
                        <div
                            className="flex cursor-pointer items-center gap-1 break-all pr-1 text-xs text-primary-500 hover:text-primary-600"
                            onClick={() => copyToClipboard(email)}
                        >
                            <span className="min-w-[70px]">{email}</span>
                            <DocumentDuplicateIcon className="h-4 w-4 flex-shrink-0" />
                        </div>
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
];

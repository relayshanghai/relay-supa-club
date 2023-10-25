import type { ColumnDef } from '@tanstack/react-table';
import type { Influencer } from 'pages/boostbot';
import { BoostbotAccountCell } from './boostbot-account-cell';
import { BoostbotTopPostsCell } from './boostbot-top-post-cell';

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
];

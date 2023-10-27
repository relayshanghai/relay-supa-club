import type { ColumnDef } from '@tanstack/react-table';
import type { Influencer } from 'pages/boostbot';
import { BoostbotAccountCell } from './boostbot-account-cell';

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
        id: 'boostbotScore',
        header: ({ table }) => table.options.meta?.t('boostbot.table.score'),
        cell: 'score here',
    },
    {
        id: 'followers',
        header: ({ table }) => table.options.meta?.t('boostbot.table.followers'),
        cell: 'followers here',
    },
    {
        id: 'audienceDemo',
        header: ({ table }) => table.options.meta?.t('boostbot.table.audienceDemo'),
        cell: 'audience here',
    },
    {
        id: 'audienceGeolocations',
        header: ({ table }) => table.options.meta?.t('boostbot.table.audienceGeolocations'),
        cell: 'geolocations here',
    },
    {
        id: 'openDetail',
        header: '',
        cell: 'icon',
    },
];

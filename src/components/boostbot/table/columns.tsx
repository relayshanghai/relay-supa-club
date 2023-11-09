import type { ColumnDef } from '@tanstack/react-table';
import type { BoostbotInfluencer } from 'pages/api/boostbot/get-influencers';
import { BoostbotAccountCell } from './boostbot-account-cell';
import { BoostbotScoreCell } from './boostbot-score-cell';
import { OpenInfluencerModalCell } from './boostbot-icon-cell';
import { BoostbotFollowersCell } from './boostbot-followers-cell';
import { BoostbotAudienceDemoCell } from './boostbot-audience-demo-cell';
import { BoostbotAudienceLocationCell } from './boostbot-audience-location-cell';
import { clientLogger } from 'src/utils/logger-client';

export const columns: ColumnDef<BoostbotInfluencer>[] = [
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
        cell: BoostbotScoreCell,
    },
    {
        id: 'followers',
        header: ({ table }) => table.options.meta?.t('boostbot.table.followers'),
        cell: BoostbotFollowersCell,
    },
    {
        id: 'audienceDemo',
        header: ({ table }) => table.options.meta?.t('boostbot.table.audienceDemo'),
        cell: BoostbotAudienceDemoCell,
    },
    {
        id: 'audienceGeolocations',
        header: ({ table }) => table.options.meta?.t('boostbot.table.audienceGeolocations'),
        cell: BoostbotAudienceLocationCell,
    },
    {
        id: 'openDetail',
        header: '',
        cell: ({ row, table }) => {
            if (table.options.meta === undefined) {
                clientLogger('table meta is undefined');
                return;
            }
            return (
                <OpenInfluencerModalCell
                    row={row}
                    setSelectedRow={table.options.meta.setSelectedRow}
                    setIsInfluencerDetailsModalOpen={table.options.meta.setIsInfluencerDetailsModalOpen}
                />
            );
        },
    },
];

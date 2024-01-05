import type { ColumnDef } from '@tanstack/react-table';
import { BoostbotAccountCell } from './boostbot-account-cell';
import { BoostbotScoreCell } from './boostbot-score-cell';
import { OpenInfluencerModalCell } from './boostbot-icon-cell';
import { BoostbotFollowersCell } from './boostbot-followers-cell';
import { BoostbotAudienceGenderCell } from './boostbot-audience-gender-cell';
import { BoostbotAudienceLocationCell } from './boostbot-audience-location-cell';
import { clientLogger } from 'src/utils/logger-client';
import { Tooltip } from 'src/components/library';
import type { SearchTableInfluencer } from 'types';

export const columns: ColumnDef<SearchTableInfluencer>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <input
                type="checkbox"
                className="checkbox mr-0"
                checked={table.getIsAllPageRowsSelected()}
                aria-label={table.options.meta?.t('boostbot.table.selectAll')}
                disabled={table.options.meta?.isLoading}
                onChange={(e) => table.toggleAllPageRowsSelected(!!e.target.checked)}
            />
        ),
        cell: ({ row, table }) => {
            if (table.options.meta?.allSequenceInfluencers?.some((x) => x.iqdata_id === row.original.user_id)) {
                return (
                    <Tooltip
                        content={table.options.meta?.t('boostbot.table.alreadyAddedToSequence')}
                        position="right"
                        enabled={!table.options.meta?.isLoading}
                    >
                        <input
                            type="checkbox"
                            checked={false}
                            className={`${table.options.meta?.isLoading ? 'checkbox' : 'checkbox-add-success'} mr-0`}
                            disabled={true}
                        />
                    </Tooltip>
                );
            }
            return (
                <input
                    type="checkbox"
                    disabled={table.options.meta?.isLoading}
                    className="checkbox mr-0"
                    checked={row.getIsSelected()}
                    aria-label={table.options.meta?.t('boostbot.table.selectInfluencer')}
                    onChange={(e) => row.toggleSelected(!!e.target.checked)}
                />
            );
        },
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
        id: 'audienceGender',
        header: ({ table }) => table.options.meta?.t('boostbot.table.audienceGender'),
        cell: BoostbotAudienceGenderCell,
    },
    {
        id: 'audienceGeolocations',
        header: ({ table }) => table.options.meta?.t('boostbot.table.audienceGeolocations'),
        cell: BoostbotAudienceLocationCell,
    },
    {
        id: 'openDetail',
        header: () => <div className="min-w-[30px]" />,
        cell: ({ row, table }) => {
            if (table.options.meta === undefined) {
                clientLogger('table meta is undefined');
                return;
            }
            return (
                <OpenInfluencerModalCell
                    row={row}
                    table={table}
                    setSelectedRow={table.options.meta.setSelectedRow}
                    setIsInfluencerDetailsModalOpen={table.options.meta.setIsInfluencerDetailsModalOpen}
                />
            );
        },
    },
];

export const classicColumns: ColumnDef<SearchTableInfluencer>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <input
                type="checkbox"
                className="checkbox mr-0"
                checked={table.getIsAllPageRowsSelected()}
                aria-label={table.options.meta?.t('boostbot.table.selectAll')}
                disabled={table.options.meta?.isLoading}
                onChange={(e) => {
                    table.toggleAllPageRowsSelected(!!e.target.checked);
                }}
            />
        ),
        cell: ({ row, table }) => {
            if (table.options.meta?.allSequenceInfluencers?.some((x) => x.iqdata_id === row.original.user_id)) {
                return (
                    <Tooltip
                        content={table.options.meta?.t('boostbot.table.alreadyAddedToSequence')}
                        position="right"
                        enabled={!table.options.meta?.isLoading}
                    >
                        <input
                            type="checkbox"
                            checked={false}
                            className={`${table.options.meta?.isLoading ? 'checkbox' : 'checkbox-add-success'} mr-0`}
                            disabled={true}
                        />
                    </Tooltip>
                );
            }
            return (
                <input
                    type="checkbox"
                    disabled={table.options.meta?.isLoading}
                    className="checkbox mr-0"
                    checked={row.getIsSelected()}
                    aria-label={table.options.meta?.t('boostbot.table.selectInfluencer')}
                    onChange={(e) => row.toggleSelected(!!e.target.checked)}
                />
            );
        },
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
        id: 'audienceGender',
        header: ({ table }) => table.options.meta?.t('boostbot.table.audienceGender'),
        cell: BoostbotAudienceGenderCell,
    },
    {
        id: 'audienceGeolocations',
        header: ({ table }) => table.options.meta?.t('boostbot.table.audienceGeolocations'),
        cell: BoostbotAudienceLocationCell,
    },
    {
        id: 'openDetail',
        header: () => <div className="min-w-[30px]" />,
        cell: ({ row, table }) => {
            if (table.options.meta === undefined) {
                clientLogger('table meta is undefined');
                return;
            }
            return (
                <OpenInfluencerModalCell
                    row={row}
                    table={table}
                    setSelectedRow={table.options.meta.setSelectedRow}
                    setIsInfluencerDetailsModalOpen={table.options.meta.setIsInfluencerDetailsModalOpen}
                />
            );
        },
    },
];

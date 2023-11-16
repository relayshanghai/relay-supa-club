import type { BoostbotInfluencer } from 'pages/api/boostbot/get-influencers';
import type { Row, Table } from '@tanstack/react-table';
import { numberFormatter } from 'src/utils/formatter';

export type BoostbotFollowersProps = {
    row: Row<BoostbotInfluencer>;
    table: Table<BoostbotInfluencer>;
};

export const BoostbotFollowersCell = ({ row, table }: BoostbotFollowersProps) => {
    const isLoading = table.options.meta?.isLoading;
    return (
        <>
            {isLoading ? (
                <div className="h-4 w-12 animate-pulse bg-gray-300" />
            ) : (
                <div className="text-xs font-medium text-gray-600">{numberFormatter(row.original.followers, 1)}</div>
            )}
        </>
    );
};

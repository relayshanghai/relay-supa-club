import type { BoostbotInfluencer } from 'pages/api/boostbot/get-influencers';
import type { Row } from '@tanstack/react-table';
import { numberFormatter } from 'src/utils/formatter';

export type BoostbotAccountCellProps = {
    row: Row<BoostbotInfluencer>;
};

export const BoostbotFollowersCell = ({ row }: BoostbotAccountCellProps) => {
    return <div>{numberFormatter(row.original.followers, 1)}</div>;
};

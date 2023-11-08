import type { BoostbotInfluencer } from 'pages/api/boostbot/get-influencers';
import type { Row } from '@tanstack/react-table';
import { numberFormatter } from 'src/utils/formatter';

export type BoostbotFollowersProps = {
    row: Row<BoostbotInfluencer>;
};

export const BoostbotFollowersCell = ({ row }: BoostbotFollowersProps) => {
    return <div className="text-xs font-medium text-gray-600">{numberFormatter(row.original.followers, 1)}</div>;
};

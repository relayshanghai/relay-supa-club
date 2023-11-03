import { ReportOutline } from 'src/components/icons';
import type { BoostbotInfluencer } from 'pages/api/boostbot/get-influencers';
import type { Row } from '@tanstack/react-table';

export type BoostbotAccountCellProps = {
    row: Row<BoostbotInfluencer>;
    setIsInfluencerDetailsModalOpen: (open: boolean) => void;
    setSelectedRow: (row: Row<BoostbotInfluencer>) => void;
};

export const OpenInfluencerModalCell = ({
    row,
    setIsInfluencerDetailsModalOpen,
    setSelectedRow,
}: BoostbotAccountCellProps) => {
    const handleIconClick = () => {
        //eslint-disable-next-line
        console.log(row);
        setIsInfluencerDetailsModalOpen(true);
        setSelectedRow(row);
    };

    return (
        <div className="cursor-pointer">
            <ReportOutline className="stroke-gray-400 stroke-2" onClick={handleIconClick} />
        </div>
    );
};

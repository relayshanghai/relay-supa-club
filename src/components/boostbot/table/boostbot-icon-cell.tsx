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
        setIsInfluencerDetailsModalOpen(true);
        setSelectedRow(row);
    };

    return (
        <div className="cursor-pointer">
            <ReportOutline
                data-testid="boostbot-open-modal-icon"
                className="stroke-gray-400 stroke-2"
                onClick={handleIconClick}
            />
        </div>
    );
};

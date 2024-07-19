import { ReportOutline } from 'src/components/icons';
import type { SearchTableInfluencer as BoostbotInfluencer } from 'types';
import type { Row, Table } from '@tanstack/react-table';
import type { CreatorPlatform } from 'types';
import { OpenInfluencerCard } from 'src/utils/analytics/events';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';

export type BoostbotAccountCellProps = {
    row: Row<BoostbotInfluencer>;
    table: Table<BoostbotInfluencer>;
    setIsInfluencerDetailsModalOpen: (open: boolean) => void;
    setSelectedRow: (row: Row<BoostbotInfluencer>) => void;
};

export const OpenInfluencerModalCell = ({
    row,
    table,
    setIsInfluencerDetailsModalOpen,
    setSelectedRow,
}: BoostbotAccountCellProps) => {
    const platform: CreatorPlatform = row.original.url.includes('youtube')
        ? 'youtube'
        : row.original.url.includes('tiktok')
        ? 'tiktok'
        : 'instagram';

    const { track } = useRudderstackTrack();

    const handleIconClick = () => {
        setIsInfluencerDetailsModalOpen(true);
        setSelectedRow(row);

        track(OpenInfluencerCard, {
            influencer_id: row.original.user_id,
            platform: platform,
            index_position: row.index,
        });
    };

    if (table.options.meta?.isLoading) return <></>;

    return (
        <div className="cursor-pointer" id="boostbot-creator-mini-report">
            <ReportOutline
                data-testid={`open-influencer-modal/${row.original.user_id}`}
                className="stroke-gray-400 stroke-2"
                onClick={handleIconClick}
            />
        </div>
    );
};

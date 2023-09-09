import { XMarkIcon } from '@heroicons/react/24/solid';
import type { Row, Table } from '@tanstack/react-table';
import type { Influencer } from 'pages/boostbot';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { RemoveBoostbotKol } from 'src/utils/analytics/events';
import { CurrentPageEvent } from 'src/utils/analytics/events/current-pages';

type BoostbotRemoveKolCellProps = {
    row: Row<Influencer>;
    table: Table<Influencer>;
};

export const BoostbotRemoveKolCell = ({ row, table }: BoostbotRemoveKolCellProps) => {
    const { track } = useRudderstackTrack();

    const removeInfluencer = () => {
        table.options.meta?.removeInfluencer(row.original.user_id);
    };

    return (
        <button
            className="flex h-6 w-6"
            onClick={() => {
                removeInfluencer();
                track(RemoveBoostbotKol, {
                    currentPage: CurrentPageEvent.boostbot,
                });
            }}
            aria-label={table.options.meta?.t('boostbot.table.removeInfluencer')}
        >
            <XMarkIcon className="h-full w-full flex-shrink-0 fill-red-300 transition-all hover:scale-105 hover:fill-red-400" />
        </button>
    );
};

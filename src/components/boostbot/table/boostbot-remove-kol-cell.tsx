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
    const influencer = row.original;
    const { track } = useRudderstackTrack();
    // @note get platform from url for now
    //       `influencer` was supposed to be `UserAccount` type which contains `type` for platform but it's not there on runtime
    const platform = influencer.url.includes('youtube')
        ? 'youtube'
        : influencer.url.includes('tiktok')
        ? 'tiktok'
        : 'instagram';

    const removeInfluencer = () => {
        if (!table.options.meta) {
            throw new Error('KOL Remove event handler is required');
        }

        table.options.meta.removeInfluencer(row.original.user_id);
    };

    return (
        <button
            className="flex h-6 w-6"
            onClick={() => {
                removeInfluencer();
                track(RemoveBoostbotKol, {
                    currentPage: CurrentPageEvent.boostbot,
                    kol_id: influencer.user_id,
                    platform,
                    search_id: table.options.meta?.searchId ?? null,
                });
            }}
            aria-label={table.options.meta?.t('boostbot.table.removeInfluencer')}
        >
            <XMarkIcon className="h-full w-full flex-shrink-0 fill-red-300 transition-all hover:scale-105 hover:fill-red-400" />
        </button>
    );
};

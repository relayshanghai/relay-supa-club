import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import type { Table } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { Button } from 'src/components/button';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { ChangePage } from 'src/utils/analytics/events';
import { CurrentPageEvent } from 'src/utils/analytics/events/current-pages';
import PageLink from './pagelink';
import { getPaginationItems } from './helper';
import type { BoostbotInfluencer } from 'pages/api/boostbot/get-influencers';

interface DataTablePaginationProps<TData> {
    table: Table<TData>;
}

export function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
    const { t } = useTranslation();
    const { track } = useRudderstackTrack();
    table.options.meta?.setSelectedCount(
        table
            .getFilteredSelectedRowModel()
            .rows.filter(
                (row) =>
                    !table.options.meta?.allSequenceInfluencers?.some(
                        (influencer) => influencer.iqdata_id === (row.original as BoostbotInfluencer).user_id,
                    ),
            ).length,
    );

    //adjust to control the number of links in the pagination section
    const noOfLinks = 11;
    const pageNums = getPaginationItems(table.getState().pagination.pageIndex + 1, table.getPageCount(), noOfLinks);

    return (
        <div className="flex w-full justify-between px-0">
            <div>
                <Button
                    variant="neutral"
                    className="flex h-8 w-32 items-center justify-center !py-0 px-2 text-sm font-medium text-primary-500 disabled:text-gray-400"
                    onClick={() => {
                        table.previousPage();
                        track(ChangePage, {
                            currentPage: CurrentPageEvent.boostbot,
                            from_page: table.getState().pagination.pageIndex + 1,
                            to_page: table.getCanPreviousPage() ? table.getState().pagination.pageIndex : null,
                            search_id: table.options.meta?.searchId ?? null,
                        });
                    }}
                    disabled={!table.getCanPreviousPage()}
                >
                    <ArrowLeftIcon
                        className={`mr-2 h-4 w-4 ${table.getCanPreviousPage() ? 'fill-primary-500' : 'fill-gray-400'}`}
                    />
                    {t('manager.previous')}
                </Button>
            </div>
            <div className="flex w-[300px] flex-row ">
                {pageNums.map((pageNum, idx) => (
                    <PageLink
                        className="mx-2 flex items-center text-sm text-primary-600"
                        key={idx}
                        active={table.getState().pagination.pageIndex + 1 === pageNum}
                        disabled={isNaN(pageNum)}
                        onClick={() => table.setPageIndex(pageNum - 1)}
                    >
                        {!isNaN(pageNum) ? pageNum : '...'}
                    </PageLink>
                ))}
            </div>

            <div className="flex items-center ">
                <Button
                    variant="neutral"
                    className="flex h-8 w-32 items-center justify-center border-transparent !py-0 px-2 text-sm font-medium text-primary-500 disabled:text-gray-400"
                    onClick={() => {
                        table.nextPage();
                        track(ChangePage, {
                            currentPage: CurrentPageEvent.boostbot,
                            from_page: table.getState().pagination.pageIndex + 1,
                            to_page: table.getCanNextPage() ? table.getState().pagination.pageIndex + 1 : null,
                            search_id: table.options.meta?.searchId ?? null,
                        });
                    }}
                    disabled={!table.getCanNextPage()}
                >
                    {t('manager.next')}
                    <ArrowRightIcon
                        className={`ml-2 h-4 w-4 ${table.getCanNextPage() ? 'fill-primary-500' : 'fill-gray-400'}`}
                    />
                </Button>
            </div>
        </div>
    );
}

import {
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronDoubleLeftIcon,
    ChevronDoubleRightIcon,
} from '@heroicons/react/24/solid';
import type { Table } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { Button } from 'src/components/button';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { ChangePage } from 'src/utils/analytics/events';
import { CurrentPageEvent } from 'src/utils/analytics/events/current-pages';

interface DataTablePaginationProps<TData> {
    table: Table<TData>;
}

export function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
    const { t } = useTranslation();
    const { track } = useRudderstackTrack();

    return (
        <div className="flex items-center justify-end">
            <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                    {t('boostbot.table.pagination', {
                        current: table.getState().pagination.pageIndex + 1,
                        total: table.getPageCount(),
                    })}
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="primary"
                        className="hidden h-8 w-8 items-center justify-center !px-0 !py-0 lg:flex"
                        onClick={() => {
                            table.setPageIndex(0);
                            track(ChangePage, {
                                currentPage: CurrentPageEvent.boostbot,
                                from_page: table.getState().pagination.pageIndex + 1,
                                to_page: table.getCanPreviousPage() ? 1 : null,
                                search_id: table.options.meta?.searchId ?? null,
                            });
                        }}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">Go to first page</span>
                        <ChevronDoubleLeftIcon className="h-4 w-4 fill-white" />
                    </Button>
                    <Button
                        variant="primary"
                        className="flex h-8 w-8 items-center justify-center !px-0 !py-0"
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
                        <span className="sr-only">Go to previous page</span>
                        <ChevronLeftIcon className="h-4 w-4 fill-white" />
                    </Button>
                    <Button
                        variant="primary"
                        className="flex h-8 w-8 items-center justify-center !px-0 !py-0"
                        onClick={() => {
                            table.nextPage();
                            track(ChangePage, {
                                currentPage: CurrentPageEvent.boostbot,
                                from_page: table.getState().pagination.pageIndex + 1,
                                to_page: table.getCanNextPage() ? table.getState().pagination.pageIndex + 2 : null,
                                search_id: table.options.meta?.searchId ?? null,
                            });
                        }}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">Go to next page</span>
                        <ChevronRightIcon className="h-4 w-4 fill-white" />
                    </Button>
                    <Button
                        variant="primary"
                        className="hidden h-8 w-8 items-center justify-center !px-0 !py-0 lg:flex"
                        onClick={() => {
                            table.setPageIndex(table.getPageCount() - 1);
                            track(ChangePage, {
                                currentPage: CurrentPageEvent.boostbot,
                                from_page: table.getState().pagination.pageIndex + 1,
                                to_page: table.getCanNextPage() ? table.getPageCount() : null,
                                search_id: table.options.meta?.searchId ?? null,
                            });
                        }}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">Go to last page</span>
                        <ChevronDoubleRightIcon className="h-4 w-4 fill-white" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

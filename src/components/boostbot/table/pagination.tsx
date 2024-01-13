import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import type { Table } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { Button } from 'src/components/button';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { ChangePage } from 'src/utils/analytics/events';
import { CurrentPageEvent } from 'src/utils/analytics/events/current-pages';
import PageLink from './pagelink';
import { getPaginationItems } from './helper';
import { useCallback } from 'react';
import { useSearch } from 'src/hooks/use-search';

interface DataTablePaginationProps<TData> {
    table: Table<TData>;
    count?: number;
    currentPage?: number;
}

export function DataTablePagination<TData>({ table, count, currentPage }: DataTablePaginationProps<TData>) {
    const { t } = useTranslation();
    const { track } = useRudderstackTrack();
    const { setPage } = useSearch();
    const isSearchPage = currentPage !== undefined && count !== undefined && setPage !== undefined;

    //adjust to control the number of links in the pagination section
    const maxPages = Math.floor(count ?? 0 / 10);
    const pageNums = getPaginationItems(
        isSearchPage ? currentPage + 1 : table.getState().pagination.pageIndex + 1,
        isSearchPage ? (maxPages > 1000 ? 1000 : maxPages) : table.getPageCount(),
        11,
    );

    const handlePreviousPage = useCallback(() => {
        if (isSearchPage) {
            setPage(currentPage - 1);
            return;
        }
        table.previousPage();
    }, [setPage, currentPage, table, isSearchPage]);

    const handleNextPage = useCallback(() => {
        if (isSearchPage) {
            setPage(currentPage + 1);
            return;
        }
        table.nextPage();
    }, [setPage, currentPage, table, isSearchPage]);

    const handleSetPage = useCallback(
        (pageNum: number) => {
            if (isSearchPage) {
                setPage(pageNum);
                return;
            }
            table.setPageIndex(pageNum);
        },
        [setPage, table, isSearchPage],
    );

    return (
        <div className="flex w-full justify-between px-0">
            <div>
                <Button
                    variant="neutral"
                    className="flex h-8 w-32 items-center justify-center !py-0 px-2 text-sm font-medium text-primary-500 disabled:text-gray-400"
                    onClick={() => {
                        handlePreviousPage();
                        track(ChangePage, {
                            currentPage: CurrentPageEvent.boostbot,
                            from_page: table.getState().pagination.pageIndex + 1,
                            to_page: table.getCanPreviousPage() ? table.getState().pagination.pageIndex : null,
                            search_id: table.options.meta?.searchId ?? null,
                        });
                    }}
                    disabled={isSearchPage ? currentPage <= 0 : !table.getCanPreviousPage()}
                >
                    <ArrowLeftIcon
                        className={`mr-2 h-4 w-4 ${
                            isSearchPage
                                ? currentPage + 1 >= 0
                                : table.getCanNextPage()
                                ? 'fill-primary-500'
                                : 'fill-gray-400'
                        }`}
                    />
                    {t('manager.previous')}
                </Button>
            </div>
            <div className="flex w-[300px] flex-row ">
                {pageNums.map((pageNum, idx) => (
                    <PageLink
                        className="mx-2 flex items-center text-sm text-primary-600"
                        key={idx}
                        active={
                            isSearchPage
                                ? currentPage + 1 === pageNum
                                : table.getState().pagination.pageIndex + 1 === pageNum
                        }
                        disabled={isNaN(pageNum) || pageNum === 0}
                        onClick={() => handleSetPage(pageNum - 1)}
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
                        handleNextPage();
                        track(ChangePage, {
                            currentPage: CurrentPageEvent.boostbot,
                            from_page: table.getState().pagination.pageIndex + 1,
                            to_page: table.getCanNextPage() ? table.getState().pagination.pageIndex + 1 : null,
                            search_id: table.options.meta?.searchId ?? null,
                        });
                    }}
                    disabled={isSearchPage ? currentPage + 1 === Math.floor(count / 10) : !table.getCanNextPage()}
                >
                    {t('manager.next')}
                    <ArrowRightIcon
                        className={`ml-2 h-4 w-4 ${
                            isSearchPage
                                ? currentPage + 1 !== Math.floor(count / 10)
                                : table.getCanNextPage()
                                ? 'fill-primary-500'
                                : 'fill-gray-400'
                        }`}
                    />
                </Button>
            </div>
        </div>
    );
}

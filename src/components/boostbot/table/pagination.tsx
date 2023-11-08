import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import type { Table } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { Button } from 'src/components/button';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { ChangePage } from 'src/utils/analytics/events';
import { CurrentPageEvent } from 'src/utils/analytics/events/current-pages';
import PageLink from './pagelink';

export function getPaginationItems(currentPage: number, lastPage: number, maxLength: number) {
    const res: Array<number> = [];

    // handle lastPage less than maxLength
    if (lastPage <= maxLength) {
        for (let i = 1; i <= lastPage; i++) {
            res.push(i);
        }
    }

    // handle ellipsis logics
    else {
        const firstPage = 1;
        const confirmedPagesCount = 3;
        const deductedMaxLength = maxLength - confirmedPagesCount;
        const sideLength = deductedMaxLength / 2;

        // handle ellipsis in the middle
        if (currentPage - firstPage < sideLength || lastPage - currentPage < sideLength) {
            for (let j = 1; j <= sideLength + firstPage; j++) {
                res.push(j);
            }

            res.push(NaN);

            for (let k = lastPage - sideLength; k <= lastPage; k++) {
                res.push(k);
            }
        }

        // handle two ellipsis
        else if (currentPage - firstPage >= deductedMaxLength && lastPage - currentPage >= deductedMaxLength) {
            const deductedSideLength = sideLength - 1;

            res.push(1);
            res.push(NaN);

            for (let l = currentPage - deductedSideLength; l <= currentPage + deductedSideLength; l++) {
                res.push(l);
            }

            res.push(NaN);
            res.push(lastPage);
        }

        // handle ellipsis not in the middle
        else {
            const isNearFirstPage = currentPage - firstPage < lastPage - currentPage;
            let remainingLength = maxLength;

            if (isNearFirstPage) {
                for (let m = 1; m <= currentPage + 1; m++) {
                    res.push(m);
                    remainingLength -= 1;
                }

                res.push(NaN);
                remainingLength -= 1;

                for (let n = lastPage - (remainingLength - 1); n <= lastPage; n++) {
                    res.push(n);
                }
            } else {
                for (let o = lastPage; o >= currentPage - 1; o--) {
                    res.unshift(o);
                    remainingLength -= 1;
                }

                res.unshift(NaN);
                remainingLength -= 1;

                for (let p = remainingLength; p >= 1; p--) {
                    res.unshift(p);
                }
            }
        }
    }

    return res;
}
interface DataTablePaginationProps<TData> {
    table: Table<TData>;
}

export function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
    const { t } = useTranslation();
    const { track } = useRudderstackTrack();

    const pageNums = getPaginationItems(table.getState().pagination.pageIndex + 1, table.getPageCount(), 11);

    return (
        <div className="flex w-full justify-between px-0">
            {/* <div className="text-muted-foreground ml-2 flex-1 text-sm">
                  {t('boostbot.table.selectedAmount', {
                      selectedCount: table.getFilteredSelectedRowModel().rows.length,
                      total: table.getFilteredRowModel().rows.length,
                  })}
              </div> */}
            <div>
                <Button
                    variant="neutral"
                    className="flex h-8 w-32 items-center justify-center !px-0 !py-0 px-2 text-sm font-medium text-primary-500"
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
                    <ArrowLeftIcon className="mr-2 h-4 w-4 fill-primary-500" />
                    {t('manager.previous')}
                </Button>
            </div>
            <div className="flex w-[300px] flex-row ">
                {pageNums.map((pageNum, idx) => (
                    <PageLink
                        className="mx-2 flex items-center text-sm font-medium text-primary-500"
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
                    className="flex h-8 w-32 items-center justify-center border-transparent !px-0 !py-0 px-2 text-sm font-medium text-primary-500"
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
                    <ArrowRightIcon className="ml-2 h-4 w-4 fill-primary-500" />
                </Button>
            </div>
        </div>
    );
}

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import type { Table } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { Button } from 'src/components/button';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { ChangePage } from 'src/utils/analytics/events';
import { CurrentPageEvent } from 'src/utils/analytics/events/current-pages';
import PageLink from './pagelink';

function getPaginationItems(
    currentPageIndex: number,
    lastPageIndex: number,
    noOfPageLinks: number,
  ) {
    const pages = [];
    const divisionPerPageLink = 3;
    const deductednoOfPageLinks = noOfPageLinks - divisionPerPageLink;
    const innerNumberCount = deductednoOfPageLinks / 2;
  
    const isLinkVisible = (
      currentPageIndex: number,
      rangeDelimiter: number,
      rangeLinkLimit: number,
    ) => {
      return currentPageIndex - rangeDelimiter < rangeLinkLimit;
    };
    const isLinkDisabled = (
      currentPageIndex: number,
      rangeDelimiter: number,
      rangeLinkLimit: number,
    ) => {
      return currentPageIndex - rangeDelimiter >= rangeLinkLimit;
    };

    const isPageCountWithinRange=()=>{
        return (lastPageIndex <= noOfPageLinks)
    }

    if (isPageCountWithinRange()) {
      for (let i = 1; i <= lastPageIndex; i++) {
        pages.push(i);
      }
    } else if (
      isLinkVisible(currentPageIndex, 1, innerNumberCount) ||
      isLinkVisible(lastPageIndex, currentPageIndex, innerNumberCount)
    ) {
      Array.from({ length: innerNumberCount + 1 }, (_, j) => {
        pages.push(j + 1);
      });
      pages.push(NaN);
      Array.from({ length: innerNumberCount + 1 }, (_, index) => {
        pages.push(lastPageIndex - innerNumberCount + index);
      });
  
    } else if (
      isLinkDisabled(currentPageIndex, 1, deductednoOfPageLinks) &&
      isLinkDisabled(lastPageIndex, currentPageIndex, deductednoOfPageLinks)
    ) {
      const deductedinnerNumberCount = innerNumberCount - 1;
      pages.push(1, NaN);
      Array.from({ length: deductedinnerNumberCount * 2 + 1 }, (_, index) => {
        pages.push(currentPageIndex - deductedinnerNumberCount + index);
      });
      pages.push(NaN, lastPageIndex);
    } else {
      const isNearStart = currentPageIndex - 1 < lastPageIndex - currentPageIndex;
      let remainingLength = noOfPageLinks;
  
      if (isNearStart) {
        Array.from({ length: currentPageIndex + 2 }, (_, index) => {
          pages.push(index + 1);
          remainingLength -= 1;
        });
  
        pages.push(NaN);
        remainingLength -= 1;
  
        Array.from(
          {
            length:
              lastPageIndex -
              (remainingLength - 1) -
              (lastPageIndex - currentPageIndex) +
              1,
          },
          (_, index) => {
            const page = lastPageIndex - (remainingLength - 1) + index;
            pages.push(page);
          },
        );
      } else {
        for (let o = lastPageIndex; o >= currentPageIndex - 1; o--) {
          pages.unshift(o);
          remainingLength -= 1;
        }
        pages.unshift(NaN);
        remainingLength -= 1;
        for (let p = remainingLength; p >= 1; p--) {
          pages.unshift(p);
        }
      }
    }
  
    return pages;
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

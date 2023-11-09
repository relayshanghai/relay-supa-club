import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import type { Table } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { Button } from 'src/components/button';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { ChangePage } from 'src/utils/analytics/events';
import { CurrentPageEvent } from 'src/utils/analytics/events/current-pages';
import PageLink from './pagelink';

function getPaginationItems(currentPage:number, lastPage:number, maxLength:number) {
  const res = [];
  const firstPage = 1;
  const confirmedPagesCount = 3;
  const deductedMaxLength = maxLength - confirmedPagesCount;
  const sideLength = deductedMaxLength / 2;

  const addPagesInRange = (start:number, end:number) => {
    for (let i = start; i <= end; i++) {
        res.push(i);
    }
};
  if (lastPage <= maxLength) {
      addPagesInRange(1, lastPage);
  } 
  else if (currentPage - firstPage < sideLength || lastPage - currentPage < sideLength) {
      addPagesInRange(1, sideLength + firstPage);
      res.push(NaN);
      addPagesInRange(lastPage - sideLength, lastPage);
  } else if (currentPage - firstPage >= deductedMaxLength && lastPage - currentPage >= deductedMaxLength) {
      const deductedSideLength = sideLength - 1;
      res.push(1, NaN);
      addPagesInRange(currentPage - deductedSideLength, currentPage + deductedSideLength);
      res.push(NaN, lastPage);
  } else {
      const isNearFirstPage = currentPage - firstPage < lastPage - currentPage;
      let remainingLength = maxLength;

      const addPagesCount = (start:number, count:number,isEnd:boolean) => {
        for (let i = start; i <= count; i++) {
            res.push(i);
            if(!isEnd){
              remainingLength -= 1;
            }
       
        }
    };
    
    const addPagesCountReverse = (start:number, end:number,isEnd:boolean) => {
      for (let p = end; p >= start; p--) {
          res.unshift(p);
          if(!isEnd){
            remainingLength -= 1;
          }
      }
  };
      if (isNearFirstPage) {
          addPagesCount(1,(currentPage + 1),false);
          res.push(NaN);
          remainingLength -= 1;
          addPagesInRange(lastPage - (remainingLength - 1), lastPage,true);
      } else {
          addPagesCountReverse(lastPage,currentPage-1,false)
          res.unshift(NaN);
          remainingLength -= 1;
          addPagesCountReverse(remainingLength,1,true)
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

import {
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronDoubleLeftIcon,
    ChevronDoubleRightIcon,
} from '@heroicons/react/24/solid';
import type { Table } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { Button } from 'src/components/button';

interface DataTablePaginationProps<TData> {
    table: Table<TData>;
}

export function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
    const { t } = useTranslation();

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
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">Go to first page</span>
                        <ChevronDoubleLeftIcon className="h-4 w-4 fill-white" />
                    </Button>
                    <Button
                        variant="primary"
                        className="flex h-8 w-8 items-center justify-center !px-0 !py-0"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">Go to previous page</span>
                        <ChevronLeftIcon className="h-4 w-4 fill-white" />
                    </Button>
                    <Button
                        variant="primary"
                        className="flex h-8 w-8 items-center justify-center !px-0 !py-0"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">Go to next page</span>
                        <ChevronRightIcon className="h-4 w-4 fill-white" />
                    </Button>
                    <Button
                        variant="primary"
                        className="hidden h-8 w-8 items-center justify-center !px-0 !py-0 lg:flex"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
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

import { useEffect, useRef, type Dispatch, type SetStateAction } from 'react';
import type { TFunction } from 'i18next';
import type { ColumnDef, RowData, TableMeta } from '@tanstack/react-table';
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'src/components/library';
import { DataTablePagination } from './pagination';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    setCurrentPageInfluencers: Dispatch<SetStateAction<TData[]>>;
    meta: TableMeta<TData>;
}

declare module '@tanstack/react-table' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface TableMeta<TData extends RowData> {
        handleUnlockInfluencer: (userId: string) => void;
        removeInfluencer: (userId: string) => void;
        t: TFunction<'translation', undefined, 'translation'>;
    }
}

export function InfluencersTable<TData, TValue>({
    data,
    columns,
    setCurrentPageInfluencers,
    meta,
}: DataTableProps<TData, TValue>) {
    const tableRef = useRef<null | HTMLDivElement>(null);
    const table = useReactTable({
        data,
        columns,
        meta,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        autoResetPageIndex: false,
    });
    const page = table.getState().pagination.pageIndex;

    // Handle current table page state. Allows us to send the current page of influencers outreach/generate report.
    useEffect(() => {
        tableRef.current?.scrollIntoView(true);

        const currentPageInfluencers = table.getRowModel().rows?.map((row) => row.original) ?? [];
        setCurrentPageInfluencers(currentPageInfluencers);
    }, [page, table, setCurrentPageInfluencers, data]);

    // Handle table pagination reset when for example new influencers are loaded. But not when individual ones are unlocked/removed.
    useEffect(() => {
        const setFirstPage = () => table.setPageIndex(0);
        document.addEventListener('influencerTableSetFirstPage', setFirstPage);

        return () => document.removeEventListener('influencerTableSetFirstPage', setFirstPage);
    }, [table]);

    return (
        <div className="relative h-full w-full overflow-scroll">
            <div className="h-full w-full overflow-scroll rounded-md border pb-10">
                {/* Scroll to the top of the table when changing pagination pages */}
                <div ref={tableRef} />

                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead className="text-center" key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    {meta.t('boostbot.table.noResults')}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                <div className="absolute bottom-0 left-0 right-0 w-full border bg-white p-2">
                    <DataTablePagination table={table} />
                </div>
            </div>
        </div>
    );
}

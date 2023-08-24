import { useEffect, useRef } from 'react';
import type { TFunction } from 'i18next';
import type { ColumnDef, OnChangeFn, RowData, RowSelectionState, TableMeta } from '@tanstack/react-table';
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'src/components/library';
import { DataTablePagination } from './pagination';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    selectedInfluencers: RowSelectionState;
    setSelectedInfluencers: OnChangeFn<RowSelectionState>;
    meta: TableMeta<TData>;
}

declare module '@tanstack/react-table' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface TableMeta<TData extends RowData> {
        handleUnlockInfluencer: (userId: string) => void;
        removeInfluencer: (userId: string) => void;
        translation: TFunction<'translation', undefined, 'translation'>;
    }
}

export function InfluencersTable<TData, TValue>({
    data,
    columns,
    selectedInfluencers,
    setSelectedInfluencers,
    meta,
}: DataTableProps<TData, TValue>) {
    const tableRef = useRef<null | HTMLDivElement>(null);
    const table = useReactTable({
        data,
        columns,
        meta,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onRowSelectionChange: setSelectedInfluencers,
        state: { rowSelection: selectedInfluencers },
    });

    const page = table.getState().pagination.pageIndex;
    useEffect(() => {
        tableRef.current?.scrollIntoView(true);
    }, [page]);

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
                                        <TableHead key={header.id}>
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
                                    {meta.translation('boostbot.noResults')}
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

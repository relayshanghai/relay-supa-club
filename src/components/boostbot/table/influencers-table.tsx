import { useEffect, useRef } from 'react';
import type { TFunction } from 'i18next';
import type { ColumnDef, RowData, TableMeta, OnChangeFn, RowSelectionState } from '@tanstack/react-table';
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'src/components/library';
import { DataTablePagination } from './pagination';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    selectedInfluencers: RowSelectionState;
    setSelectedInfluencers: OnChangeFn<RowSelectionState>;
    meta: TableMeta<TData>;
    setIsInfluencerDetailsModalOpen: (open: boolean) => void;
}

declare module '@tanstack/react-table' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface TableMeta<TData extends RowData> {
        t: TFunction<'translation', undefined, 'translation'>;
        searchId: string | number | null;
    }
}

export function InfluencersTable<TData, TValue>({
    data,
    columns,
    selectedInfluencers,
    setSelectedInfluencers,
    meta,
    setIsInfluencerDetailsModalOpen,
}: DataTableProps<TData, TValue>) {
    const tableRef = useRef<null | HTMLDivElement>(null);
    const table = useReactTable({
        data,
        columns,
        meta,
        onRowSelectionChange: setSelectedInfluencers,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        autoResetPageIndex: false,
        state: { rowSelection: selectedInfluencers },
    });
    const page = table.getState().pagination.pageIndex;

    // Handle table pagination reset when for example new influencers are loaded. But not when individual influencers are removed.
    useEffect(() => {
        const setFirstPage = () => {
            table.setPageIndex(0);
            table.toggleAllRowsSelected(false);
            setTimeout(() => {
                // The timeout is here to make sure page is set to 0 before selecting all page rows.
                table.toggleAllPageRowsSelected(true);
            }, 0);
        };

        setFirstPage();
        document.addEventListener('influencerTableLoadInfluencers', setFirstPage);

        return () => document.removeEventListener('influencerTableLoadInfluencers', setFirstPage);
    }, [table]);

    useEffect(() => {
        tableRef.current?.scrollIntoView(true);
    }, [page]);

    return (
        <div className="relative h-full w-full flex-shrink-0 overflow-scroll md:flex-shrink">
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
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                    className="cursor-pointer"
                                    onClick={() => setIsInfluencerDetailsModalOpen(true)}
                                >
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

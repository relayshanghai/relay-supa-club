import { useEffect, useRef } from 'react';
import { t, type TFunction } from 'i18next';
import type { ColumnDef, RowData, TableMeta, OnChangeFn, RowSelectionState, Row } from '@tanstack/react-table';
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Tooltip } from 'src/components/library';
import { DataTablePagination } from './pagination';
import type { SearchTableInfluencer as BoostbotInfluencer } from 'types';
import type { SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';
import Question from 'src/components/icons/Question';

export interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    selectedInfluencers: RowSelectionState;
    setSelectedInfluencers: OnChangeFn<RowSelectionState>;
    influencerCount?: number;
    setPage?: (page: number) => void;
    currentPage?: number;
    meta: TableMeta<TData>;
}

declare module '@tanstack/react-table' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface TableMeta<TData extends RowData> {
        t: TFunction<'translation', undefined, 'translation'>;
        searchId: string | number | null;
        setSelectedRow: (row: Row<TData>) => void;
        setIsInfluencerDetailsModalOpen: (open: boolean) => void;
        allSequenceInfluencers?: SequenceInfluencerManagerPage[];
        setSelectedCount: (count: number) => void;
        isLoading: boolean;
    }
}

export function InfluencersTable<TData, TValue>({
    data,
    columns,
    selectedInfluencers,
    setSelectedInfluencers,
    influencerCount,
    setPage,
    currentPage,
    meta,
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
        initialState: {
            pagination: {
                pageSize: 20,
            },
        },
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

    const selectedCount = table.getFilteredSelectedRowModel().rows.length;
    useEffect(() => {
        const allSequenceInfluencersSet = new Set(
            table.options.meta?.allSequenceInfluencers?.map((influencer) => influencer.iqdata_id),
        );

        const filteredCount = table
            .getFilteredSelectedRowModel()
            .rows.filter((row) => !allSequenceInfluencersSet.has((row.original as BoostbotInfluencer).user_id)).length;

        table.options.meta?.setSelectedCount(filteredCount);
    }, [table, selectedCount]);

    useEffect(() => {
        tableRef.current?.scrollIntoView(true);
    }, [page]);

    return (
        <div className="relative h-full w-full flex-shrink-0 overflow-scroll md:flex-shrink">
            <div className="h-full w-full overflow-scroll rounded-md border">
                {/* Scroll to the top of the table when changing pagination pages */}
                <div ref={tableRef} />
                <Table>
                    <TableHeader className=" sticky top-0 z-20 bg-white shadow">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead className="text-xs" key={header.id}>
                                            <div className="flex flex-row items-center gap-1">
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(header.column.columnDef.header, header.getContext())}
                                                {['audienceGender', 'audienceGeolocations', 'boostbotScore'].includes(
                                                    header.id,
                                                ) && (
                                                    <Tooltip
                                                        content={t(`tooltips.${header.id}.title`)}
                                                        detail={t(`tooltips.${header.id}.description`)}
                                                        position={
                                                            header.id === 'boostbotScore'
                                                                ? 'bottom-right'
                                                                : 'bottom-left'
                                                        }
                                                        className="w-8"
                                                    >
                                                        <Question className="h-1/2 w-1/2 stroke-gray-400" />
                                                    </Tooltip>
                                                )}
                                            </div>
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
                                    data-state={false}
                                    className={`${
                                        parseInt(row.id) % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                                    } justify-center`}
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

                <div className="sticky bottom-0 left-0 right-0 z-10 w-full border bg-white p-2">
                    <DataTablePagination
                        table={table}
                        count={influencerCount}
                        setPageFunction={setPage}
                        currentPage={currentPage}
                    />
                </div>
            </div>
        </div>
    );
}

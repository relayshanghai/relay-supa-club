import React, { useState, useCallback } from 'react';
import { InfluencerRow } from './influencer-row';
import type { InfluencerRowProps } from './influencer-row';
import { type SequenceInfluencerManagerPage } from 'src/hooks/use-sequence-influencers';
import { Button } from 'src/components/button';
import { TABLE_LIMIT, TABLE_COLUMNS } from '../constants';

export const Table = ({
    influencers,
    onRowClick,
}: {
    influencers?: SequenceInfluencerManagerPage[];
    onRowClick?: (data: InfluencerRowProps['influencer']) => void;
}) => {
    const [page, setPage] = useState(0);
    const totalPages = Math.ceil((influencers?.length || 0) / TABLE_LIMIT);
    // const [selectedAll, setSelectedAll] = useState<boolean>(false);

    const handleRowClick = useCallback(
        (influencer: InfluencerRowProps['influencer']) => {
            onRowClick && onRowClick(influencer);
        },
        [onRowClick],
    );

    // const handleCheckboxChange = (id: string) => {
    //     const updatedCheckboxes = influencersList.map((checkbox) =>
    //       checkbox.id === id ? { ...checkbox, checked: !checkbox.checked } : checkbox
    //     );
    //     setInfluencersList(updatedCheckboxes);
    //     setSelectedAll(updatedCheckboxes.every((checkbox) => checkbox.checked));
    // };

    //   const handleCheckAll = () => {
    //     const updatedCheckboxes = influencersList.map((checkbox) => ({
    //       ...checkbox,
    //       checked: !selectedAll,
    //     }));
    //     setInfluencersList(updatedCheckboxes);
    //     setSelectedAll(!selectedAll);
    //   };

    return (
        <div>
            <div className="mt-6 overflow-auto">
                <table className="w-full table-auto divide-y divide-gray-200 overflow-y-visible bg-white ">
                    <thead>
                        <tr>
                            {/* <th>
                                <input className="appearance-none display-none rounded border-gray-300 checked:text-primary-500" type='checkbox' checked={selectedAll} onChange={handleCheckAll} />
                            </th> */}
                            {TABLE_COLUMNS.map((column) => (
                                <th
                                    key={column.header}
                                    className="whitespace-nowrap bg-white px-6 py-3 text-left text-xs font-normal tracking-wider text-gray-500"
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {influencers?.length === 0 && (
                            <tr>
                                <td colSpan={TABLE_COLUMNS.length + 1} className="px-6 py-4">
                                    <div className="flex justify-center">
                                        <p className="text-sm text-gray-500">No Influencers...</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                        {influencers?.slice(page * TABLE_LIMIT, (page + 1) * TABLE_LIMIT).map((influencer, index) => (
                            <InfluencerRow
                                onRowClick={handleRowClick}
                                key={influencer.id}
                                influencer={influencer}
                                index={index}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="m-4 flex items-center justify-end gap-4 font-medium">
                <p
                    className={`${page !== 0 && 'cursor-pointer'} select-none border-none bg-transparent text-gray-500`}
                    onClick={() => {
                        if (page === 0) return;
                        setPage(page - 1);
                    }}
                >
                    {'<<'} Previous
                </p>
                <div className="flex flex-row items-center">
                    {Array.from({ length: totalPages }, (_, index) => index).map((pageNumber) => (
                        <Button
                            key={`button-page-${pageNumber + 1}`}
                            disabled={page === pageNumber}
                            className="border-none bg-transparent text-slate-500 hover:text-gray-200 disabled:bg-primary-500 disabled:text-gray-200"
                            onClick={() => setPage(pageNumber)}
                        >
                            {pageNumber + 1}
                        </Button>
                    ))}
                </div>
                <p
                    className={`${
                        page < totalPages - 1 && 'cursor-pointer'
                    } select-none border-none bg-transparent text-gray-500`}
                    onClick={() => {
                        if (page >= totalPages - 1) return;
                        setPage(page + 1);
                    }}
                >
                    Next {'>>'}
                </p>
            </div>
        </div>
    );
};

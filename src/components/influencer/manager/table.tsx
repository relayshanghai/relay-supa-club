import React, { useState, useCallback } from 'react';
import { InfluencerRow } from './influencer-row';
import type { InfluencerRowProps } from './influencer-row';
import { Button } from 'src/components/button';
import { TABLE_LIMIT, TABLE_COLUMNS, COLLAB_OPTIONS } from '../constants';
import { useTranslation } from 'react-i18next';
import { type SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';

export const Table = ({
    influencers,
    onRowClick,
}: {
    influencers?: SequenceInfluencerManagerPage[];
    onRowClick?: (data: InfluencerRowProps['influencer']) => void;
}) => {
    const [page, setPage] = useState(0);

    const filteredInfluencers =
        influencers && influencers.length > 0
            ? influencers.filter((influencer) => Object.keys(COLLAB_OPTIONS).includes(influencer.funnel_status))
            : [];
    const totalPages = Math.ceil((filteredInfluencers?.length || 0) / TABLE_LIMIT);

    const { t } = useTranslation();

    const handleRowClick = useCallback(
        (influencer: SequenceInfluencerManagerPage) => {
            onRowClick && onRowClick(influencer);
        },
        [onRowClick],
    );

    // TODO Add multiselect operations on the table

    // const [selectedAll, setSelectedAll] = useState<boolean>(false);

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
                            {/* // TODO Add multiselect operations on the table */}
                            {/* <th>
                                <input className="appearance-none display-none rounded border-gray-300 checked:text-primary-500" type='checkbox' checked={selectedAll} onChange={handleCheckAll} />
                            </th> */}
                            {TABLE_COLUMNS.map((column) => (
                                <th
                                    key={column.header}
                                    className="whitespace-nowrap bg-white px-6 py-3 text-left text-xs font-normal tracking-wider text-gray-500"
                                >
                                    {t(`manager.${column.header}`)}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {!filteredInfluencers ||
                            (filteredInfluencers.length === 0 && (
                                <tr>
                                    <td colSpan={TABLE_COLUMNS.length + 1} className="px-6 py-4">
                                        <div className="flex justify-center">
                                            <p className="text-sm text-gray-500">No Influencers...</p>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        {filteredInfluencers
                            ?.slice(page * TABLE_LIMIT, (page + 1) * TABLE_LIMIT)
                            .map((influencer, index) => (
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
            {totalPages > 1 && (
                <div className="m-4 flex items-center justify-end gap-4 font-medium">
                    <p
                        className={`${
                            page !== 0 && 'cursor-pointer'
                        } select-none border-none bg-transparent text-gray-500`}
                        onClick={() => {
                            if (page === 0) return;
                            setPage(page - 1);
                        }}
                    >
                        {'<<'} {t('manager.previous')}
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
                        {t('manager.next')} {'>>'}
                    </p>
                </div>
            )}
        </div>
    );
};

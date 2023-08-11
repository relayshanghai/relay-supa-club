import React, { useState, useCallback } from 'react';
import { InfluencerRow } from './influencer-row';
import type { InfluencerRowProps } from './influencer-row';

const mockTableColumns = [
    { header: 'name', type: 'name', name: 'name' },
    { header: 'collabstatus', type: 'collabstatus', name: 'collabstatus' },
    { header: 'manager', type: 'manager', name: 'manager' },
    { header: 'tags', type: 'tags', name: 'tags' },
    { header: 'lastupdated', type: 'lastupdated', name: 'lastupdated' }, // In the Figma design feedback, Sophia changed Payment Amount to Influencer Fee as the column name.
    { header: 'inbox', type: 'link', name: 'inbox' },
];

type Props = {
    onRowClick: (data: InfluencerRowProps['influencer']) => void;
};

export const Table = (props: Props) => {
    // const [selectedAll, setSelectedAll] = useState<boolean>(false);
    const [influencersList, _setInfluencersList] = useState([
        {
            id: '1',
            info: {
                name: 'Kylie Jenner',
                handle: 'kylie',
            },
            collabstatus: 'negotiating',
            manager: 'Sophia',
            tags: ['fashion', 'beauty'],
            lastupdated: '2 days ago',
            unread: true,
            checked: false,
        },
        {
            id: '2',
            info: {
                name: 'Kylie Jenner',
                handle: 'kylie',
            },
            collabstatus: 'negotiating',
            manager: 'Mikaela',
            tags: ['fashion', 'beauty'],
            lastupdated: '2 days ago',
            checked: false,
        },
    ]);

    const handleRowClick = useCallback(
        (influencer: InfluencerRowProps['influencer']) => {
            props.onRowClick && props.onRowClick(influencer);
        },
        [props],
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
                            {mockTableColumns.map((column) => (
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
                        {influencersList.length === 0 && (
                            <tr>
                                <td colSpan={mockTableColumns.length + 1} className="px-6 py-4">
                                    <div className="flex justify-center">
                                        <p className="text-sm text-gray-500">No Influencers...</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                        {influencersList.map((influencer, index) => (
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
        </div>
    );
};

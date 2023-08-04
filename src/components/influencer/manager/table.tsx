import React from 'react';
import { InfluencerRow } from './influencer-row';

const tableColumns = [
    { header: 'name', type: 'name', name: 'name' },
    { header: 'collabstatus', type: 'collabstatus', name: 'collabstatus' },
    { header: 'manager', type: 'manager', name: 'manager' },
    { header: 'tags', type: 'tags', name: 'tags' },
    { header: 'lastupdated', type: 'lastupdated', name: 'lastupdated' }, // In the Figma design feedback, Sophia changed Payment Amount to Influencer Fee as the column name.
    { header: 'inbox', type: 'link', name: 'inbox' },
];

const influencersList = [
    {
        id: 1,
        info: {
            name: 'Kylie Jenner',
            handle: '@kylie',
        },
        collabstatus: 'Pending',
        manager: 'Sophia',
        tags: 'Fashion',
        lastupdated: '2 days ago',
    },
    {
        id: 2,
        info: {
            name: 'Kylie Jenner',
            handle: '@kylie',
        },
        collabstatus: 'Pending',
        manager: 'Mikaela',
        tags: 'Fashion',
        lastupdated: '2 days ago',
    },
];

export const Table = () => {
    return (
        <div>
            <div className="mt-6 overflow-auto">
                <table className="w-full table-auto divide-y divide-gray-200 overflow-y-visible bg-white ">
                    <thead>
                        <tr>
                            {tableColumns.map((column) => (
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
                                <td colSpan={tableColumns.length + 1} className="px-6 py-4">
                                    <div className="flex justify-center">
                                        <p className="text-sm text-gray-500">No Influencers...</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                        {influencersList.map((creator, index) => (
                            <InfluencerRow key={creator.id} creator={creator} index={index} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

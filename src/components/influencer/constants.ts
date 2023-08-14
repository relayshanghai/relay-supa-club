import { type MultipleDropdownObject } from '../library';

export const TABLE_LIMIT = 2;

export const TABLE_COLUMNS = [
    { header: 'name', type: 'name', name: 'name' },
    { header: 'collabstatus', type: 'collabstatus', name: 'collabstatus' },
    { header: 'manager', type: 'manager', name: 'manager' },
    { header: 'tags', type: 'tags', name: 'tags' },
    { header: 'lastupdated', type: 'lastupdated', name: 'lastupdated' }, // In the Figma design feedback, Sophia changed Payment Amount to Influencer Fee as the column name.
    { header: 'inbox', type: 'link', name: 'inbox' },
];

export const COLLABOPTIONS: MultipleDropdownObject = {
    Negotiating: {
        style: 'bg-blue-100 text-blue-500',
    },
    Confirmed: {
        style: 'bg-primary-100 text-primary-500',
    },
    Shipped: {
        style: 'bg-yellow-100 text-yellow-500',
    },
    Received: {
        style: 'bg-green-100 text-green-500',
    },
    'Content Approval': {
        style: 'bg-pink-100 text-pink-500',
    },
    Posted: {
        style: 'bg-cyan-100 text-cyan-500',
    },
    Rejected: {
        style: 'bg-red-100 text-red-500',
    },
};

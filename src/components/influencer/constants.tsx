import { Approved, Confirmed, Negotiating, Posted, Received, Rejected, Shipped } from '../icons';
import { type MultipleDropdownObject } from '../library';

export const TABLE_LIMIT = 10000;

export const TABLE_COLUMNS = [
    { header: 'name', type: 'name', name: 'name' },
    { header: 'platform', type: 'platform', name: 'platform' },
    { header: 'collabStatus', type: 'collabstatus', name: 'collabstatus' },
    { header: 'manager', type: 'manager', name: 'manager' },
    { header: 'tags', type: 'tags', name: 'tags' },
    { header: 'lastUpdated', type: 'lastupdated', name: 'lastupdated' }, // In the Figma design feedback, Sophia changed Payment Amount to Influencer Fee as the column name.
    { header: 'inbox', type: 'link', name: 'inbox' },
];

export const COLLAB_OPTIONS: MultipleDropdownObject = {
    Negotiating: {
        style: 'bg-blue-100 text-blue-500',
        icon: <Negotiating className="h-4 w-4 stroke-blue-500" />,
    },
    Confirmed: {
        style: 'bg-primary-100 text-primary-500',
        icon: <Confirmed className="h-4 w-4 stroke-primary-400" />,
    },
    Shipped: {
        style: 'bg-yellow-100 text-yellow-500',
        icon: <Shipped className="h-4 w-4 stroke-yellow-500" />,
    },
    Received: {
        style: 'bg-green-100 text-green-500',
        icon: <Received className="h-4 w-4 stroke-green-500" />,
    },
    'Content Approval': {
        style: 'bg-pink-100 text-pink-500',
        icon: <Approved className="h-4 w-4 stroke-pink-500" />,
    },
    Posted: {
        style: 'bg-cyan-100 text-cyan-500',
        icon: <Posted className="h-4 w-4 stroke-cyan-500" />,
    },
    Rejected: {
        style: 'bg-red-100 text-red-500',
        icon: <Rejected className="h-4 w-4 stroke-red-500" />,
    },
};

export const PLATFORMS = {
    instagram: 'IG',
    youtube: 'YT',
    tiktok: 'TT',
};

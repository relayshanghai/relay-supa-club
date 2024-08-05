import { FunnelStatusRequest } from 'pages/api/v2/threads/request';
import { Approved, Completed, Confirmed, Negotiating, Posted, Received, Rejected, Shipped } from '../icons';
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
    [FunnelStatusRequest.Negotiating]: {
        style: 'bg-yellow-100 text-yellow-500',
        icon: <Negotiating className="h-4 w-4 stroke-yellow-500" />,
    },
    [FunnelStatusRequest.Confirmed]: {
        style: 'bg-blue-100 text-blue-500',
        icon: <Confirmed className="h-4 w-4 stroke-blue-400" />,
    },
    [FunnelStatusRequest.Shipped]: {
        style: 'bg-orange-100 text-orange-500',
        icon: <Shipped className="h-4 w-4 stroke-orange-500" />,
    },
    [FunnelStatusRequest.Received]: {
        style: 'bg-fuchsia-100 text-fuchsia-500',
        icon: <Received className="h-4 w-4 stroke-fuchsia-500" />,
    },
    [FunnelStatusRequest.ContentApproval]: {
        style: 'bg-cyan-100 text-cyan-500',
        icon: <Approved className="h-4 w-4 stroke-cyan-500" />,
    },
    [FunnelStatusRequest.Posted]: {
        style: 'bg-primary-100 text-primary-500',
        icon: <Posted className="h-4 w-4 stroke-primary-500" />,
    },
    [FunnelStatusRequest.Completed]: {
        style: 'bg-green-100 text-green-500',
        icon: <Completed className="h-4 w-4 stroke-green-500" />,
    },
    [FunnelStatusRequest.Rejected]: {
        style: 'bg-red-100 text-red-500',
        icon: <Rejected className="h-4 w-4 stroke-red-500" />,
    },
};

export const PLATFORMS = {
    instagram: 'IG',
    youtube: 'YT',
    tiktok: 'TT',
};

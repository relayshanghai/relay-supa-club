import { useState } from 'react';
import { SelectMultipleDropdown } from '../../library/select-multiple-dropdown';

export const collabOptions = {
    negotiating: {
        label: 'Negotiating',
        value: 10,
        style: 'bg-blue-100 text-blue-500',
    },
    confirmed: {
        label: 'Confirmed',
        value: 20,
        style: 'bg-primary-100 text-primary-500',
    },
    shipped: {
        label: 'Shipped',
        value: 30,
        style: 'bg-yellow-100 text-yellow-500',
    },
    received: {
        label: 'Received',
        value: 40,
        style: 'bg-green-100 text-green-500',
    },
    contentApproval: {
        label: 'Content Approval',
        value: 50,
        style: 'bg-pink-100 text-pink-500',
    },
    posted: {
        label: 'Posted',
        value: 60,
        style: 'bg-cyan-100 text-cyan-500',
    },
    rejected: {
        label: 'Rejected',
        value: 70,
        style: 'bg-red-100 text-red-500',
    },
};

export const CollabStatus = () => {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

    return (
        <div className="flex w-full flex-col">
            <SelectMultipleDropdown
                text={'Filter by status'}
                options={collabOptions}
                selectedOptions={selectedOptions}
                setSelectedOptions={setSelectedOptions}
            />
        </div>
    );
};

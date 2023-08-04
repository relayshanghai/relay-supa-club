import React, { useCallback, useState } from 'react';
import { SelectMultipleDropdown } from './select-multiple-dropdown';

const collabOptions = {
    negotiating: {
        label: 'Negotiating',
        value: 10,
        color: 'bg-blue-100 text-blue-500',
    },
    confirmed: {
        label: 'Confirmed',
        value: 20,
        color: 'bg-primary-100 text-primary-500',
    },
    shipped: {
        label: 'Shipped',
        value: 30,
        color: 'bg-yellow-100 text-yellow-500',
    },
    recieved: {
        label: 'Recieved',
        value: 40,
        color: 'bg-green-100 text-green-500',
    },
    contentApproval: {
        label: 'Content Approval',
        value: 50,
        color: 'bg-pink-100 text-pink-500',
    },
    posted: {
        label: 'Posted',
        value: 60,
        color: 'bg-cyan-100 text-cyan-500',
    },
    rejected: {
        label: 'Rejected',
        value: 70,
        color: 'bg-red-100 text-red-500',
    },
};

export const CollabStatus = () => {
    const [showDropdown, setShowDropdown] = useState<boolean>(false);

    const setShow = useCallback(
        (show?: boolean) => {
            if (show !== undefined) {
                setShowDropdown(show);
                return;
            }
            setShowDropdown(!showDropdown);
        },
        [showDropdown],
    );

    return (
        <div className="flex w-full flex-col">
            <SelectMultipleDropdown
                text={'Collab Status'}
                show={showDropdown}
                setShow={setShow}
                options={collabOptions}
            />
        </div>
    );
};

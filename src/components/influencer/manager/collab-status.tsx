import React, { useCallback, useState } from 'react';
import { SelectMultipleDropdown } from './select-multiple-dropdown';

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
        <div className="flex flex-col">
            <SelectMultipleDropdown show={showDropdown} setShow={setShow} options={['option1', 'option2']} />
        </div>
    );
};

import React, { useCallback, useState } from 'react';
import { SelectMultipleDropdown } from './select-multiple-dropdown';

export const Tags = () => {
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
            <p>Tags</p>
            <SelectMultipleDropdown show={showDropdown} setShow={setShow} options={['tag1', 'tag2']} />
        </div>
    );
};

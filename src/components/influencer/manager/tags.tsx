import { useState } from 'react';
import { SelectMultipleDropdown } from '../../library/select-multiple-dropdown';

const tags = {
    fashion: {
        label: 'Fashion',
        style: 'bg-primary-100 text-primary-500 border border-primary-500',
    },
    beauty: {
        label: 'Beauty',
        style: 'bg-primary-100 text-primary-500 border border-primary-500',
    },
};

export const Tags = () => {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    return (
        <div className="flex flex-col">
            <p>Tags</p>
            <SelectMultipleDropdown
                text={'Tags'}
                selectedOptions={selectedOptions}
                setSelectedOptions={setSelectedOptions}
                options={tags}
            />
        </div>
    );
};

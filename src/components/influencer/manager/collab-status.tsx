import { useState } from 'react';
import { SelectMultipleDropdown } from '../../library/select-multiple-dropdown';
import type { SequenceInfluencer } from 'src/utils/api/db';
import { collabOptions } from '../constants';

export const CollabStatus = ({ _influencers }: { _influencers?: SequenceInfluencer[] }) => {
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

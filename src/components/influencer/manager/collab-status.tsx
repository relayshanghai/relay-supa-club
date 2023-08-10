import { type MultipleDropdownObject, SelectMultipleDropdown } from '../../library/select-multiple-dropdown';
import { type FunnelStatus } from 'src/utils/api/db';

export const CollabStatus = ({
    collabOptions,
    filters,
    onSetFilters,
}: {
    collabOptions: MultipleDropdownObject;
    filters: FunnelStatus[];
    onSetFilters: (filters: FunnelStatus[]) => void;
}) => {
    return (
        <div className="flex w-full flex-col">
            <SelectMultipleDropdown
                text={'Filter by status'}
                options={collabOptions}
                selectedOptions={filters}
                setSelectedOptions={onSetFilters}
            />
        </div>
    );
};

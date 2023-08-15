import { SelectMultipleDropdown } from '../../library/select-multiple-dropdown';
import { type FunnelStatus } from 'src/utils/api/db/types';

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

export const Tags = ({
    filters,
    onSetFilters,
}: {
    filters: FunnelStatus[];
    onSetFilters: (filters: FunnelStatus[]) => void;
}) => {
    return (
        <div className="flex flex-col">
            <p>Tags</p>
            <SelectMultipleDropdown
                text={'Tags'}
                selectedOptions={filters}
                setSelectedOptions={onSetFilters}
                options={tags}
            />
        </div>
    );
};

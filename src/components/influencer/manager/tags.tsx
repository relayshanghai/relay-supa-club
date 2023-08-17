import { type CommonStatusType, SelectMultipleDropdown } from '../../library/select-multiple-dropdown';

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
    filters: CommonStatusType[];
    onSetFilters: (filters: CommonStatusType[]) => void;
}) => {
    return (
        <div className="flex flex-col">
            <p>Tags</p>
            <SelectMultipleDropdown
                text={'Tags'}
                selectedOptions={filters}
                setSelectedOptions={onSetFilters}
                options={tags}
                translationPath="manager"
            />
        </div>
    );
};

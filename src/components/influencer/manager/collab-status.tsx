import { useTranslation } from 'react-i18next';
import {
    type MultipleDropdownObject,
    SelectMultipleDropdown,
    type CommonStatusType,
} from '../../library/select-multiple-dropdown';

export const CollabStatus = ({
    collabOptions,
    filters,
    onSetFilters,
}: {
    collabOptions: MultipleDropdownObject;
    filters: CommonStatusType[];
    onSetFilters: (filters: CommonStatusType[]) => void;
}) => {
    const { t } = useTranslation();
    return (
        <div className="flex w-full flex-col">
            <SelectMultipleDropdown
                text={t('manager.filterStatus')}
                options={collabOptions}
                selectedOptions={filters}
                setSelectedOptions={onSetFilters}
                translationPath="manager"
            />
        </div>
    );
};

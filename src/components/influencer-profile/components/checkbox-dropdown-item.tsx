import type { ReactNode } from 'react';
import { useCallback } from 'react';
import type { FunnelStatus } from 'src/utils/api/db';

export type CheckboxDropdownItemData = {
    id: FunnelStatus;
    label: FunnelStatus;
    value?: number;
    style?: string;
};

type Props = {
    value: CheckboxDropdownItemData;
    label: ReactNode | string;
    isSelected?: boolean;
    onSelect?: (value: Props['value']) => void;
    onRemove?: (value: Props['value']) => void;
    showCheckbox?: boolean;
};

export const CheckboxDropdownItem = (props: Props) => {
    const { isSelected, showCheckbox } = { isSelected: false, showCheckbox: true, ...props };

    const handleSelect = useCallback(() => {
        !isSelected && props.onSelect && props.onSelect(props.value);
        isSelected && props.onRemove && props.onRemove(props.value);
    }, [props, isSelected]);

    return (
        <li onClick={handleSelect}>
            <label
                className={`${
                    isSelected && !showCheckbox ? 'bg-primary-100' : ''
                } flex cursor-pointer flex-row items-center justify-between rounded-lg px-3 py-2 hover:bg-primary-600 hover:text-slate-100`}
            >
                <div className="flex flex-row items-center gap-2">
                    {showCheckbox && (
                        <input
                            type="checkbox"
                            value={props.value.id}
                            checked={isSelected}
                            className="appearance-none rounded border-gray-300 checked:text-primary-500"
                            onChange={() => null} // <- virtually control this input
                        />
                    )}
                    {props.label}
                </div>
            </label>
        </li>
    );
};

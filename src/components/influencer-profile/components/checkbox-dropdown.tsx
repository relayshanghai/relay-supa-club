import { t } from 'i18next';
import type { ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronDown } from 'src/components/icons';
import type { CheckboxDropdownItemData } from './checkbox-dropdown-item';
import { CheckboxDropdownItem } from './checkbox-dropdown-item';

type Props = {
    label: string;
    options: CheckboxDropdownItemData[];
    selected: string[];
    onUpdate?: (items: CheckboxDropdownItemData[]) => void;
    preIcon?: ReactNode;
    multiple?: boolean;
};

export const CheckboxDropdown = ({ label, options, onUpdate, ...props }: Props) => {
    const { multiple } = { multiple: true, ...props };
    const [selectedOptions, setSelectedOptions] = useState(() => options.filter((o) => props.selected.includes(o.id)));
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const clearSelection = useCallback(() => {
        onUpdate && onUpdate([])
    }, [onUpdate]);

    useEffect(() => {
        setSelectedOptions((s) => options.filter((o) => props.selected.includes(o.id)))
    }, [options, props.selected])

    const isItemSelected = useCallback(
        (item: CheckboxDropdownItemData) => {
            return selectedOptions.some((o) => o.id === item.id);
        },
        [selectedOptions],
    );

    const handleItemSelect = useCallback(
        (item: CheckboxDropdownItemData) => {
            if (selectedOptions.length <= 0) return;
            const selected = multiple ? [...selectedOptions, item] : [item]
            onUpdate && onUpdate(selected)

            if (!multiple) setIsDropdownOpen(false);
        },
        [multiple, onUpdate, selectedOptions],
    );

    const handleItemRemove = useCallback((item: CheckboxDropdownItemData) => {
        onUpdate && onUpdate(selectedOptions.filter((i) => i.id !== item.id))
    }, [onUpdate, selectedOptions]);

    const handleBlur = useCallback((e: any) => {
        // check if focused element is child of <details />
        if (e.currentTarget.contains(e.relatedTarget)) return;
        setIsDropdownOpen(false);
        // console.log('handle dropdown close')
    }, []);

    const handleDropdownOpen = useCallback((e: any) => {
        e.preventDefault(); // <- fixes pre-click bug on <details />
        setIsDropdownOpen((s) => !s); // <- toggle so this closes if <details /> is clicked
        // console.log('handle dropdown open')
    }, []);

    const postIcon = useMemo(() => {
        if (selectedOptions.length > 0) {
            return (
                <p
                    onMouseDown={clearSelection}
                    className="flex h-full items-center px-3 text-lg font-semibold hover:bg-slate-200"
                >
                    x
                </p>
            );
        }

        return <ChevronDown className="mr-2 h-6 w-6 flex-shrink-0" />;
    }, [selectedOptions.length, clearSelection]);

    const selectedItemPills = useMemo(() => {
        if (selectedOptions.length <= 0) {
            return <p className="px-2 py-1.5">{label}</p>;
        }

        return selectedOptions.map((item) => {
            return (
                <p key={item.id} className={`rounded text-xs font-medium ${item.style} whitespace-nowrap px-2 py-2`}>
                    {item.label}
                </p>
            );
        });
    }, [selectedOptions, label]);

    const items = useMemo(() => {
        const items = options.map((option) => {
            const label = (
                <>
                    <p className={`${option.style} whitespace-nowrap rounded-md px-3 py-2 text-xs`}>{option.label}</p>
                    <p>{option.value}</p>
                </>
            );

            return (
                <CheckboxDropdownItem
                    key={option.id}
                    value={option}
                    label={label}
                    onSelect={handleItemSelect}
                    onRemove={handleItemRemove}
                    isSelected={isItemSelected(option)}
                    showCheckbox={multiple}
                />
            );
        });

        if (multiple) {
            const clearButton = (
                <li key="clear-button" className="p-2">
                    <label onClick={clearSelection} className="cursor-pointer text-center">
                        <p className="rounded-lg border-2 border-gray-200 px-4 py-2">{t('filters.clearButton')}</p>
                    </label>
                </li>
            );

            items.push(clearButton);
        }

        return items;
    }, [handleItemSelect, handleItemRemove, isItemSelected, options, clearSelection, multiple]);

    return (
        <details
            open={isDropdownOpen}
            onClick={handleDropdownOpen}
            onBlur={handleBlur}
            className="relative flex w-32 min-w-fit cursor-pointer select-none appearance-none flex-row items-center justify-between gap-2 rounded-md border border-gray-200 bg-white font-medium text-gray-400 ring-1 ring-gray-900 ring-opacity-5 focus:border-primary-500 focus:border-transparent focus:outline-none focus:ring-0 focus:ring-primary-500 sm:w-64 sm:text-sm"
        >
            <summary
                tabIndex={0} // <- make this element focusable
                className={`flex h-full min-w-full flex-row items-center justify-between`}
            >
                {props.preIcon ? <div className="pl-2">{props.preIcon}</div> : null}
                <div className="flex grow flex-row items-center gap-2 px-3 py-1">{selectedItemPills}</div>
                {postIcon}
            </summary>
            <ul
                tabIndex={0} // <- make this element focusable
                onClick={(e) => {
                    // prevent the click from reaching <details />
                    e.stopPropagation();

                    // prevent the click event from retriggering since we are preventing it from bubbling up
                    e.preventDefault();
                }}
                className="label-sm absolute mt-0.5 w-full select-none rounded-lg border bg-white shadow-lg"
            >
                {items}
            </ul>
        </details>
    );
};

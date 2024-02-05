import { t } from 'i18next';
import type { ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronDown } from 'src/components/icons';
import type { CheckboxDropdownItemData } from './checkbox-dropdown-item';
import { CheckboxDropdownItem } from './checkbox-dropdown-item';
import { COLLAB_OPTIONS } from 'src/components/influencer/constants';

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
        onUpdate && onUpdate([]);
    }, [onUpdate]);

    useEffect(() => {
        setSelectedOptions(() => options.filter((option) => props.selected.includes(option.id)));
    }, [options, props.selected]);

    const isItemSelected = useCallback(
        (item: CheckboxDropdownItemData) => {
            return selectedOptions.some((o) => o.id === item.id);
        },
        [selectedOptions],
    );

    const handleItemSelect = useCallback(
        (item: CheckboxDropdownItemData) => {
            if (selectedOptions.length <= 0) return;
            const selected = multiple ? [...selectedOptions, item] : [item];
            onUpdate && onUpdate(selected);

            if (!multiple) setIsDropdownOpen(false);
        },
        [multiple, onUpdate, selectedOptions],
    );

    const handleItemRemove = useCallback(
        (item: CheckboxDropdownItemData) => {
            onUpdate && onUpdate(selectedOptions.filter((i) => i.id !== item.id));
        },
        [onUpdate, selectedOptions],
    );

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
        return (
            <p
                onMouseDown={clearSelection}
                className="flex h-full items-center pl-3 text-lg font-semibold hover:bg-slate-200"
            >
                <ChevronDown className="mr-2 h-6 w-6 flex-shrink-0" />
            </p>
        );
    }, [clearSelection]);

    const selectedItemPills = useMemo(() => {
        if (selectedOptions.length <= 0) {
            return <p className="px-2 py-1.5">{label}</p>;
        }

        return selectedOptions.map((item) => {
            return (
                <p
                    key={item.id}
                    className={`rounded text-xs font-medium ${item.style} flex gap-2 whitespace-nowrap px-2 py-2`}
                >
                    {COLLAB_OPTIONS[item.label].icon}

                    {t(`manager.${item.label}`)}
                </p>
            );
        });
    }, [selectedOptions, label]);

    const items = useMemo(() => {
        const items = options.map((option) => {
            const label = (
                <>
                    <p className={`${option.style} flex gap-2 whitespace-nowrap rounded-md px-3 py-2 text-xs`}>
                        {COLLAB_OPTIONS[option.label].icon}
                        {t(`manager.${option.label}`)}
                    </p>
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
        <section className="flex w-full flex-col gap-2">
            <p className="text-sm font-semibold text-gray-500">{label}</p>
            <details
                open={isDropdownOpen}
                onClick={handleDropdownOpen}
                onBlur={handleBlur}
                className="relative z-50 flex w-full cursor-pointer select-none appearance-none flex-row items-center justify-between gap-2 rounded-md border border-gray-200 bg-white font-medium text-gray-400 ring-1 ring-gray-900 ring-opacity-5 focus:border-primary-500 focus:border-transparent focus:outline-none focus:ring-0 focus:ring-primary-500 sm:text-sm"
            >
                <summary
                    tabIndex={0} // <- make this element focusable
                    className={`flex h-full min-w-full flex-row items-center justify-between`}
                >
                    {props.preIcon ? <div className="pl-2">{props.preIcon}</div> : null}
                    <div className="flex grow flex-row items-center gap-2 px-3 py-0.5">{selectedItemPills}</div>
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
        </section>
    );
};

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, FilterFunnel } from 'src/components/icons';

export const SelectMultipleDropdown = ({
    text,
    options,
}: {
    text: string;
    show: boolean;
    setShow: (show?: boolean) => void;
    options: any;
}) => {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const detailsRef = useRef<HTMLDetailsElement>(null);

    const collapseDetails = (event: any) => {
        const detailsTarget = event.target as Node;
        const detailsCurrent = detailsRef.current;
        if (detailsCurrent && !detailsCurrent.contains(detailsTarget)) {
            detailsCurrent.removeAttribute('open');
        }
    };

    const resetSelection = () => {
        setSelectedOptions([]);
    };

    useEffect(() => {
        document.addEventListener('mousedown', collapseDetails);

        return () => {
            document.removeEventListener('mousedown', collapseDetails);
        };
    }, []);

    return (
        <details
            ref={detailsRef}
            className="relative flex w-32 min-w-fit cursor-pointer select-none appearance-none flex-row items-center justify-between gap-2 rounded-md border border-gray-200 bg-white font-medium text-gray-400 ring-1 ring-gray-900 ring-opacity-5 focus:border-primary-500 focus:border-transparent focus:outline-none focus:ring-0 focus:ring-primary-500 sm:w-64 sm:text-sm"
        >
            <summary className={`flex min-w-full flex-row items-center justify-between gap-2 px-3 py-1`}>
                <div className="flex flex-row items-center gap-2">
                    <FilterFunnel className="h-4 w-4 stroke-slate-500" />
                    {selectedOptions.length > 0 ? (
                        selectedOptions.map((selectedOption, index) => (
                            <p
                                key={index}
                                className={`rounded text-xs font-medium ${options[selectedOption].color} whitespace-nowrap px-2 py-2`}
                            >
                                {options[selectedOption].label}
                            </p>
                        ))
                    ) : (
                        <p className="px-2 py-1.5">{text}</p>
                    )}
                </div>
                {selectedOptions.length > 0 ? (
                    <p onClick={resetSelection} className="px-1 text-lg font-semibold">
                        x
                    </p>
                ) : (
                    <ChevronDown className="h-6 w-6 flex-shrink-0" />
                )}
            </summary>
            <ul className="absolute mt-2 w-full select-none rounded-lg border bg-white text-sm shadow-lg">
                {Object.keys(options).map((option) => (
                    <li key={option}>
                        <label
                            className="flex cursor-pointer flex-row items-center justify-between rounded-lg px-3 py-2 hover:bg-primary-600 hover:text-slate-100"
                            onMouseDown={(e) => e.stopPropagation()}
                        >
                            <div className="flex flex-row items-center gap-2">
                                <input
                                    type="checkbox"
                                    value={option}
                                    checked={selectedOptions.includes(option)}
                                    className="appearance-none rounded border-gray-300 checked:text-primary-500"
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedOptions([...selectedOptions, option]);
                                            return;
                                        }
                                        setSelectedOptions(selectedOptions.filter((o) => o !== option));
                                    }}
                                />
                                <p
                                    className={`${options[option].color} whitespace-nowrap rounded-md px-3 py-2 text-xs`}
                                >
                                    {options[option].label}
                                </p>
                            </div>
                            <p>{options[option].value}</p>
                        </label>
                    </li>
                ))}
                <li className="p-2">
                    <label onClick={resetSelection} className="cursor-pointer text-center">
                        <p className="rounded-lg border-2 border-gray-200 px-4 py-2">Clear Filters</p>
                    </label>
                </li>
            </ul>
        </details>
    );
};

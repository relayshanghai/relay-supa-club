import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'src/components/icons';

export const SelectMultipleDropdown = ({
    text,
    show,
    setShow,
    options,
}: {
    text: string;
    show: boolean;
    setShow: (show?: boolean) => void;
    options: any;
}) => {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShow();
            }
        };

        if (show) {
            document.addEventListener('click', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [show, setShow]);

    const toggleOptions = () => {
        setShow();
    };

    const handleOptionToggle = (option: string) => {
        if (selectedOptions.includes(option)) {
            setSelectedOptions(selectedOptions.filter((selectedOption) => selectedOption !== option));
        } else {
            setSelectedOptions([...selectedOptions, option]);
        }
    };

    return (
        <div className="relative min-w-full select-none" ref={dropdownRef}>
            <div
                className="flex cursor-pointer appearance-none flex-row items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-1 font-medium text-gray-400 ring-1 ring-gray-900 ring-opacity-5 focus:border-primary-500 focus:border-transparent focus:outline-none focus:ring-0 focus:ring-primary-500 sm:text-sm"
                onClick={toggleOptions}
            >
                <div className="flex w-24 flex-row gap-2 sm:w-52">
                    {selectedOptions.length > 0 ? (
                        selectedOptions.map((selectedOption, index) => (
                            <p
                                key={index}
                                className={`rounded font-medium ${options[selectedOption].color} px-2 py-1.5`}
                            >
                                {options[selectedOption].label}
                            </p>
                        ))
                    ) : (
                        <p className="px-2 py-1.5">{text}</p>
                    )}
                </div>
                <ChevronDown className="h-6 w-6" />
            </div>
            <div
                className={`${
                    !show && 'hidden'
                } absolute mt-2 w-full select-none rounded-xl border bg-white text-sm shadow-lg`}
            >
                {Object.keys(options).map((option, index) => (
                    <label
                        key={option + index}
                        className="flex cursor-pointer flex-row items-center justify-between rounded-xl px-3 py-2 hover:bg-primary-600 hover:text-slate-100"
                    >
                        <div className="flex flex-row items-center gap-2">
                            <input
                                type="checkbox"
                                className="appearance-none rounded border-gray-300 checked:text-primary-500"
                                value={option}
                                onClick={() => handleOptionToggle(option)}
                            />
                            <div
                                className={`rounded font-medium ${
                                    options[option as keyof typeof options].color
                                } px-2 py-1.5`}
                            >
                                <p className="text-center">{options[option as keyof typeof options].label}</p>
                            </div>
                        </div>
                        <p>{options[option as keyof typeof options].value}</p>
                    </label>
                ))}
            </div>
        </div>
    );
};

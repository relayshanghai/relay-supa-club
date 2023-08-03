import React, { useState, useEffect, useRef } from 'react';

export const SelectMultipleDropdown = ({
    show,
    setShow,
    options,
}: {
    show: boolean;
    setShow: (show?: boolean) => void;
    options: string[];
}) => {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShow(false);
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
        <div className="relative w-full" ref={dropdownRef}>
            <div className="flex cursor-pointer flex-col border-2" onClick={toggleOptions}>
                {selectedOptions.length > 0 ? (
                    selectedOptions.map((selectedOption, index) => <p key={index}>{selectedOption}</p>)
                ) : (
                    <p>Select filter</p>
                )}
            </div>
            {show && (
                <div className="absolute mt-2 rounded-xl border bg-white shadow-lg">
                    {options.map((option, index) => (
                        <label key={index} className="block cursor-pointer hover:bg-primary-600 hover:text-slate-300">
                            <input type="checkbox" value={option} onClick={() => handleOptionToggle(option)} />
                            {option}
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
};

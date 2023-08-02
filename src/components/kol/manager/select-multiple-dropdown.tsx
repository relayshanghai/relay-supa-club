import React from 'react';

export const SelectMultipleDropdown = ({ options }: { options: string[] }) => {
    return (
        <div className="flex flex-col">
            <select className="rounded-md border border-gray-300">
                {options.map((option, index) => {
                    return (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    );
                })}
            </select>
        </div>
    );
};

import type { InputHTMLAttributes } from 'react';
import { useState } from 'react';
interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    options: { label: string; value: string }[];
    onValueChange: (newValue: string) => void;
}

export const Radio = ({ label, options, onValueChange }: RadioProps) => {
    const [selectedValue, setSelectedValue] = useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedValue(event.target.value);
        onValueChange(event.target.value);
    };

    return (
        <div className="flex flex-col">
            <div className="text-xs font-semibold text-gray-800">{label}</div>
            <div className="my-2 flex justify-between">
                {options.map((option, index) => (
                    <div className="flex" key={index}>
                        <label className="flex w-full rounded-md border border-gray-200 bg-white p-3 focus:border-primary-500 focus:ring-primary-500">
                            <input
                                type="radio"
                                name="radio-button"
                                className="pointer-events-none mt-0.5 shrink-0 rounded-full border-gray-200 text-primary-600 focus:ring-primary-500"
                                id="radio-button"
                                value={option.value}
                                checked={selectedValue === option.value}
                                onChange={handleChange}
                            />
                            <span className="ml-3 text-sm font-medium text-gray-500">{option.label}</span>
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};

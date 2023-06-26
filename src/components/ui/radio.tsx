import type { ForwardedRef, InputHTMLAttributes } from 'react';
import { forwardRef, useState } from 'react';
interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    options: { label: string; value: string }[];
    onValueChange: (newValue: string) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

function RadioWithRef({ label, options, onValueChange, onKeyDown }: RadioProps, ref: ForwardedRef<HTMLInputElement>) {
    const [selectedValue, setSelectedValue] = useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedValue(event.target.value);
        onValueChange(event.target.value);
    };

    return (
        <div className="flex flex-col">
            <div className="text-sm font-semibold text-gray-800">{label}</div>
            <div className="my-2 flex justify-between space-x-5">
                {options.map((option, index) => (
                    <div className="flex flex-grow whitespace-nowrap" key={index}>
                        <label className="flex w-full rounded-md border border-gray-200 bg-white p-3 focus:border-primary-500 focus:ring-primary-500">
                            <input
                                type="radio"
                                name="radio-button"
                                className="pointer-events-none mt-0.5 rounded-full border-gray-200 text-primary-600 focus:ring-primary-500"
                                id="radio-button"
                                value={option.value}
                                checked={selectedValue === option.value}
                                onChange={handleChange}
                                ref={ref}
                                onKeyDown={onKeyDown}
                            />
                            <span className="ml-3 text-sm font-medium text-gray-500">{option.label}</span>
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
}
export const Radio = forwardRef(RadioWithRef);

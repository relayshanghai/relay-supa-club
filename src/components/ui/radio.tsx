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
            <div className="my-2 flex justify-between space-x-3">
                {options.map((option, index) => (
                    <div className="flex whitespace-nowrap rounded-md border border-gray-200 bg-white p-3" key={index}>
                        <input
                            type="radio"
                            name="radio-button"
                            id="radio-button"
                            className="mt-1 rounded-full border-2 border-gray-200 text-primary-600 focus:ring-1 focus:ring-primary-500"
                            value={option.value}
                            checked={selectedValue === option.value}
                            onChange={handleChange}
                            ref={ref}
                            onKeyDown={onKeyDown}
                        />
                        <label
                            className="ml-2 flex w-full rounded-md border-none text-base font-medium"
                            htmlFor="radio-button"
                        >
                            {option.label}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
}
export const Radio = forwardRef(RadioWithRef);

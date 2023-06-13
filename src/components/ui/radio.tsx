import type { InputHTMLAttributes } from 'react';

interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    options: { label: string; value: string }[];
}

export const Radio = ({ label, options }: RadioProps) => (
    <div className="flex flex-col">
        <div className="text-xs font-bold text-gray-500">{label}</div>
        <div className="my-2 flex justify-between">
            {options.map((option, index) => (
                <div className="flex" key={index}>
                    <label className="flex w-full rounded-md border border-gray-200 bg-white px-2 py-3 focus:border-primary-500 focus:ring-primary-500">
                        <input
                            type="radio"
                            name="radio-button"
                            className="pointer-events-none mt-0.5 shrink-0 rounded-full border-gray-200 text-primary-600 focus:ring-primary-500"
                            id="radio-button"
                            value={option.value}
                        />
                        <span className="ml-3 text-sm text-gray-500 ">{option.label}</span>
                    </label>
                </div>
            ))}
        </div>
    </div>
);

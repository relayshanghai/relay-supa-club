import { InputHTMLAttributes } from 'react';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'placeholder'> {
    label: string;
    error?: string | null;
    note?: string | null;
    placeholder?: string | null;
}

export const Input = ({ label, error, note, placeholder, ...rest }: InputProps) => {
    return (
        <label className="flex flex-col text-xs text-gray-500 font-bold w-full">
            <div>
                {label}
                {rest.required ? <span className="text-xs ml-1 text-primary-500">*</span> : null}
            </div>
            <input
                placeholder={placeholder || ''}
                className={`ring-opacity-5 placeholder-gray-400 appearance-none bg-white rounded-md block w-full px-3 py-2 border border-transparent shadow ring-1 sm:text-sm focus:border-primary-500 focus:ring-primary-500 focus:outline-none my-2 ${
                    rest.disabled
                        ? 'bg-gray-100 cursor-not-allowed text-gray-500 ring-gray-500'
                        : 'text-gray-900 ring-gray-900'
                }`}
                {...rest}
            />
            <span>
                {error ? (
                    <p className="text-red-500 text-xs">{error}</p>
                ) : note ? (
                    <p className="text-xs text-gray-400">{note}</p>
                ) : (
                    <p className="text-xs">&nbsp;</p>
                )}
            </span>
        </label>
    );
};

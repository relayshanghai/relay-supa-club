import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import type { ForwardedRef, HTMLInputTypeAttribute, InputHTMLAttributes } from 'react';
import { Input as ShadcnInput } from 'shadcn/components/ui/input';
import { forwardRef, useState } from 'react';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'placeholder'> {
    label: string;
    error?: string | null;
    note?: string | null;
    placeholder?: string | null;
    type?: HTMLInputTypeAttribute;
    isRelative?: boolean; // <- toggle relative positioning
    loading?: boolean;
}

function InputWithRef(
    { label, error, note, placeholder, type = 'text', isRelative = true, ...rest }: InputProps,
    ref: ForwardedRef<HTMLInputElement>,
) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

    return (
        <label className="flex w-full flex-col text-sm text-gray-800">
            <div className="text-sm font-medium text-gray-700">
                {label}
                {rest.required ? <span className="ml-1 text-xs text-primary-500">*</span> : null}
            </div>
            <div className={`${isRelative ? 'relative' : ''}`}>
                <ShadcnInput
                    ref={ref}
                    placeholder={placeholder || ''}
                    className={`my-2 block w-full appearance-none rounded-md border border-transparent bg-white px-3 py-2 placeholder-gray-400 shadow ring-1 ring-opacity-5 ${
                        error ? 'focus:border-red-500' : 'focus:border-primary-500'
                    } focus:outline-none ${
                        error
                            ? 'focus:ring-red-500 focus-visible:ring-red-500'
                            : 'focus:ring-primary-500 focus-visible:ring-primary-500'
                    } ${
                        rest.disabled
                            ? 'cursor-not-allowed bg-gray-100 text-gray-500 ring-gray-500'
                            : 'text-gray-900 ring-gray-900'
                    }`}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') e.preventDefault();
                    }}
                    {...rest}
                    type={isPasswordVisible ? 'text' : type}
                />
                {type === 'password' && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer">
                        {isPasswordVisible ? (
                            <EyeSlashIcon className="h-5 w-5 text-gray-300" onClick={togglePasswordVisibility} />
                        ) : (
                            <EyeIcon className="h-5 w-5 text-gray-300" onClick={togglePasswordVisibility} />
                        )}
                    </div>
                )}
            </div>
            <span>
                {error ? (
                    <p className="mb-4 text-xs text-red-500">{error}</p>
                ) : note ? (
                    <p className="text-xs text-gray-400">{note}</p>
                ) : (
                    <p className="text-xs">&nbsp;</p>
                )}
            </span>
        </label>
    );
}

export const Input = forwardRef(InputWithRef);

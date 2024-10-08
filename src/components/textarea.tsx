import type { TextareaHTMLAttributes } from 'react';

export const InputTextArea = ({ label, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) => {
    return (
        <label className="flex w-full flex-col text-xs text-gray-500">
            <div className="font-bold">
                {label}
                {rest.required ? <span className="ml-1 text-xs text-primary-500">*</span> : null}
            </div>
            <textarea
                className={`my-2 block w-full appearance-none rounded-md border border-transparent bg-white px-3 py-2 placeholder-gray-400 shadow ring-1 ring-opacity-5 focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-xs ${
                    rest.disabled
                        ? 'cursor-not-allowed bg-gray-100 text-gray-500 ring-gray-500'
                        : 'text-gray-900 ring-gray-900'
                }`}
                {...rest}
            />
        </label>
    );
};

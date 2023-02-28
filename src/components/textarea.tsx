import { TextareaHTMLAttributes } from 'react';

export const InputTextArea = ({
    label,
    ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) => {
    return (
        <label className="flex flex-col text-xs text-gray-500 w-full">
            <div className="font-bold">
                {label}
                {rest.required ? <span className="text-xs ml-1 text-primary-500">*</span> : null}
            </div>
            <textarea
                className={`ring-opacity-5 placeholder-gray-400 appearance-none bg-white rounded-md block w-full px-3 py-2 border border-transparent shadow ring-1 sm:text-xs focus:border-primary-500 focus:ring-primary-500 focus:outline-none my-2 ${
                    rest.disabled
                        ? 'bg-gray-100 cursor-not-allowed text-gray-500 ring-gray-500'
                        : 'text-gray-900 ring-gray-900'
                }`}
                {...rest}
            />
        </label>
    );
};

import type { DetailedHTMLProps, InputHTMLAttributes } from 'react';

interface SwitchProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    beforeLabel?: string;
    afterLabel?: string;
    wrapperClassName?: string;
}

export const Switch = ({ beforeLabel, afterLabel, wrapperClassName, className, ...props }: SwitchProps) => {
    return (
        <div className={`flex items-center ${wrapperClassName}`}>
            {beforeLabel && <label className="mr-3 font-medium text-gray-500">{beforeLabel}</label>}
            <input
                type="checkbox"
                className={`relative h-7 w-[3.25rem] shrink-0 cursor-pointer appearance-none rounded-full border-2 border-transparent bg-gray-100 text-transparent outline-1 outline-red-500 ring-1 ring-gray-200 ring-offset-white transition-colors duration-200 ease-in-out before:inline-block before:h-6 before:w-6 before:translate-x-0 before:transform before:rounded-full before:bg-white before:shadow before:ring-0 before:transition before:duration-200 before:ease-in-out checked:bg-primary-50 checked:ring-primary-100 checked:before:translate-x-full checked:before:bg-primary-500 checked:before:shadow-primary-300 ${className}`}
                {...props}
            />
            {afterLabel && <label className="ml-3 font-medium text-gray-500">{afterLabel}</label>}
        </div>
    );
};

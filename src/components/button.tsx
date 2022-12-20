import { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
    className?: string;
}

const defaultClasses =
    'text-sm px-4 py-2 rounded-md cursor-pointer flex-shrink-0 duration-300 font-bold disabled:bg-gray-300 disabled:cursor-default ';
const primaryClasses = 'text-white bg-primary-500 hover:bg-primary-700';
const secondaryClasses =
    'text-primary-500 bg-white border-primary-500 border hover:bg-primary-700/10';

export const Button = ({ children, variant, className, ...rest }: ButtonProps) => {
    return (
        <button
            className={`${defaultClasses} ${
                variant === 'secondary' ? secondaryClasses : primaryClasses
            } ${className}`}
            {...rest}
        >
            {children}
        </button>
    );
};

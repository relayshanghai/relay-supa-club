import { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'neutral';
}

const defaultClasses =
    'text-sm px-4 py-2 rounded-md flex-shrink-0 font-bold disabled:bg-gray-300 border-primary-500 border disabled:cursor-default disabled:border-gray-300';
const primaryClasses = 'text-white bg-primary-500 hover:bg-primary-700';
const secondaryClasses = 'text-primary-500 bg-white border-primary-500 border hover:bg-primary-100';
/** override default browser styles */
const neutralClasses = 'text-left';

/**
 * @param className additional classes to add to the button
 *
 * @note If you want to change one of the already applied css styles in the passed in className, you might need to use !important. e.g. className="!py-4"
 */
export const Button = ({ children, variant, className, ...rest }: ButtonProps) => {
    return (
        <button
            className={
                variant === 'neutral'
                    ? `${neutralClasses} ${className}`
                    : `${defaultClasses} ${
                          variant === 'secondary' ? secondaryClasses : primaryClasses
                      } ${className}`
            }
            {...rest}
        >
            {children}
        </button>
    );
};

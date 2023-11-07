import { forwardRef, type ButtonHTMLAttributes, type ForwardedRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'neutral' | 'gray';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
}

const defaultClasses =
    'text-sm px-4 py-[.75em] rounded-md flex-shrink-0 font-medium disabled:bg-gray-300  border disabled:cursor-default disabled:border-gray-300 disabled:text-gray-500';
const primaryClasses = 'border-primary-500 text-white bg-primary-500 hover:bg-primary-700';
const secondaryClasses = 'text-primary-500 bg-white border-primary-500 border hover:bg-primary-100';
const ghostClasses =
    'text-primary-500 bg-primary-50 border-primary-50 hover:bg-primary-100 border-primary-50 hover:border-primary-100';
/** override default browser styles */
const neutralClasses = 'text-left';
const grayClasses = 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50';

/**
 * @param className additional classes to add to the button
 *
 * @note If you want to change one of the already applied css styles in the passed in className, you might need to use !important. e.g. className="!py-4"
 */
function ButtonWithRef({ children, variant, className, ...rest }: ButtonProps, ref: ForwardedRef<HTMLButtonElement>) {
    const variantClasses =
        variant === 'secondary'
            ? secondaryClasses
            : variant === 'ghost'
            ? ghostClasses
            : variant === 'gray'
            ? grayClasses
            : primaryClasses;

    return (
        <button
            ref={ref}
            className={`
                ${variant === 'neutral' ? `${neutralClasses}` : `${defaultClasses} ${variantClasses}`} ${className} `}
            {...rest}
        >
            {children}
        </button>
    );
}
export const Button = forwardRef(ButtonWithRef);

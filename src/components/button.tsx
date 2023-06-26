import { forwardRef, type ButtonHTMLAttributes, type ForwardedRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'neutral';
}

const defaultClasses =
    'text-sm px-4 py-[.75em] rounded-md flex-shrink-0 font-medium disabled:bg-gray-300 border-primary-500 border disabled:cursor-default disabled:border-gray-300 disabled:text-gray-500';
const primaryClasses = 'text-white bg-primary-500 hover:bg-primary-700';
const secondaryClasses = 'text-primary-500 bg-white border-primary-500 border hover:bg-primary-100';
/** override default browser styles */
const neutralClasses = 'text-left';

/**
 * @param className additional classes to add to the button
 *
 * @note If you want to change one of the already applied css styles in the passed in className, you might need to use !important. e.g. className="!py-4"
 */
function ButtonWithRef({ children, variant, className, ...rest }: ButtonProps, ref: ForwardedRef<HTMLButtonElement>) {
    return (
        <button
            ref={ref}
            className={`
                ${
                    variant === 'neutral'
                        ? `${neutralClasses}`
                        : `${defaultClasses} ${variant === 'secondary' ? secondaryClasses : primaryClasses}`
                }  ${className}`}
            {...rest}
        >
            {children}
        </button>
    );
}
export const Button = forwardRef(ButtonWithRef);

import { forwardRef, type ButtonHTMLAttributes, type ForwardedRef } from 'react';
import { Spinner } from '../icons';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'neutral' | 'gray';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    loading?: boolean;
}

const defaultClasses =
    'text-sm px-4 py-[.75em] rounded-md flex-shrink-0 font-medium disabled:bg-gray-300  border disabled:cursor-default disabled:border-gray-300 disabled:text-gray-500';
const primaryClasses = 'border-primary-600 text-white bg-primary-600 hover:bg-primary-700';
const secondaryClasses = 'text-primary-600 bg-white border-primary-600 border hover:bg-primary-100';
const ghostClasses =
    'text-primary-600 bg-primary-50 border-primary-50 hover:bg-primary-100 border-primary-50 hover:border-primary-100';
/** override default browser styles */
const neutralClasses = 'text-left';
const grayClasses = 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50';

/**
 * @param className additional classes to add to the button
 *
 * @note If you want to change one of the already applied css styles in the passed in className, you might need to use !important. e.g. className="!py-4"
 */
function ButtonWithRef(
    { children, variant, className, loading, ...rest }: ButtonProps,
    ref: ForwardedRef<HTMLButtonElement>,
) {
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
            {loading}
            {loading ? (
                <div className="flex items-center justify-center">
                    <Spinner className="h-5 w-5 fill-primary-600 text-white" />
                </div>
            ) : (
                children
            )}
        </button>
    );
}
export const Default = forwardRef(ButtonWithRef);

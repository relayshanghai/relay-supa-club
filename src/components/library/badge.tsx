import type { DetailedHTMLProps, HTMLAttributes } from 'react';

type Size = 'small' | 'medium' | 'large';
// type Variant = 'solid';
type Span = DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;

export interface BadgeProps extends Span {
    size?: Size;
    // variant?: Variant;
}

export const Badge = ({
    children,
    size = 'medium',
    // variant = 'solid',
    className,
    ...props
}: BadgeProps) => {
    const px = size === 'small' ? 1 : size === 'medium' ? 3 : 4;
    const py = size === 'small' ? 0 : size === 'medium' ? 1 : 2;
    const fontSize = size === 'small' ? '[font-size:0.625rem]' : size === 'medium' ? 'text-sm' : 'text-sm';
    return (
        <span
            className={`group/tooltip relative inline-flex items-center gap-1.5 self-center rounded-md bg-primary-500 py-${py} px-${px} ${fontSize} text-xs font-medium text-white ${className}`}
            {...props}
        >
            {children}
        </span>
    );
};

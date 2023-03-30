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
    ...props
}: BadgeProps) => {
    const px = size === 'small' ? 2 : size === 'medium' ? 3 : 4;
    const py = size === 'small' ? 1 : size === 'medium' ? 1.5 : 2;
    const text = size === 'small' ? 'xs' : 'md';
    return (
        <span
            className={`inline-flex items-center gap-1.5 self-center rounded-md bg-primary-500 py-${py} px-${px} text-${text} font-medium text-white`}
            {...props}
        >
            {children}
        </span>
    );
};

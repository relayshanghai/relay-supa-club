import type { DetailedHTMLProps, HTMLAttributes } from 'react';

type Size = 'small' | 'medium' | 'large';
type Variant = 'solid' | 'soft';
type Span = DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;

export interface BadgeProps extends Span {
    size?: Size;
    variant?: Variant;
    roundSize?: number;
}

export const Badge = ({ children, size = 'medium', variant = 'solid', className, roundSize, ...props }: BadgeProps) => {
    const background = variant === 'solid' ? 'bg-primary-500' : 'bg-primary-100';
    const color = variant === 'solid' ? 'text-white' : 'text-primary-500';
    const rounding = roundSize ? 'rounded-full' : 'rounded-md';

    const paddingSizes = {
        medium: 'py-1 px-3',
        small: 'py-0 px-1',
        large: 'py-2 px-4',
    };
    const fontSizes = {
        medium: 'text-sm',
        small: 'text-xs',
        large: 'text-lg',
    };

    return (
        <span
            className={`inline-flex select-none items-center justify-center gap-1.5 self-center ${rounding} ${background} ${
                paddingSizes[size]
            } ${fontSizes[size]} text-xs font-medium ${color} ${
                roundSize ? `h-${roundSize} w-${roundSize}` : ''
            } ${className}`}
            {...props}
        >
            {children}
        </span>
    );
};

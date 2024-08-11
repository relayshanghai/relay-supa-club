import type { SVGProps } from 'react';

const CheckIcon = ({ className, ...props }: SVGProps<SVGSVGElement>) => (
    <svg
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
        className={`h-3 w-3 ${className}`}
        viewBox="0 0 24 24"
        {...props}
    >
        <path d="M20 6L9 17l-5-5" />
    </svg>
);
export default CheckIcon;

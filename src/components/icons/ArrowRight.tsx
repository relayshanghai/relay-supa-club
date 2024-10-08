import type { SVGProps } from 'react';

export default function ArrowRight({ ...props }: SVGProps<SVGSVGElement>) {
    return (
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M13.5 4.5L21 12M21 12L13.5 19.5M21 12H3"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

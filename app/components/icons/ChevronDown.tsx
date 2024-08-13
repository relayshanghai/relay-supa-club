import type { SVGProps } from 'react';

export default function ChevronLeft(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            strokeWidth={1.5}
            stroke="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            {...props}
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
    );
}

import type { SVGProps } from 'react';

export default function ChevronLeft(props: SVGProps<SVGSVGElement>) {
    return (
        <svg strokeWidth={1.5} stroke="currentColor" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
                fill="currentColor"
            />
        </svg>
    );
}

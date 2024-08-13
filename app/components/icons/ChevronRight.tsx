import type { SVGProps } from 'react';

export default function ChevronRight(props: SVGProps<SVGSVGElement>) {
    return (
        <svg strokeWidth={1.5} stroke="currentColor" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
                fill="currentColor"
            />
        </svg>
    );
}

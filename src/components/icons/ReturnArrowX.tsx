import type { SVGProps } from 'react';

export default function ReturnArrowX(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 15" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M23 1L20 4M20 4L17 7M20 4L17 1M20 4L23 7M14.5 5H1M1 5L5 1M1 5L5 9M10 14H14.5C16.9853 14 19 11.9853 19 9.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

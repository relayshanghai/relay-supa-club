import type { SVGProps } from 'react';

export default function Expand(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M7 5L10.5 1.5M10.5 1.5H7.5M10.5 1.5V4.5M5 7L1.5 10.5M1.5 10.5H4.5M1.5 10.5L1.5 7.5"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

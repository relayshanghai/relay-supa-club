import type { SVGProps } from 'react';

export default function Coins(props: SVGProps<SVGSVGElement>) {
    return (
        <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M21 12C21 17.5228 16.5228 22 11 22C5.47715 22 1 17.5228 1 12C1 6.47715 5.47715 2 11 2M11 6V12L15 14M22 1L19 4M19 4L16 7M19 4L16 1M19 4L22 7"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

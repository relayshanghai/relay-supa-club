import type { SVGProps } from 'react';

export default function Collapse(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M1.33333 7.16667H4.83333M4.83333 7.16667V10.6667M4.83333 7.16667L0.75 11.25M10.6667 4.83333H7.16667M7.16667 4.83333V1.33333M7.16667 4.83333L11.25 0.75"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

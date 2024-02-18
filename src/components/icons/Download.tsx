import type { SVGProps } from 'react';

export default function Download(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M4.83301 8.00065L7.49967 10.6673M7.49967 10.6673L10.1663 8.00065M7.49967 10.6673V5.33398M14.1663 8.00065C14.1663 11.6826 11.1816 14.6673 7.49967 14.6673C3.81778 14.6673 0.833008 11.6826 0.833008 8.00065C0.833008 4.31875 3.81778 1.33398 7.49967 1.33398C11.1816 1.33398 14.1663 4.31875 14.1663 8.00065Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

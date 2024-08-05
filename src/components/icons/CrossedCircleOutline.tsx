import type { SVGProps } from 'react';

export default function CrossedCircleOutline(props: SVGProps<SVGSVGElement>) {
    return (
        <svg fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                id="Icon"
                d="M9.9987 6.00065L5.9987 10.0007M5.9987 6.00065L9.9987 10.0007M14.6654 8.00065C14.6654 11.6826 11.6806 14.6673 7.9987 14.6673C4.3168 14.6673 1.33203 11.6826 1.33203 8.00065C1.33203 4.31875 4.3168 1.33398 7.9987 1.33398C11.6806 1.33398 14.6654 4.31875 14.6654 8.00065Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

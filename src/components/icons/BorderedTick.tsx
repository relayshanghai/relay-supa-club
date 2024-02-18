import type { SVGProps } from 'react';

export default function BorderedTick(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M4.99967 8.00065L6.99967 10.0007L10.9997 6.00065M14.6663 8.00065C14.6663 11.6826 11.6816 14.6673 7.99967 14.6673C4.31778 14.6673 1.33301 11.6826 1.33301 8.00065C1.33301 4.31875 4.31778 1.33398 7.99967 1.33398C11.6816 1.33398 14.6663 4.31875 14.6663 8.00065Z"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

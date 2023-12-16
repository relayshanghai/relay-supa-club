import type { SVGProps } from 'react';

export default function Posted(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M2.66732 9.82815C1.86333 9.28998 1.33398 8.37347 1.33398 7.33333C1.33398 5.77095 2.52832 4.48753 4.05381 4.34625C4.36586 2.44809 6.01415 1 8.00065 1C9.98716 1 11.6354 2.44809 11.9475 4.34625C13.473 4.48753 14.6673 5.77095 14.6673 7.33333C14.6673 8.37347 14.138 9.28998 13.334 9.82815M5.33398 9.66667L8.00065 7M8.00065 7L10.6673 9.66667M8.00065 7V13"
                strokeWidth="0.75"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

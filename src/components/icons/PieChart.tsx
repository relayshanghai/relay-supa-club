import type { SVGProps } from 'react';

export default function PieChart(props: SVGProps<SVGSVGElement>) {
    return (
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M10.5 6C6.35786 6 3 9.35786 3 13.5C3 17.6421 6.35786 21 10.5 21C14.6421 21 18 17.6421 18 13.5H10.5V6Z"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M13.5 10.5H21C21 6.35786 17.6421 3 13.5 3V10.5Z"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

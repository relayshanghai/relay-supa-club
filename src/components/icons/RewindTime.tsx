import type { SVGProps } from 'react';

export default function RewindTime(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M18.9166 11.25L17.2505 9.58333L15.5833 11.25M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C12.7516 2.5 15.1571 3.98178 16.4621 6.19091M10 5.83333V10L12.5 11.6667"
                stroke="#6B7280"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
    );
}

import type { SVGProps } from 'react';

export default function Drag(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M8 2.5V1M4.06066 4.06066L3 3M4.06066 12L3 13.0607M12 4.06066L13.0607 3M2.5 8H1M7.5 7.5L11.6111 20.2778L14.5 17.3889L18.1111 21L21 18.1111L17.3889 14.5L20.2778 11.6111L7.5 7.5Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

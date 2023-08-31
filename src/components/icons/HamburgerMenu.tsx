import type { SVGProps } from 'react';

export default function SVG(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path d="M1 7H19M1 1H19M1 13H19" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

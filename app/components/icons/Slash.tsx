import type { SVGProps } from 'react';

export default function Slash(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path d="M6 13L10 3" stroke="currentColor" strokeLinecap="round" />
        </svg>
    );
}

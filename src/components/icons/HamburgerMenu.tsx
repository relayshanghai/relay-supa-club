import { SVGProps } from 'react';

export default function SVG(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="-2.5 0 19 19" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M.789 4.836a1.03 1.03 0 011.03-1.029h10.363a1.03 1.03 0 110 2.059H1.818A1.03 1.03 0 01.79 4.836zm12.422 4.347a1.03 1.03 0 01-1.03 1.029H1.819a1.03 1.03 0 010-2.059h10.364a1.03 1.03 0 011.029 1.03zm0 4.345a1.03 1.03 0 01-1.03 1.03H1.819a1.03 1.03 0 110-2.059h10.364a1.03 1.03 0 011.029 1.03z"
                fill="currentColor"
            />
        </svg>
    );
}

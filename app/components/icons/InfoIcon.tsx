import type { SVGProps } from 'react';

const InfoIcon = ({ className, ...props }: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 21 20" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.151 7a1 1 0 11.001-2 1 1 0 010 2zm1 7a1 1 0 01-2 0V9a1 1 0 012 0v5zm-1-14c-5.523 0-10 4.477-10 10s4.477 10 10 10c5.522 0 10-4.477 10-10s-4.478-10-10-10z"
            fill="currentColor"
        />
    </svg>
);
export default InfoIcon;

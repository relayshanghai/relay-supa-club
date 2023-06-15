import type { SVGProps } from 'react';

const CrossIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2.151 10c0-1.846.635-3.542 1.688-4.897l11.21 11.209A7.948 7.948 0 0110.15 18c-4.41 0-8-3.589-8-8zm16 0a7.954 7.954 0 01-1.688 4.897L5.254 3.688A7.948 7.948 0 0110.151 2c4.411 0 8 3.589 8 8zm-8-10c-5.514 0-10 4.486-10 10s4.486 10 10 10 10-4.486 10-10-4.486-10-10-10z"
            fill="currentColor"
        />
    </svg>
);
export default CrossIcon;

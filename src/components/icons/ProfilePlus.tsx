import type { SVGProps } from 'react';

const PlusIcon = ({ ...props }: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path
            d="M15.8337 16.5V11.5M13.3337 14H18.3337M10.0003 11.5H6.66699C5.11385 11.5 4.33728 11.5 3.72471 11.7537C2.90795 12.092 2.25904 12.741 1.92073 13.5577C1.66699 14.1703 1.66699 14.9469 1.66699 16.5M12.917 1.7423C14.1386 2.23679 15.0003 3.43443 15.0003 4.83333C15.0003 6.23224 14.1386 7.42988 12.917 7.92437M11.2503 4.83333C11.2503 6.67428 9.75794 8.16667 7.91699 8.16667C6.07604 8.16667 4.58366 6.67428 4.58366 4.83333C4.58366 2.99238 6.07604 1.5 7.91699 1.5C9.75794 1.5 11.2503 2.99238 11.2503 4.83333Z"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);
export default PlusIcon;

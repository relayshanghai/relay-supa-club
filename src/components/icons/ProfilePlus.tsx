import type { SVGProps } from 'react';

const ProfilePlus = ({ ...props }: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path
            d="M15.8327 16.5V11.5M13.3327 14H18.3327M9.99935 11.5H6.66602C5.11288 11.5 4.33631 11.5 3.72374 11.7537C2.90698 12.092 2.25806 12.741 1.91975 13.5577C1.66602 14.1703 1.66602 14.9469 1.66602 16.5M12.916 1.7423C14.1376 2.23679 14.9993 3.43443 14.9993 4.83333C14.9993 6.23224 14.1376 7.42988 12.916 7.92437M11.2493 4.83333C11.2493 6.67428 9.75697 8.16667 7.91602 8.16667C6.07507 8.16667 4.58268 6.67428 4.58268 4.83333C4.58268 2.99238 6.07507 1.5 7.91602 1.5C9.75697 1.5 11.2493 2.99238 11.2493 4.83333Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);
export default ProfilePlus;

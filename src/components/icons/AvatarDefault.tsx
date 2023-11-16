import type { SVGProps } from 'react';

export default function AvatarDefault(props: SVGProps<SVGSVGElement>) {
    return (
        <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <rect width="160" height="160" fill="#F3F4F6" />
            <path
                d="M113.333 117.5C113.333 111.685 113.333 108.778 112.616 106.412C111 101.085 106.831 96.9168 101.505 95.301C99.1388 94.5833 96.2313 94.5833 90.4165 94.5833H69.5832C63.7683 94.5833 60.8609 94.5833 58.4951 95.301C53.1684 96.9168 49 101.085 47.3842 106.412C46.6665 108.778 46.6665 111.685 46.6665 117.5M98.7498 61.25C98.7498 71.6053 90.3552 80 79.9998 80C69.6445 80 61.2498 71.6053 61.2498 61.25C61.2498 50.8947 69.6445 42.5 79.9998 42.5C90.3552 42.5 98.7498 50.8947 98.7498 61.25Z"
                stroke="#9CA3AF"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

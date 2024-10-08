import type { SVGProps } from 'react';

export default function Compass({ ...props }: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M10.0003 18.3337C14.6027 18.3337 18.3337 14.6027 18.3337 10.0003C18.3337 5.39795 14.6027 1.66699 10.0003 1.66699C5.39795 1.66699 1.66699 5.39795 1.66699 10.0003C1.66699 14.6027 5.39795 18.3337 10.0003 18.3337Z"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M12.2687 6.88863C12.6759 6.75292 12.8794 6.68507 13.0148 6.73334C13.1326 6.77535 13.2253 6.86805 13.2673 6.98585C13.3156 7.12122 13.2477 7.32478 13.112 7.7319L11.8724 11.4508C11.8338 11.5667 11.8144 11.6247 11.7815 11.6728C11.7523 11.7155 11.7155 11.7523 11.6728 11.7815C11.6247 11.8144 11.5667 11.8338 11.4508 11.8724L7.7319 13.112C7.32478 13.2477 7.12122 13.3156 6.98585 13.2673C6.86805 13.2253 6.77535 13.1326 6.73334 13.0148C6.68507 12.8794 6.75292 12.6759 6.88863 12.2687L8.12825 8.54989C8.1669 8.43394 8.18622 8.37596 8.21916 8.32782C8.24833 8.28517 8.28517 8.24833 8.32782 8.21916C8.37596 8.18622 8.43394 8.1669 8.54989 8.12825L12.2687 6.88863Z"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

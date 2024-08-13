import type { SVGProps } from 'react';

export default function ProfileSilhouette(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <g id="icon">
                <path
                    d="M16.6668 17.5C16.6668 16.337 16.6668 15.7555 16.5233 15.2824C16.2001 14.217 15.3664 13.3834 14.3011 13.0602C13.828 12.9167 13.2465 12.9167 12.0835 12.9167H7.91683C6.75386 12.9167 6.17237 12.9167 5.69921 13.0602C4.63388 13.3834 3.8002 14.217 3.47703 15.2824C3.3335 15.7555 3.3335 16.337 3.3335 17.5M13.7502 6.25C13.7502 8.32107 12.0712 10 10.0002 10C7.92909 10 6.25016 8.32107 6.25016 6.25C6.25016 4.17893 7.92909 2.5 10.0002 2.5C12.0712 2.5 13.7502 4.17893 13.7502 6.25Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </g>
        </svg>
    );
}

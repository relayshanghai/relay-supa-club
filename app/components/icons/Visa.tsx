import type { SVGProps } from 'react';

export default function Visa(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 46 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <g id="Payment method icon">
                <rect x="0.5" y="0.5" width="45" height="31" rx="5.5" fill="#FEFEFE" />
                <rect x="0.5" y="0.5" width="45" height="31" rx="5.5" stroke="#F2F4F7" />
                <path
                    id="visa-logo"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M14.3341 21.1441H11.5877L9.52833 13.0563C9.43058 12.6843 9.22304 12.3554 8.91774 12.2003C8.15584 11.8108 7.31628 11.5007 6.40039 11.3444V11.033H10.8245C11.4351 11.033 11.893 11.5007 11.9694 12.044L13.0379 17.878L15.7829 11.033H18.4529L14.3341 21.1441ZM19.9794 21.1441H17.3857L19.5214 11.033H22.1151L19.9794 21.1441ZM25.4707 13.8341C25.547 13.2895 26.0049 12.9781 26.5392 12.9781C27.3788 12.8999 28.2933 13.0563 29.0565 13.4445L29.5145 11.2676C28.7512 10.9562 27.9117 10.7998 27.1498 10.7998C24.6324 10.7998 22.8007 12.2003 22.8007 14.1441C22.8007 15.6228 24.0982 16.3993 25.0141 16.867C26.0049 17.3334 26.3865 17.6448 26.3102 18.1112C26.3102 18.8108 25.547 19.1222 24.7851 19.1222C23.8692 19.1222 22.9533 18.889 22.1151 18.4994L21.6571 20.6777C22.573 21.066 23.5639 21.2223 24.4798 21.2223C27.3024 21.2992 29.0565 19.9 29.0565 17.7998C29.0565 15.1551 25.4707 15.0001 25.4707 13.8341ZM38.1337 21.1441L36.0743 11.033H33.8623C33.4043 11.033 32.9464 11.3444 32.7937 11.8108L28.9802 21.1441H31.6502L32.1831 19.6668H35.4637L35.769 21.1441H38.1337ZM34.2439 13.7559L35.0058 17.5666H32.8701L34.2439 13.7559Z"
                    fill="#172B85"
                />
            </g>
        </svg>
    );
}
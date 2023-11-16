import type { SVGProps } from 'react';

const ReportOutline = (props: SVGProps<SVGSVGElement>) => {
    return (
        <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <g clipPath="url(#prefix__clip0_2051_5012)">
                <path
                    d="M17.5 5.355v-3.75m0 0h-3.75m3.75 0l-2.5 2.5-1.666 1.667m3.333 2.978v6c0 1.4 0 1.684-.273 2.218a2.5 2.5 0 01-1.092 1.093c-.535.272-1.235.272-2.635.272H7.334c-1.4 0-2.1 0-2.635-.272a2.5 2.5 0 01-1.093-1.093c-.272-.534-.272-1.235-.272-2.635l.061-7.894c0-1.4 0-2.1.273-2.635A2.5 2.5 0 014.76 2.71c.535-.272 1.235-.272 2.635-.272H10M6.667 12.5V15m6.667-5.417V15M10 7.917V15"
                    stroke="#98A2B3"
                    strokeWidth={1.667}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </g>
            <defs>
                <clipPath id="prefix__clip0_2051_5012">
                    <path fill="#fff" d="M0 0h20v20H0z" />
                </clipPath>
            </defs>
        </svg>
    );
};

export default ReportOutline;

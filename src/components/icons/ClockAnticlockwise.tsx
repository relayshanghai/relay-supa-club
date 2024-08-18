import type { SVGProps } from 'react';

export default function ClockAnticlockwise({ ...props }: SVGProps<SVGSVGElement>) {
    return (
        <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M12.2416 6.875L11.0753 5.70833L9.9083 6.875M11.25 6C11.25 8.89949 8.89949 11.25 6 11.25C3.1005 11.25 0.75 8.89949 0.75 6C0.75 3.1005 3.1005 0.75 6 0.75C7.92612 0.75 9.60997 1.78725 10.5235 3.33364M6 3.08333V6L7.75 7.16667"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

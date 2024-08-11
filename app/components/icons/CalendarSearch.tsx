import type { SVGProps } from 'react';

export default function CalendarSearch(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 21 23" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M20 22L18.0667 20.0667M19 9H1M19 9V7.8C19 6.11984 19 5.27976 18.673 4.63803C18.3854 4.07354 17.9265 3.6146 17.362 3.32698C16.7202 3 15.8802 3 14.2 3H14M19 9V11.5M1 9V16.2C1 17.8802 1 18.7202 1.32698 19.362C1.6146 19.9265 2.07354 20.3854 2.63803 20.673C3.27976 21 4.11984 21 5.8 21H10M1 9V7.8C1 6.11984 1 5.27976 1.32698 4.63803C1.6146 4.07354 2.07354 3.6146 2.63803 3.32698C3.27976 3 4.11984 3 5.8 3H6M6 3H14M6 3V1M6 3V5M14 3V1M14 3V5M19.1111 17.5556C19.1111 19.5192 17.5192 21.1111 15.5556 21.1111C13.5919 21.1111 12 19.5192 12 17.5556C12 15.5919 13.5919 14 15.5556 14C17.5192 14 19.1111 15.5919 19.1111 17.5556Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

import type { SVGProps } from 'react';

export default function Coins(props: SVGProps<SVGSVGElement>) {
    return (
        <svg width="22" height="21" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M11 15C11 17.7614 13.2386 20 16 20C18.7614 20 21 17.7614 21 15C21 12.2386 18.7614 10 16 10C13.2386 10 11 12.2386 11 15ZM11 15C11 13.8742 11.3721 12.8353 12 11.9995V3M11 15C11 15.8254 11.2 16.604 11.5541 17.2901C10.7117 18.0018 8.76584 18.5 6.5 18.5C3.46243 18.5 1 17.6046 1 16.5V3M12 3C12 4.10457 9.53757 5 6.5 5C3.46243 5 1 4.10457 1 3M12 3C12 1.89543 9.53757 1 6.5 1C3.46243 1 1 1.89543 1 3M1 12C1 13.1046 3.46243 14 6.5 14C8.689 14 10.5793 13.535 11.4646 12.8618M12 7.5C12 8.60457 9.53757 9.5 6.5 9.5C3.46243 9.5 1 8.60457 1 7.5"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

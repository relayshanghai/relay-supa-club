import type { SVGProps } from 'react';

const Setings = (props: SVGProps<SVGSVGElement>) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none" {...props}>
            <path
                d="M3 19.5L3 13.5M3 13.5C4.10457 13.5 5 12.6046 5 11.5C5 10.3954 4.10457 9.5 3 9.5C1.89543 9.5 1 10.3954 1 11.5C1 12.6046 1.89543 13.5 3 13.5ZM3 5.5V1.5M10 19.5V13.5M10 5.5V1.5M10 5.5C8.89543 5.5 8 6.39543 8 7.5C8 8.60457 8.89543 9.5 10 9.5C11.1046 9.5 12 8.60457 12 7.5C12 6.39543 11.1046 5.5 10 5.5ZM17 19.5V15.5M17 15.5C18.1046 15.5 19 14.6046 19 13.5C19 12.3954 18.1046 11.5 17 11.5C15.8954 11.5 15 12.3954 15 13.5C15 14.6046 15.8954 15.5 17 15.5ZM17 7.5V1.5"
                stroke="#7C3AED"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default Setings;

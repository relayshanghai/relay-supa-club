import type { SVGProps } from 'react';

export default function RingingBell({ ...props }: SVGProps<SVGSVGElement>) {
    return (
        <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M8.2508 11.0832C8.2508 12.0497 7.46729 12.8332 6.5008 12.8332C5.5343 12.8332 4.7508 12.0497 4.7508 11.0832M7.54876 3.639C7.80279 3.37654 7.95913 3.01895 7.95913 2.62484C7.95913 1.81942 7.30621 1.1665 6.5008 1.1665C5.69538 1.1665 5.04246 1.81942 5.04246 2.62484C5.04246 3.01895 5.1988 3.37654 5.45284 3.639M0.986441 4.8549C0.978072 4.00828 1.43452 3.21769 2.1719 2.80162M12.0152 4.8549C12.0235 4.00828 11.5671 3.21769 10.8297 2.80162M10.0008 6.53317C10.0008 5.72868 9.63205 4.95714 8.97567 4.38828C8.31929 3.81942 7.42905 3.49984 6.5008 3.49984C5.57254 3.49984 4.6823 3.81942 4.02592 4.38828C3.36955 4.95714 3.0008 5.72868 3.0008 6.53317C3.0008 7.86422 2.67071 8.83768 2.25883 9.53423C1.78941 10.3281 1.5547 10.7251 1.56397 10.8199C1.57457 10.9284 1.5941 10.9626 1.68208 11.0269C1.75898 11.0832 2.14534 11.0832 2.91807 11.0832H10.0835C10.8562 11.0832 11.2426 11.0832 11.3195 11.0269C11.4075 10.9626 11.427 10.9284 11.4376 10.8199C11.4469 10.7251 11.2122 10.3281 10.7428 9.53423C10.3309 8.83768 10.0008 7.86422 10.0008 6.53317Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
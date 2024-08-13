import type { SVGProps } from 'react';

export default function Loudspeaker(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M3.33317 10.6663L4.64538 15.9152C4.68228 16.0628 4.70073 16.1366 4.72256 16.201C4.93581 16.8306 5.50277 17.2733 6.16527 17.3275C6.23309 17.333 6.30917 17.333 6.46133 17.333C6.65187 17.333 6.74714 17.333 6.8274 17.3252C7.62067 17.2483 8.24845 16.6205 8.32539 15.8272C8.33317 15.747 8.33317 15.6517 8.33317 15.4612V3.58302M15.4165 10.2497C17.0273 10.2497 18.3332 8.94385 18.3332 7.33302C18.3332 5.72218 17.0273 4.41635 15.4165 4.41635M8.5415 3.58302H5.4165C3.34544 3.58302 1.6665 5.26195 1.6665 7.33302C1.66651 9.40408 3.34544 11.083 5.4165 11.083H8.54151C10.0135 11.083 11.8142 11.8721 13.2034 12.6294C14.0139 13.0712 14.4191 13.2921 14.6845 13.2596C14.9306 13.2294 15.1167 13.1189 15.2609 12.9173C15.4165 12.6998 15.4165 12.2647 15.4165 11.3944V3.27159C15.4165 2.40135 15.4165 1.96622 15.2609 1.74876C15.1167 1.5471 14.9306 1.4366 14.6845 1.40646C14.4191 1.37395 14.0139 1.59485 13.2034 2.03664C11.8142 2.79394 10.0135 3.58302 8.5415 3.58302Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
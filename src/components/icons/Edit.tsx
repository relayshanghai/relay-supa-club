import type { SVGProps } from 'react';

export default function Edit(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M1.091 15.996a.997.997 0 01-.798-.289.999.999 0 01-.289-.797l.38-4.171c.041-.457.243-.888.568-1.213L9.948.529c.702-.704 1.976-.67 2.716.07l2.738 2.738h.001c.766.767.796 1.984.068 2.714l-8.997 8.997a1.967 1.967 0 01-1.213.569l-4.17.379zM7.983 5.323L2.366 10.94l-.264 2.956 2.977-.271 5.6-5.606-2.696-2.696zm5.983-.594l-2.695-2.694-1.948 1.948 2.695 2.696 1.948-1.95z"
                fill="currentColor"
            />
            <path d="M1 18h14c.55 0 1 .45 1 1s-.45 1-1 1H1c-.55 0-1-.45-1-1s.45-1 1-1z" fill="currentColor" />
        </svg>
    );
}

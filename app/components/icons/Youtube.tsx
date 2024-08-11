import type { SVGProps } from 'react';

export default function Youtube(props: SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -65 240 300" {...props}>
            <path
                d="M229.8 25.8A29.5 29.5 0 0 0 209 5C190.7 0 117.3 0 117.3 0S44 0 25.7 5A29.5 29.5 0 0 0 4.9 25.7C0 44.2 0 82.7 0 82.7s0 38.4 4.9 56.8a29.5 29.5 0 0 0 20.8 20.9c18.3 5 91.6 5 91.6 5s73.4 0 91.7-5a29.5 29.5 0 0 0 20.8-20.9c4.9-18.4 4.9-56.8 4.9-56.8s0-38.5-5-56.9"
                fill="red"
            />
            <path d="m93.3 117.6 61.4-35-61.4-34.8z" fill="#fff" />
        </svg>
    );
}

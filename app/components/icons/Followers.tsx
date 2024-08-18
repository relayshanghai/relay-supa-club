import type { SVGProps } from 'react';

export default function Followers(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M608 576A96 96 0 0 0 512 672v32l-64-32-244.736 122.368A52.032 52.032 0 0 1 128 747.84V288A96 96 0 0 1 224 192h448A96 96 0 0 1 768 288V448h-32A96 96 0 0 0 640 544V576z m256 64H768V544a32 32 0 0 0-64 0V640H608a32 32 0 0 0 0 64H704v96a32 32 0 0 0 64 0V704h96a32 32 0 0 0 0-64z"
                fill="#b7ddfd"
                p-id="4991"
            />
        </svg>
    );
}

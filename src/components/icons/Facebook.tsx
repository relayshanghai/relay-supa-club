import { SVGProps } from 'react';

export default function Twitter({
    variant = 'blue',
    ...props
}: { variant?: 'blue' | 'grey' } & SVGProps<SVGSVGElement>) {
    const color = variant === 'blue' ? '#60a5fa' : '#94A3B8';
    return (
        <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22" {...props}>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.499 19v-7.298h2.496l.375-2.845h-2.871V7.041c0-.823.232-1.384 1.437-1.384l1.535-.001V3.111A21.214 21.214 0 0013.234 3c-2.214 0-3.73 1.326-3.73 3.76v2.097H7v2.845h2.504V19h2.995z"
                fill={color}
            />
            <mask id="prefix__a" maskUnits="userSpaceOnUse" x="7" y="3" width="9" height="16">
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12.499 19v-7.298h2.496l.375-2.845h-2.871V7.041c0-.823.232-1.384 1.437-1.384l1.535-.001V3.111A21.214 21.214 0 0013.234 3c-2.214 0-3.73 1.326-3.73 3.76v2.097H7v2.845h2.504V19h2.995z"
                    fill={color}
                />
            </mask>
        </svg>
    );
}

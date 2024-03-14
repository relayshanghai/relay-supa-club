import type { SVGProps } from 'react';

const PlusIcon = ({ ...props }: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <g id="icon">
            <path
                id="Icon"
                d="M16.6673 17.5C16.6673 16.337 16.6673 15.7555 16.5238 15.2824C16.2006 14.217 15.3669 13.3834 14.3016 13.0602C13.8284 12.9167 13.247 12.9167 12.084 12.9167H7.91732C6.75435 12.9167 6.17286 12.9167 5.6997 13.0602C4.63436 13.3834 3.80068 14.217 3.47752 15.2824C3.33398 15.7555 3.33398 16.337 3.33398 17.5M13.7507 6.25C13.7507 8.32107 12.0717 10 10.0007 10C7.92958 10 6.25065 8.32107 6.25065 6.25C6.25065 4.17893 7.92958 2.5 10.0007 2.5C12.0717 2.5 13.7507 4.17893 13.7507 6.25Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </g>
    </svg>
);
export default PlusIcon;

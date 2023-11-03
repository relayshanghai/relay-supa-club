import type { SVGProps } from 'react';

export default function OldSearch(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M19 19L14.825 14.7075M16.9572 9.94216C16 14.5 13.4183 17 9 17C4.58172 17 1 13.4183 1 9C1 4.58172 4.58172 1 9 1M12 2.28571L17.3333 2.28571M17.3333 2.28571C17.3333 2.9958 17.9303 3.57143 18.6667 3.57143C19.403 3.57143 20 2.99579 20 2.28571C20 1.57563 19.403 1 18.6667 1C17.9303 1 17.3333 1.57563 17.3333 2.28571ZM14.6667 5.71429L20 5.71429M14.6667 5.71429C14.6667 6.42437 14.0697 7 13.3333 7C12.597 7 12 6.42437 12 5.71429C12 5.00421 12.597 4.42857 13.3333 4.42857C14.0697 4.42857 14.6667 5.00421 14.6667 5.71429Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

import React from 'react';

export default function Sparkles({ ...props }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={props.className}
            onClick={props.onClick}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
            />
        </svg>
    );
}

Sparkles.defaultProps = {
    className: 'w-6 h-6',
};

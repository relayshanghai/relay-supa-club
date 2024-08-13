import type { SVGProps } from 'react';

export default function BarGraph(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M6.5 9H2.83333C2.36662 9 2.13327 9 1.95501 9.09083C1.79821 9.17072 1.67072 9.29821 1.59083 9.45501C1.5 9.63327 1.5 9.86662 1.5 10.3333V15.1667C1.5 15.6334 1.5 15.8667 1.59083 16.045C1.67072 16.2018 1.79821 16.3293 1.95501 16.4092C2.13327 16.5 2.36662 16.5 2.83333 16.5H6.5M6.5 16.5H11.5M6.5 16.5L6.5 6.16667C6.5 5.69996 6.5 5.4666 6.59083 5.28834C6.67072 5.13154 6.79821 5.00406 6.95501 4.92416C7.13327 4.83333 7.36662 4.83333 7.83333 4.83333H10.1667C10.6334 4.83333 10.8667 4.83333 11.045 4.92416C11.2018 5.00406 11.3293 5.13154 11.4092 5.28834C11.5 5.4666 11.5 5.69996 11.5 6.16667V16.5M11.5 16.5H15.1667C15.6334 16.5 15.8667 16.5 16.045 16.4092C16.2018 16.3293 16.3293 16.2018 16.4092 16.045C16.5 15.8667 16.5 15.6334 16.5 15.1667V2.83333C16.5 2.36662 16.5 2.13327 16.4092 1.95501C16.3293 1.79821 16.2018 1.67072 16.045 1.59083C15.8667 1.5 15.6334 1.5 15.1667 1.5H12.8333C12.3666 1.5 12.1333 1.5 11.955 1.59083C11.7982 1.67072 11.6707 1.79821 11.5908 1.95501C11.5 2.13327 11.5 2.36662 11.5 2.83333V5.66667"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
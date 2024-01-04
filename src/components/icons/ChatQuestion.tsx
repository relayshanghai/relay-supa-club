import type { SVGProps } from 'react';

export default function ChatQuestion(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 20 23" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M10.4492 3.18909H5.8C4.11984 3.18909 3.27976 3.18909 2.63803 3.51607C2.07354 3.80369 1.6146 4.26263 1.32698 4.82712C1 5.46885 1 6.30893 1 7.98909V14.1891C1 15.1191 1 15.584 1.10222 15.9655C1.37962 17.0008 2.18827 17.8095 3.22354 18.0869C3.60504 18.1891 4.07003 18.1891 5 18.1891V20.5246C5 21.0574 5 21.3239 5.10923 21.4607C5.20422 21.5797 5.34827 21.6489 5.50054 21.6488C5.67563 21.6486 5.88367 21.4822 6.29976 21.1493L8.68521 19.2409C9.17252 18.8511 9.41617 18.6562 9.68749 18.5175C9.9282 18.3946 10.1844 18.3047 10.4492 18.2503C10.7477 18.1891 11.0597 18.1891 11.6837 18.1891H14.2C15.8802 18.1891 16.7202 18.1891 17.362 17.8621C17.9265 17.5745 18.3854 17.1155 18.673 16.5511C19 15.9093 19 15.0692 19 13.3891V11.1891M14 2.50224C14.1762 2.00136 14.524 1.57901 14.9817 1.30998C15.4395 1.04095 15.9777 0.942603 16.501 1.03237C17.0243 1.12213 17.499 1.39421 17.8409 1.80041C18.1829 2.20661 18.37 2.72072 18.3692 3.25168C18.3692 4.75056 16.1209 5.5 16.1209 5.5M16.15 8.5H16.16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

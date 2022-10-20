import Link from 'next/link';

export const Title = () => {
    return (
        <Link passHref href="/">
            <a className="font-poppins text-2xl font-bold text-tertiary-600 tracking-wide">
                relay.club
            </a>
        </Link>
    );
};

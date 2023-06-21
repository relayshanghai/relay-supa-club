import Link from 'next/link';
interface TitleProps {
    size?: 'small' | 'default' | 'large';
}

export const Title = ({ size = 'default' }: TitleProps) => {
    const sizeClass = size === 'small' ? 'text-lg' : size === 'large' ? 'text-4xl' : 'text-2xl';

    return (
        <Link className={`flex justify-center md:self-start ${sizeClass}`} href="/">
            <div className="flex cursor-pointer items-center px-12 py-4 font-poppins ">
                <div className="poppins font-extrabold tracking-wide text-tertiary-600">
                    relay<span className="text-relay-purple">.</span>club
                </div>
            </div>
        </Link>
    );
};

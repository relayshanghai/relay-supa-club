import Link from 'next/link';
interface TitleProps {
    size?: 'small' | 'default' | 'large';
    open?: boolean;
}

export const Title = ({ size = 'default', open }: TitleProps) => {
    const sizeClass = size === 'small' ? 'text-lg' : size === 'large' ? 'text-4xl' : 'text-2xl';

    return (
        <Link
            className={`flex ${open ? 'justify-start' : 'justify-center'} md:self-start ${sizeClass}`}
            href="/boostbot"
        >
            <div className={`flex cursor-pointer items-center ${open ? 'pl-5' : 'px-4'} font-poppins`}>
                <div className="poppins text-3xl font-extrabold tracking-wide text-tertiary-600">
                    <span className={`${!open && 'text-relay-purple'}`}>r</span>
                    {open && (
                        <>
                            elay<span className="text-relay-purple">.</span>club
                        </>
                    )}
                </div>
            </div>
        </Link>
    );
};

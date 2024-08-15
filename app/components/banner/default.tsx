import Link from 'next/link';
import { BoostbotSelected } from '../icons';
import { useState } from 'react';
import { Cross1Icon } from '@radix-ui/react-icons';

export const Default = ({
    title,
    message,
    show = true,
    setShow,
    buttonText,
    buttonLink,
    buttonIcon,
    orientation = 'horizontal',
    dismissable = false,
    onButtonClicked,
}: {
    title: string;
    message: string;
    show?: boolean;
    setShow?: (show: boolean) => void;
    orientation?: 'horizontal' | 'vertical';
    buttonText?: string;
    buttonLink?: string;
    buttonIcon?: JSX.Element;
    dismissable?: boolean;
    onButtonClicked?: () => void;
}) => {
    const [isOpen, setIsOpen] = useState(show);

    if (!isOpen) {
        return null;
    }
    return (
        <div className="sticky top-0 isolate z-[1000] flex items-center gap-x-6 overflow-hidden rounded-b-md bg-gradient-to-t from-violet-600 via-violet-500 to-violet-400 px-6 py-2.5 text-white shadow-lg">
            <div className="flex flex-1">
                <div className="flex-shrink-0 rounded-full bg-white px-2 py-1">
                    <BoostbotSelected className="h-8 w-6" />
                </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-center">
                <p className={`${orientation === 'vertical' && 'flex flex-col'} text-sm leading-6`}>
                    <strong className="font-semibold">{title}</strong>
                    {orientation === 'horizontal' && (
                        <svg viewBox="0 0 2 2" className="mx-2 inline h-0.5 w-0.5 fill-current" aria-hidden="true">
                            <circle cx={1} cy={1} r={1} />
                        </svg>
                    )}
                    {message}
                </p>
                {buttonText && (
                    <Link
                        href={buttonLink ? buttonLink : ''}
                        className="flex flex-row items-center rounded-full bg-white px-3.5 py-1 text-sm font-semibold text-primary-500 shadow-sm"
                        onClick={() => onButtonClicked && onButtonClicked()}
                    >
                        {buttonIcon && buttonIcon} {buttonText}
                    </Link>
                )}
            </div>
            <div className="flex flex-1 justify-end">
                {dismissable && (
                    <div className="flex-shrink-0">
                        <Cross1Icon
                            className="h-5 w-5 cursor-pointer"
                            onClick={() => {
                                setIsOpen(false);
                                setShow && setShow(false);
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

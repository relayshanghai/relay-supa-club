import Link from 'next/link';
import type { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from 'react';
import { useState } from 'react';
interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {
    content: string;
    detail?: string | null;
    children: React.ReactNode;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'left' | 'right';
    link?: string | null;
    linkText?: string | null;
    highlight?: string | null;
    tooltipClasses?: HTMLAttributes<HTMLDivElement>['className'];
}
export type TooltipProps = PropsWithChildren<Props>;

const positionClass = (position?: string) =>
    position === 'top-right'
        ? 'bottom-[120%] left-0'
        : position === 'top-left'
        ? 'bottom-[120%] right-0'
        : position === 'bottom-right'
        ? 'left-0 top-[120%]'
        : position === 'bottom-left'
        ? 'right-0 top-[120%]'
        : position === 'left'
        ? 'bottom-0 right-[110%]'
        : 'bottom-0 left-[110%]';

/** Wrap this around the component that you'd like to have the tooltip appear over when hovered. see `pages/component-previews/library.tsx` for examples*/
export const Tooltip = ({
    children,
    content,
    detail,
    className,
    position,
    link,
    linkText,
    highlight,
    tooltipClasses,
}: TooltipProps) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className={`relative ${className}`}>
            <div
                className="cursor-pointer"
                onMouseOver={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {children}
            </div>
            <div
                className={`absolute flex ${isHovered ? 'flex' : 'hidden'} ${positionClass(
                    position,
                )} z-50 w-auto rounded bg-gray-800 ${tooltipClasses}`}
                role="tooltip"
            >
                <div className="flex w-max max-w-2xl flex-col justify-evenly gap-2 rounded-md p-4 leading-4 shadow-lg">
                    <p className="text-md my-2 font-semibold text-gray-100">{content}</p>
                    {detail && <p className="text-sm font-normal text-gray-200">{detail}</p>}
                    {highlight && <p className="text-sm font-medium italic text-gray-200">{highlight}</p>}
                    {link && linkText && (
                        <Link className="font-normal text-primary-400" href={link}>
                            {linkText}
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

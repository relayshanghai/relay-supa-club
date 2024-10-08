import Link from 'next/link';
import type { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from 'react';
import { useCallback, useState } from 'react';

export type ToolTipPositionUnion =
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'left'
    | 'right'
    | 'inset-right'
    | 'inset-left';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {
    content: string;
    contentSize?: 'small' | 'medium' | 'large';
    detail?: string | null;
    children: React.ReactNode;
    position?: ToolTipPositionUnion;
    link?: string | null;
    linkText?: string | null;
    highlight?: string | null;
    tooltipClasses?: HTMLAttributes<HTMLDivElement>['className'];
    delay?: number;
    enabled?: boolean;
}
export type TooltipProps = PropsWithChildren<Props>;

const positionClass = (position?: string) =>
    position === 'top-right'
        ? 'bottom-[120%] left-full'
        : position === 'top-left'
        ? 'bottom-[120%] right-full'
        : position === 'bottom-right'
        ? 'left-full top-[120%]'
        : position === 'bottom-left'
        ? 'right-full top-[120%]'
        : position === 'left'
        ? 'bottom-0 right-[110%]'
        : position === 'right'
        ? 'bottom-0 left-[110%]'
        : position === 'inset-right'
        ? 'bottom-0 left-[80%]'
        : position === 'bottom-center'
        ? 'top-[120%] left-[-50%]'
        : 'bottom-0 right-[80%]';

/** Wrap this around the component that you'd like to have the tooltip appear over when hovered. see `pages/component-previews/library.tsx` for examples*/
export const Default = ({
    children,
    content,
    contentSize,
    detail,
    className,
    position,
    link,
    linkText,
    highlight,
    tooltipClasses,
    delay, // add delay prop
    enabled = true, // tooltip enabled prop
}: TooltipProps) => {
    // add delay to TooltipProps
    const [isHovered, setIsHovered] = useState(false);
    const [timer, setTimer] = useState<NodeJS.Timeout>(); // declare timer

    const handleMouseOver = useCallback(() => {
        setTimer(
            setTimeout(() => {
                setIsHovered(true);
            }, delay || 0),
        );
    }, [delay]);

    const handleMouseLeave = useCallback(() => {
        clearTimeout(timer); // clear timeout
        setIsHovered(false);
        setTimer(undefined); // cleanup timer
    }, [timer]);

    if (!content) return <>{children}</>;
    return (
        <div className={`${className}`} data-cy="tooltip">
            <div className="cursor-pointer" onMouseOver={handleMouseOver} onMouseOut={handleMouseLeave}>
                {children}
            </div>
            {enabled && (
                <div className="relative z-50">
                    <div
                        className={`absolute ${isHovered ? 'flex' : 'hidden'}  ${positionClass(
                            position,
                        )} rounded bg-gray-800 ${tooltipClasses}`}
                        role="tooltip"
                    >
                        <div
                            className={`w-max max-w-md whitespace-normal rounded-md ${
                                ((contentSize === 'large' || !contentSize) && 'py-4') ||
                                (contentSize === 'medium' && 'py-2') ||
                                (contentSize === 'small' && 'py-0')
                            } px-4  shadow-lg`}
                        >
                            <p
                                className={`my-2 ${
                                    ((contentSize === 'large' || !contentSize) && 'text-lg') ||
                                    (contentSize === 'medium' && 'text-base') ||
                                    (contentSize === 'small' && 'text-sm')
                                } font-semibold leading-6 text-gray-100`}
                            >
                                {content}
                            </p>
                            {detail && <p className="text-sm font-normal leading-6 text-gray-200">{detail}</p>}
                            {highlight && <p className="text-sm font-medium italic text-gray-200">{highlight}</p>}
                            {link && linkText && (
                                <Link className="font-normal text-primary-400" href={link}>
                                    {linkText}
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

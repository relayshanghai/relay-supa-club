import type { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from 'react';
import { useState } from 'react';
interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {
    content: string;
    detail?: string | null;
    children: React.ReactNode;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'left' | 'right';
}
export type TooltipProps = PropsWithChildren<Props>;

/** Wrap this around the component that you'd like to have the tooltip appear over when hovered. see `pages/component-previews/library.tsx` for examples*/
export const Tooltip = ({ children, content, detail, className, position }: TooltipProps) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className={`relative ${className}`}>
            <div onMouseOver={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                {children}
            </div>
            {isHovered && (
                <div
                    className={`absolute  ${
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
                            : 'bottom-0 left-[110%]'
                    } z-30 w-auto rounded bg-white font-semibold text-gray-500 opacity-100 transition-opacity`}
                    role="tooltip"
                >
                    <div className="flex w-52 flex-col px-2 py-1">
                        <p className="text-sm">{content}</p>
                        {detail && <p className="text-xs font-normal text-gray-800">{detail}</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

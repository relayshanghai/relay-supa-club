import type { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from 'react';
import { useState } from 'react';
interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {
    content: string;
    detail?: string | null;
    children: React.ReactNode;
}
export type TooltipProps = PropsWithChildren<Props>;

/** Wrap this around the component that you'd like to have the tooltip appear over when hovered. see `pages/component-previews/library.tsx` for examples*/
export const Tooltip = ({ children, content, detail, className }: TooltipProps) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className={`relative ${className}`}>
            <div onMouseOver={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                {children}
            </div>
            {isHovered && (
                <div
                    className={`absolute bottom-[120%] left-0 z-10 w-auto rounded bg-gray-500 text-white opacity-100 transition-opacity`}
                    role="tooltip"
                >
                    <div className="flex w-52 flex-col px-2 py-1">
                        <p className="text-sm">{content}</p>
                        {detail && <p className="text-xs text-gray-50">{detail}</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

import type { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from 'react';
interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {
    content: string;
    detail?: string | null;
}
export type TooltipProps = PropsWithChildren<Props>;

/** Wrap this around the component that you'd like to have the tooltip appear when hovered. see `pages/component-previews/library.tsx` for examples*/
export const Tooltip = ({ children, content, detail, className }: TooltipProps) => {
    return (
        <div className={`hs-tooltip [--placement:top] ${className}`}>
            <span
                className="hs-tooltip-content invisible absolute z-10 rounded bg-gray-500 py-1 px-2 text-white opacity-0 transition-opacity hs-tooltip-shown:visible hs-tooltip-shown:opacity-100"
                role="tooltip"
            >
                <div className="flex flex-col [max-width:300px]">
                    <p className="text-sm">{content}</p>
                    {detail && <p className="text-xs text-gray-50">{detail}</p>}
                </div>
            </span>
            <div className="hs-tooltip-toggle cursor-pointer">{children}</div>
        </div>
    );
};

import type { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from 'react';
interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {
    content: string;
}
export type TooltipProps = PropsWithChildren<Props>;
export const Tooltip = ({ children, content }: TooltipProps) => {
    return (
        <div className="hs-tooltip inline-block">
            <span
                className="hs-tooltip-content invisible absolute z-10 inline-block bg-gray-900 py-1 px-2 text-white opacity-0 transition-opacity hs-tooltip-shown:visible hs-tooltip-shown:opacity-100"
                role="tooltip"
            >
                {content}
            </span>
            <div className="hs-tooltip-toggle cursor-default">{children}</div>
        </div>
    );
};

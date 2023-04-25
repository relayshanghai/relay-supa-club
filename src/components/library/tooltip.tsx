import type { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from 'react';
interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {
    content: string;
    detail?: string | null;
}
export type TooltipProps = PropsWithChildren<Props>;

/** Wrap this around the component that you'd like to have the tooltip appear over when hovered. see `pages/component-previews/library.tsx` for examples*/
export const Tooltip = ({ content, detail, className }: TooltipProps) => {
    return (
        <div className={`${className}`}>
            <span
                className={`invisible absolute bottom-[120%] left-0 z-10 w-auto rounded bg-gray-500 text-white opacity-0 transition-opacity group-hover/tooltip:visible group-hover/tooltip:opacity-100`}
                role="tooltip"
            >
                <div className="flex w-52 flex-col px-2 py-1">
                    <p className="text-sm">{content}</p>
                    {detail && <p className="text-xs text-gray-50">{detail}</p>}
                </div>
            </span>
        </div>
    );
};

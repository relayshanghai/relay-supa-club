import type { ReactElement } from 'react';
import { Info } from '../icons';
import { type ToolTipPositionUnion, Tooltip } from '../library';
export interface StatCardProps {
    name: string;
    tooltip?: {
        title: string;
        content: string;
        position?: ToolTipPositionUnion;
    };
    value: string;
    largeIcon: ReactElement;
    smallIcon?: ReactElement;
}
export const StatCard = ({ name, value, largeIcon, smallIcon, tooltip }: StatCardProps) => {
    return (
        <div
            data-testid={`stat-card-${name.toLowerCase()}`}
            className="flex flex-auto cursor-default items-center justify-center space-y-2 rounded-lg border border-gray-200 bg-white px-6 py-2"
        >
            <div className="mr-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 p-3 text-primary-700">
                {largeIcon}
            </div>
            <div className="">
                <div className="flex">
                    <h3 className="font-medium">{name}</h3>
                    {tooltip && (
                        <Tooltip
                            content={tooltip.title}
                            detail={tooltip.content}
                            position={tooltip.position ?? 'bottom-right'}
                            className="w-fit"
                        >
                            <Info className="ml-2 h-3 w-3 text-gray-300" />
                        </Tooltip>
                    )}
                </div>
                <div className="flex">
                    <h2 className="mr-3 text-4xl text-primary-600">{value}</h2>
                    {smallIcon}
                </div>
            </div>
        </div>
    );
};

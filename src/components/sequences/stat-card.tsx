import type { ReactElement } from 'react';
export interface StatCardProps {
    name: string;
    tooltip?: string | null;
    value: string;
    largeIcon: ReactElement;
    smallIcon?: ReactElement;
}
export const StatCard = ({ name, value, largeIcon, smallIcon }: StatCardProps) => {
    return (
        <div className="flex cursor-default flex-col items-center justify-center space-y-2 p-2">
            <div>
                {largeIcon}
                <h3 className="font-medium">{name}</h3>
                <div>
                    <h2 className="text-4xl">{value}</h2>
                    {smallIcon}
                </div>
            </div>
        </div>
    );
};

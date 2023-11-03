import React from 'react';
import { Info } from 'src/components/icons';

interface StatCardProps {
    title: string;
    stat: string;
    iconColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, stat, iconColor }) => {
    const statBgColor =
        iconColor === 'green'
            ? 'bg-green-100 border-green-50'
            : iconColor === 'yellow'
            ? 'bg-yellow-100 border-yellow-50'
            : 'bg-gray-100 border-gray-50';

    const statIconColor =
        iconColor === 'green' ? 'text-green-600' : iconColor === 'yellow' ? 'text-orange-600' : 'text-gray-600';

    return (
        <div className="stat-card space-y-2 rounded-xl border border-gray-200 p-6 text-gray-600">
            <div className="text-sm font-medium">{title}</div>
            <div className="flex w-full items-center justify-between">
                <div className="text-4xl font-semibold">{stat}</div>
                <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${statBgColor}`}>
                    <Info className={`h-4 w-4 ${statIconColor}`} />
                </div>
            </div>
        </div>
    );
};

export default StatCard;

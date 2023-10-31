import React from 'react';
import { Info } from 'src/components/icons';

interface StatCardProps {
    title: string;
    stat: string;
    iconColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, stat, iconColor }) => {
    const statColor =
        iconColor === 'green'
            ? 'bg-green-100 border-green-50'
            : iconColor === 'yellow'
            ? 'bg-yellow-100 border-yellow-50'
            : 'bg-gray-100 border-gray-50';

    return (
        <div className="stat-card space-y-2 rounded-xl border border-gray-200 p-6 text-gray-600">
            <div className="text-base font-medium">{title}</div>
            <div className="flex w-full items-center justify-between">
                <div className="text-4xl font-semibold">{stat}</div>
                <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${statColor}`}>
                    <Info className="h-4 w-4 text-orange-600" />
                </div>
            </div>
        </div>
    );
};

export default StatCard;

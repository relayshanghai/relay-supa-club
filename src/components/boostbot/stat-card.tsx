import React from 'react';
import { AlertCircleOutline, CheckCircleOutline } from 'src/components/icons';

interface StatCardProps {
    title: string;
    stat: string;
    iconName?: 'alert' | 'good';
}

const StatCard: React.FC<StatCardProps> = ({ title, stat, iconName }) => {
    const statBgColor =
        iconName === 'good'
            ? 'bg-green-100 border-green-50'
            : iconName === 'alert'
            ? 'bg-yellow-100 border-yellow-50'
            : 'bg-gray-100 border-gray-50';

    const statIconColor =
        iconName === 'good' ? 'text-green-600' : iconName === 'alert' ? 'text-orange-600' : 'text-gray-600';

    return (
        <div className="stat-card space-y-2 rounded-xl border border-gray-200 p-6 text-gray-600">
            <div className="text-sm font-medium">{title}</div>
            <div className="flex w-full items-center justify-between">
                <div className="text-3xl font-medium">{stat}</div>
                <div className={`flex h-8 w-8 items-center justify-center rounded-full border-4 ${statBgColor}`}>
                    {iconName === 'alert' && <AlertCircleOutline className={`h-4 w-4 ${statIconColor}`} />}
                    {iconName === 'good' && <CheckCircleOutline className={`h-4 w-4 ${statIconColor}`} />}
                </div>
            </div>
        </div>
    );
};

export default StatCard;

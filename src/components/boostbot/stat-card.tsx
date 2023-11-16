import React from 'react';
import { AlertCircleOutline, CheckCircleOutline, Question } from 'src/components/icons';
import { Tooltip } from '../library/tooltip';
import { t } from 'i18next';

interface StatCardProps {
    title: string;
    stat: string;
    iconName?: 'alert' | 'good';
    tooltip?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, stat, iconName, tooltip }) => {
    const statBgColor =
        iconName === 'good'
            ? 'bg-green-100 border-green-50'
            : iconName === 'alert'
            ? 'bg-yellow-100 border-yellow-50'
            : 'border-none';

    const statIconColor = iconName === 'good' ? 'text-green-600' : iconName === 'alert' ? 'text-orange-600' : '';

    return (
        <div className="stat-card space-y-2 rounded-xl border border-gray-200 p-6 text-gray-600">
            <div className="flex space-x-1 text-xs font-medium tracking-tight">
                {title}
                {tooltip && (
                    <Tooltip
                        content={t(`tooltips.` + tooltip + `.title`)}
                        detail={t(`tooltips.` + tooltip + `.description`)}
                        position="bottom-left"
                        className="w-fit"
                    >
                        <Question className="h-1/2 w-1/2 stroke-gray-400" />
                    </Tooltip>
                )}
            </div>
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

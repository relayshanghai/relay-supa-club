import { useTranslation } from 'react-i18next';
import type { StatCardProps } from './stat-card';
import { StatCard } from './stat-card';
import { TeamOutline } from '../icons';
export interface SequenceStatsProps {
    totalInfluencers: number;
    /** percentage in decimal from 0 to 1 (.10 = 10%) */
    openRate: number;
    /** percentage in decimal from 0 to 1 (.10 = 10%) */
    replyRate: number;
    /** percentage in decimal from 0 to 1 (.10 = 10%) */
    bounceRate: number;
}

export const markAlertForLowStatRate = (rate: number, rateType: string) => {
    let alertType = 'alert';
    if (
        (rate >= 0.15 && rateType === 'openRate') ||
        (rate >= 0.1 && rateType === 'replyRate') ||
        (rate < 0.03 && rateType === 'bounceRate')
    ) {
        alertType = 'check';
    }
    return alertType;
};

export const SequenceStats = ({ totalInfluencers }: SequenceStatsProps) => {
    const { t } = useTranslation();
    const stats: StatCardProps[] = [
        {
            name: t('sequences.totalInfluencers'),
            tooltip: {
                title: t('sequences.totalInfluencersTooltip'),
                content: t('sequences.totalInfluencersTooltipDescription'),
            },
            value: totalInfluencers.toString(),
            largeIcon: <TeamOutline />,
        },
    ];
    return (
        <div className="flex flex-wrap justify-between gap-6 pb-8 md:gap-4">
            {stats.map((stat) => (
                <StatCard {...stat} key={stat.name} />
            ))}
        </div>
    );
};

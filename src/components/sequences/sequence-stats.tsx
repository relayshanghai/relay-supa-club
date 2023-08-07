import { useTranslation } from 'react-i18next';
import type { StatCardProps } from './stat-card';
import { StatCard } from './stat-card';
import {
    AlertCircleOutline,
    CheckCircleOutline,
    EmailOpenOutline,
    MessageDotsCircleOutline,
    MessageXCircleOutline,
    TeamOutline,
} from '../icons';
export interface SequenceStatsProps {
    totalInfluencers: number;
    openRate: number;
    replyRate: number;
    bounceRate: number;
}
export const SequenceStats = ({ totalInfluencers, openRate, replyRate, bounceRate }: SequenceStatsProps) => {
    const { t } = useTranslation();
    const stats: StatCardProps[] = [
        {
            name: t('sequences.totalInfluencers'),
            tooltip: t('sequences.totalInfluencersTooltip'),
            value: totalInfluencers.toString(),
            largeIcon: <TeamOutline />,
        },
        {
            name: t('sequences.openRate'),
            tooltip: t('sequences.openRateTooltip'),
            value: openRate.toString(),
            largeIcon: <EmailOpenOutline />,
            smallIcon: <CheckCircleOutline className="text-green-500" />,
        },
        {
            name: t('sequences.replyRate'),
            tooltip: t('sequences.replyRateTooltip'),
            value: replyRate.toString(),
            largeIcon: <MessageDotsCircleOutline />,
            smallIcon: <CheckCircleOutline className="text-green-500" />,
        },
        {
            name: t('sequences.bounceRate'),
            tooltip: t('sequences.bounceRateTooltip'),
            value: bounceRate.toString(),
            largeIcon: <MessageXCircleOutline />,
            smallIcon: <AlertCircleOutline className="text-red-500" />,
        },
    ];
    return (
        <div className="flex flex-wrap justify-around rounded-lg bg-white px-12 py-8 shadow-sm">
            {stats.map((stat) => (
                <div key={stat.name}>
                    <StatCard {...stat} />
                </div>
            ))}
        </div>
    );
};

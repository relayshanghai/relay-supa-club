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
import { decimalToPercent } from 'src/utils/formatter';
export interface SequenceStatsProps {
    totalInfluencers: number;
    /** percentage in decimal from 0 to 1 (.10 = 10%) */
    openRate: number;
    /** percentage in decimal from 0 to 1 (.10 = 10%) */
    replyRate: number;
    /** percentage in decimal from 0 to 1 (.10 = 10%) */
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
            value: decimalToPercent(openRate, 0) ?? '0%',
            largeIcon: <EmailOpenOutline />,
            smallIcon: (
                <div className="flex h-4 w-5 items-center justify-center bg-green-50 p-1 text-green-500">
                    <CheckCircleOutline className="h-3 w-3" />
                </div>
            ),
        },
        {
            name: t('sequences.replyRate'),
            tooltip: t('sequences.replyRateTooltip'),
            value: decimalToPercent(replyRate, 0) ?? '0%',
            largeIcon: <MessageDotsCircleOutline />,
            smallIcon: (
                <div className="flex h-4 w-5 items-center justify-center bg-green-50 p-1 text-green-500">
                    <CheckCircleOutline className="h-3 w-3" />
                </div>
            ),
        },
        {
            name: t('sequences.bounceRate'),
            tooltip: t('sequences.bounceRateTooltip'),
            value: decimalToPercent(bounceRate, 0) ?? '0%',
            largeIcon: <MessageXCircleOutline />,
            smallIcon: (
                <div className="flex h-4 w-5 items-center justify-center bg-red-50 p-1 text-red-500">
                    <AlertCircleOutline className="h-3 w-3" />
                </div>
            ),
        },
    ];
    return (
        <div className="flex flex-wrap justify-between gap-6 pb-8">
            {stats.map((stat) => (
                <StatCard {...stat} key={stat.name} />
            ))}
        </div>
    );
};

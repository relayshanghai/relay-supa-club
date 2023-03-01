import { useTranslation } from 'react-i18next';
import { CreatorReport } from 'types';
import LineChart from '../common/line-chart';
import { AudienceStats } from './creator-audience-stats';
const prepareStats = (stats: CreatorReport['user_profile']['stat_history']) => {
    const data: string[] = [];
    if (!stats || stats.length === 0) return data;
    const ignoreList = ['avg_dislikes', 'month'];
    Object.keys(stats[0]).forEach((statKey) => {
        if (!ignoreList.includes(statKey)) data.push(statKey);
    });
    return data;
};

export const MetricsSection = ({ report }: { report: CreatorReport }) => {
    const { t } = useTranslation();
    const stats = prepareStats(report.user_profile.stat_history);
    return (
        <div>
            {/* Channel stats charts */}
            <h2 className="mb-2 pl-6 font-semibold text-gray-600">
                {t('creators.show.channelStats')}
            </h2>
            <div className="flex flex-wrap">
                {stats.map((stat, index) => (
                    <div key={index} className="w-full p-6 pt-0 lg:w-1/2">
                        <LineChart data={report.user_profile.stat_history} dataKey={stat} />
                    </div>
                ))}
            </div>
            {/* Audience stats */}
            <AudienceStats report={report} />{' '}
        </div>
    );
};

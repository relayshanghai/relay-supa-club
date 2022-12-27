import { useTranslation } from 'react-i18next';
import { CreatorReport } from 'types';
import LineChart from '../common/line-chart';
const prepareStats = (stats: CreatorReport['user_profile']['stat_history']) => {
    const data: string[] = [];
    if (!stats || stats.length === 0) return data;
    const ignoreList = ['avg_dislikes', 'month'];
    Object.keys(stats[0]).forEach((statKey) => {
        if (!ignoreList.includes(statKey)) data.push(statKey);
    });
    return data;
};

export const MetricsSection = ({ userProfile }: { userProfile: CreatorReport['user_profile'] }) => {
    const { t } = useTranslation();
    const stats = prepareStats(userProfile.stat_history);
    return (
        <div>
            <h2 className="p-6 font-semibold text-gray-600 mb-2">
                {t('creators.show.channelStats')}
            </h2>
            <div className="flex flex-wrap">
                {stats.map((stat, index) => (
                    <div key={index} className="w-full lg:w-1/2 p-6">
                        <LineChart data={userProfile.stat_history} dataKey={stat} />
                    </div>
                ))}
            </div>
        </div>
    );
};

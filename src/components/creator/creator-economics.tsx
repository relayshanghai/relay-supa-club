import type { CreatorReport } from 'types';
import { toCurrency } from 'src/utils/utils';
import cpm from 'src/constants/cpm';
import { useTranslation } from 'react-i18next';
import { Money } from '../icons';

/** CPM = cost per million? */
function getCpm(country: string) {
    if (!country) return { lowerBound: 20, upperBound: 60 };
    if (cpm[country]) return cpm[country];
    return { lowerBound: 20, upperBound: 60 };
}
function getEstFee(avgViews: number, country: string) {
    let cpm = { lowerBound: 20, upperBound: 60 };
    if (!Number.isInteger(avgViews)) return 'N/A';
    if (!country) cpm = { lowerBound: 20, upperBound: 60 };
    if (country) cpm = getCpm(country);
    return `${toCurrency((avgViews / 1000) * cpm.lowerBound)} - ${toCurrency((avgViews / 1000) * cpm.upperBound)}`;
}

const formatCreatorEconomics = (userProfile: CreatorReport['user_profile']) => {
    const stats = [];
    const { geo, avg_views } = userProfile;
    if (geo && geo?.country)
        stats.push({
            label: 'cpm',
            icon: <Money className="fill-emerald-400" />,
            data: `$${getCpm(geo?.country?.name).lowerBound} - $${getCpm(geo?.country?.name).upperBound}`,
        });
    if (avg_views && geo?.country?.name)
        stats.push({
            label: 'estFee',
            icon: <Money className="fill-emerald-400" />,
            data: getEstFee(avg_views, geo.country.name),
        });
    return stats;
};

const CreatorEconomics = ({ userProfile }: { userProfile: CreatorReport['user_profile'] }) => {
    const economicsData = formatCreatorEconomics(userProfile);
    const { t } = useTranslation();

    if (!economicsData.length) return null;
    return (
        <div className="p-6">
            <h2 className="mb-2 font-semibold text-gray-600">{t('creators.show.creatorEconomics')}</h2>
            <div className="flex flex-wrap">
                {economicsData.map((stat, index) => (
                    <div
                        key={index}
                        className="mb-2 mr-2 box-border flex w-36 flex-1 flex-col self-stretch rounded-md bg-white p-2.5"
                    >
                        <div className="h-6 w-6">{stat.icon}</div>
                        <p className="f36 my-2 font-semibold text-tertiary-600">{stat.data}</p>
                        <p className="text-sm text-tertiary-600">{t(`creators.show.${stat.label}`)}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CreatorEconomics;

import { CreatorReport } from 'types';
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
    return `${toCurrency((avgViews / 1000) * cpm.lowerBound)} - ${toCurrency(
        (avgViews / 1000) * cpm.upperBound
    )}`;
}

const formatCreatorEconomics = (userProfile: CreatorReport['user_profile']) => {
    const stats = [];
    const { geo, avg_views } = userProfile;
    if (geo && geo?.country)
        stats.push({
            label: 'cpm',
            icon: <Money />,
            data: `$${getCpm(geo?.country?.name).lowerBound} - $${
                getCpm(geo?.country?.name).upperBound
            }`
        });
    if (avg_views && geo?.country?.name)
        stats.push({
            label: 'estFee',
            icon: <Money />,
            data: getEstFee(avg_views, geo.country.name)
        });
    return stats;
};

export const CreatorEconomics = ({
    userProfile
}: {
    userProfile: CreatorReport['user_profile'];
}) => {
    const basicData = formatCreatorEconomics(userProfile);
    //
    const { t } = useTranslation();
    if (!basicData.length) return null;
    return (
        <div className="p-6">
            <h2 className="font-semibold text-gray-600 mb-2">
                {t('creators.show.creatorEconomics')}
            </h2>
            <div className="flex flex-wrap">
                {!!basicData.length &&
                    basicData.map((stat, index) => (
                        <div key={index}>
                            <div className="flex flex-col bg-white rounded-md p-2.5 w-36 mr-2 mb-2 flex-shrink-0 box-border self-stretch relative">
                                <div className="w-6 h-6">{stat.icon}</div>
                                <p className="text-tertiary-600 f36 font-semibold mb-1">
                                    {stat.data}
                                </p>
                                <p className="text-tertiary-600 text-sm">
                                    {t(`creators.show.${stat.label}`)}
                                </p>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

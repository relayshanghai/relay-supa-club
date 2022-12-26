import { useTranslation } from 'react-i18next';
import { CreatorReport } from 'types';
import { SocialCard } from './creator-social-card';
import { formatStats } from './helpers';

export const CreatorOverview = ({ report }: { report: CreatorReport }) => {
    const { t } = useTranslation();

    const creatorOverviewStats = formatStats(report.user_profile);

    return (
        <div className="flex flex-wrap">
            {/* TODO: KOL economics */}
            <div className="mb-4 lg:w-1/2">
                <h2 className="font-semibold text-gray-600 mb-2">
                    {t('creators.show.description')}
                </h2>
                <p
                    className="bg-white rounded-lg p-4 text-sm text-tertiary-600"
                    style={{ whiteSpace: 'break-spaces' }}
                >
                    {report.user_profile.description}
                </p>
            </div>

            {report.user_profile.contacts && (
                <div className="mb-4 lg:w-1/2">
                    <h2 className="font-semibold text-gray-600 mb-2">
                        {t('creators.show.socialLinks')}{' '}
                    </h2>
                    <div className="flex gap-2 flex-wrap w-full">
                        {report.user_profile.contacts.map((contact, index) => (
                            <SocialCard contact={contact} key={index} />
                        ))}
                    </div>
                </div>
            )}
            {/* overview */}
            <div className="mb-4">
                <h2 className="font-semibold text-gray-600 mb-2">
                    {t('creators.show.generalOverview')}
                </h2>

                <div className="flex flex-wrap">
                    {creatorOverviewStats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-md p-2.5 w-36 mr-2 mb-2">
                            {/* TODO: get logo and tooltip description back */}
                            {/* <image className="icon-m mb-1" src="/images/icons/stats/{{item.icon}}.svg"></image> */}
                            {/* <Icon name={stat.icon} className="w-6 h-6" /> */}
                            <p className="text-tertiary-600 font-semibold mb-1">{stat.data}</p>
                            <p className="text-tertiary-600 text-sm">
                                {t(`creators.show.${stat.label}`)}
                            </p>
                            {stat?.descr && (
                                <div className="group">
                                    {/* <Icon name="info" className="w-4 h-4 absolute right-2 top-2 fill-current text-gray-400 group-hover:text-gray-600 duration-300" /> */}
                                    <p className="bg-white shadow-lg hidden group-hover:flex duration-300 absolute z-50 bottom-full right-2 text-xs p-2 rounded-md">
                                        {t(`creators.show.statsDescr.${stat.descr}`)}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* similar */}
        </div>
    );
};

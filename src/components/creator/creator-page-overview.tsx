import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CreatorReport } from 'types';
import { Info } from '../icons';
import { SimilarCreator } from './creator-similar-creator';
import { SocialCard } from './creator-social-card';
import { formatStats } from './helpers';

const titleClass = `font-semibold text-gray-600 mb-2`;

/** Lazy load this because it contains a big static file (cpms) */
const Economics = dynamic(() => import('./creator-economics'), { ssr: false });

export const CreatorOverview = ({ report }: { report: CreatorReport }) => {
    const { t } = useTranslation();

    const creatorOverviewStats = formatStats(report.user_profile);

    const [showMoreSimilar, setShowMoreSimilar] = useState(false);

    const similarCreators =
        report.user_profile.similar_users && report.user_profile.similar_users?.length > 0
            ? showMoreSimilar
                ? report.user_profile.similar_users
                : report.user_profile.similar_users.slice(0, 5)
            : [];

    return (
        <div className="flex flex-wrap py-6">
            <div className="lg:w-1/2">
                {/* economics */}
                {report.user_profile.type === 'youtube' && (
                    <Economics userProfile={report.user_profile} />
                )}
                {/* description */}
                <div className="p-6">
                    <h2 className={titleClass}>{t('creators.show.description')}</h2>
                    <p
                        className="bg-white rounded-lg p-4 text-sm text-tertiary-600"
                        style={{ whiteSpace: 'break-spaces' }}
                    >
                        {report.user_profile.description}
                    </p>
                </div>

                {/* contacts */}
                {report.user_profile.contacts?.length > 0 && (
                    <div className="py-6">
                        <h2 className={`${titleClass} px-6`}>{t('creators.show.socialLinks')} </h2>
                        <div className="flex flex-wrap">
                            {report.user_profile.contacts.map((contact, index) => (
                                <SocialCard contact={contact} key={index} />
                            ))}
                        </div>
                    </div>
                )}
                {/* overview */}
                <div className="p-6">
                    <h2 className={titleClass}>{t('creators.show.generalOverview')}</h2>

                    <div className="flex flex-wrap">
                        {creatorOverviewStats.map((stat, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-md p-2.5 w-36 mr-2 mb-2 relative"
                            >
                                <div className="w-6 h-6">{stat.icon}</div>
                                <p className="text-tertiary-600 font-semibold mb-1">{stat.data}</p>
                                <p className="text-tertiary-600 text-sm">
                                    {t(`creators.show.${stat.label}`)}
                                </p>
                                {stat?.descr && (
                                    <div className="group">
                                        <Info className="w-4 h-4 absolute right-2 top-2 fill-current text-gray-400 group-hover:text-gray-600 duration-300 cursor-pointer" />
                                        <p className="bg-white shadow-lg hidden group-hover:flex duration-300 absolute z-50 bottom-full right-2 text-xs p-2 rounded-md">
                                            {t(`creators.show.statsDescr.${stat.descr}`)}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* similar */}
            {similarCreators?.length > 0 && (
                <div className="p-6 lg:w-1/2 flex flex-col">
                    <h2 className={titleClass}>{t('creators.show.similarInfluencers')}</h2>
                    <div>
                        {similarCreators.map((creator, index) => (
                            <SimilarCreator
                                creator={creator}
                                platform={report.user_profile.type}
                                key={index}
                            />
                        ))}
                    </div>
                    <button
                        onClick={() => setShowMoreSimilar(!showMoreSimilar)}
                        className="justify-self-end"
                    >
                        <p className="text-primary-500 hover:text-primary-700 duration-300 font-semibold text-sm text-right">
                            {showMoreSimilar
                                ? t('creators.show.seeLess')
                                : t('creators.show.seeMore')}
                        </p>
                    </button>
                </div>
            )}
        </div>
    );
};

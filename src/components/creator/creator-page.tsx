import { useEffect, useState } from 'react';
import { CreatorPlatform } from 'types';
import { TitleSection } from './creator-title-section';
import { CreatorOverview } from './creator-page-overview';
import Head from 'next/head';
import { MetricsSection } from './creator-metrics-section';
import { PopularPostsSection } from './creator-popular-posts';
import CreatorSkeleton from './creator-skeleton';

import { useReport } from 'src/hooks/use-report';
import { AddToCampaignModal } from '../modal-add-to-campaign';
import { useTranslation } from 'react-i18next';

export const CreatorPage = ({
    creator_id,
    platform,
}: {
    creator_id: string;
    platform: CreatorPlatform;
}) => {
    const { loading, report, getOrCreateReport, reportCreatedAt, errorMessage } = useReport();

    const [showCampaignListModal, setShowCampaignListModal] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        getOrCreateReport(platform, creator_id);
    }, [getOrCreateReport, platform, creator_id]);

    const onAddToCampaign = () => {
        setShowCampaignListModal(true);
    };
    return (
        <div>
            <AddToCampaignModal
                show={showCampaignListModal}
                setShow={setShowCampaignListModal}
                platform={platform}
                selectedCreator={{
                    ...report?.user_profile,
                }}
            />
            <Head>
                <title>{report?.user_profile.fullname || 'relay.club'}</title>
            </Head>
            <div className="flex flex-col">
                {!report || loading || errorMessage?.length > 0 ? (
                    <CreatorSkeleton error={errorMessage?.length > 0} errorMessage={errorMessage} />
                ) : (
                    <>
                        <TitleSection
                            user_profile={report.user_profile}
                            platform={platform}
                            onAddToCampaign={onAddToCampaign}
                        />
                        <CreatorOverview report={report} />
                        <MetricsSection report={report} />
                        <PopularPostsSection report={report} />
                        {reportCreatedAt && (
                            <span className="flex text-xs mx-6 my-3">
                                <p className="text-gray-400 mr-2">
                                    {t('creators.show.lastUpdate')}
                                </p>
                                <p className="text-gray-600">
                                    {new Date(reportCreatedAt).toLocaleDateString()}
                                </p>
                            </span>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

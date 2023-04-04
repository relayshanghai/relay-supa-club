import { useContext, useEffect, useState } from 'react';
import type { CreatorPlatform } from 'types';
import { TitleSection } from './creator-title-section';
import { CreatorOverview } from './creator-page-overview';
import Head from 'next/head';
import { MetricsSection } from './creator-metrics-section';
import { PopularPostsSection } from './creator-popular-posts';
import CreatorSkeleton from './creator-skeleton';

import { AddToCampaignModal } from '../modal-add-to-campaign';
import { useTranslation } from 'react-i18next';
import { IQDATA_MAINTENANCE, RELAY_DOMAIN } from 'src/constants';
import { MaintenanceMessage } from '../maintenance-message';
import { useCampaigns } from 'src/hooks/use-campaigns';
import { useCompany } from 'src/hooks/use-company';
import { reportsContext } from 'src/hooks/use-report';

export const CreatorPage = ({
    creator_id,
    platform,
}: {
    creator_id: string;
    platform: CreatorPlatform;
}) => {
    const { useReport } = useContext(reportsContext);
    const { loading, report, getOrCreateReport, reportCreatedAt, errorMessage } = useReport({
        platform,
        creator_id,
    });

    const [showCampaignListModal, setShowCampaignListModal] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        getOrCreateReport();
    }, [getOrCreateReport, platform, creator_id]);

    const onAddToCampaign = () => {
        setShowCampaignListModal(true);
    };

    const { company } = useCompany();

    const { campaigns } = useCampaigns({ companyId: company?.id });

    if (IQDATA_MAINTENANCE) {
        return <MaintenanceMessage />;
    }

    return (
        <div>
            <AddToCampaignModal
                show={showCampaignListModal}
                setShow={setShowCampaignListModal}
                platform={platform}
                selectedCreator={{
                    ...report?.user_profile,
                }}
                campaigns={campaigns}
            />
            <Head>
                <title>{report?.user_profile.fullname || RELAY_DOMAIN}</title>
            </Head>
            <div className="flex flex-col">
                {!report || loading || errorMessage?.length > 0 ? (
                    <CreatorSkeleton
                        loading={loading}
                        error={errorMessage?.length > 0}
                        errorMessage={errorMessage}
                    />
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
                            <span className="mx-6 my-3 flex text-xs">
                                <p className="mr-2 text-gray-400">
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

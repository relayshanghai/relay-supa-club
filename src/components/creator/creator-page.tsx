import { useState } from 'react';
import type { CreatorPlatform } from 'types';
import { TitleSection } from './creator-title-section';
import { CreatorOverview } from './creator-page-overview';
import Head from 'next/head';
import { MetricsSection } from './creator-metrics-section';
import { PopularPostsSection } from './creator-popular-posts';
import CreatorSkeleton from './creator-skeleton';
import { useReport } from 'src/hooks/use-report';
import { AddToCampaignModal } from '../modal-add-to-campaign';
import { useTranslation } from 'react-i18next';
import { IQDATA_MAINTENANCE, RELAY_DOMAIN } from 'src/constants';
import { MaintenanceMessage } from '../maintenance-message';
import { useCampaigns } from 'src/hooks/use-campaigns';
import { useAllCampaignCreators } from 'src/hooks/use-all-campaign-creators';
import { InfluencerAlreadyAddedModal } from '../influencer-already-added';
import { useRudderstack } from 'src/hooks/use-rudderstack';
import { useAnalytics } from '../analytics/analytics-provider';
import { AnalyzeAddToCampaign } from 'src/utils/analytics/events';
import { SearchAnalyzeInfluencer } from 'src/utils/analytics/events';
import type { eventKeys } from 'src/utils/analytics/events';
import { ANALYZE_PAGE } from 'src/utils/rudderstack/event-names';

export const CreatorPage = ({ creator_id, platform }: { creator_id: string; platform: CreatorPlatform }) => {
    const { loading, report, reportCreatedAt, errorMessage } = useReport({
        platform,
        creator_id,
        track: SearchAnalyzeInfluencer.eventName as eventKeys,
    });

    const [showCampaignListModal, setShowCampaignListModal] = useState(false);
    const [showAlreadyAddedModal, setShowAlreadyAddedModal] = useState(false);

    const { t } = useTranslation();
    const { campaigns } = useCampaigns({});
    const { allCampaignCreators } = useAllCampaignCreators(campaigns);
    const { trackEvent } = useRudderstack();
    const { track } = useAnalytics();

    const addToCampaign = async (selectedCreatorUserId: string) => {
        let isAlreadyInCampaign = false;

        if (allCampaignCreators) {
            for (const campaignCreator of allCampaignCreators) {
                if (campaignCreator.campaign_id) {
                    if (campaignCreator.creator_id === selectedCreatorUserId) {
                        isAlreadyInCampaign = true;
                        break;
                    }
                }
            }
        }

        if (isAlreadyInCampaign) {
            setShowAlreadyAddedModal(true);
        } else {
            setShowCampaignListModal(true);
        }
        trackEvent(ANALYZE_PAGE('add to campaign'), { platform, user_id: selectedCreatorUserId });
    };

    if (IQDATA_MAINTENANCE) {
        return <MaintenanceMessage />;
    }

    return (
        <div>
            <AddToCampaignModal
                show={showCampaignListModal}
                setShow={setShowCampaignListModal}
                platform={platform}
                selectedCreator={report?.user_profile}
                campaigns={campaigns}
                allCampaignCreators={allCampaignCreators}
                track={(campaign: string) => {
                    report &&
                        track(AnalyzeAddToCampaign, {
                            creator: report.user_profile,
                            campaign: campaign,
                        });
                }}
            />
            <InfluencerAlreadyAddedModal
                show={showAlreadyAddedModal}
                setCampaignListModal={setShowCampaignListModal}
                setShow={setShowAlreadyAddedModal}
                selectedCreatorUserId={report?.user_profile.user_id}
                campaigns={campaigns}
                allCampaignCreators={allCampaignCreators}
            />
            <Head>
                <title>{report?.user_profile.fullname || RELAY_DOMAIN}</title>
            </Head>
            <div className="flex flex-col">
                {!report || loading || errorMessage?.length > 0 ? (
                    <CreatorSkeleton loading={loading} error={errorMessage?.length > 0} errorMessage={errorMessage} />
                ) : (
                    <>
                        <TitleSection
                            user_profile={report.user_profile}
                            platform={platform}
                            onAddToCampaign={addToCampaign}
                        />
                        <CreatorOverview report={report} />
                        <MetricsSection report={report} />
                        <PopularPostsSection report={report} />
                        {reportCreatedAt && (
                            <span className="mx-6 my-3 flex text-xs">
                                <p className="mr-2 text-gray-400">{t('creators.show.lastUpdate')}</p>
                                <p className="text-gray-600">{new Date(reportCreatedAt).toLocaleDateString()}</p>
                            </span>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

import { useEffect, useState } from 'react';
import type { CreatorPlatform } from 'types';
import { TitleSection } from './creator-title-section';
import { CreatorOverview } from './creator-page-overview';
import Head from 'next/head';
import { MetricsSection } from './creator-metrics-section';
import { PopularPostsSection } from './creator-popular-posts';
import CreatorSkeleton from './creator-skeleton';
import { AddToCampaignModal } from '../modal-add-to-campaign';
import { useTranslation } from 'react-i18next';
import { BOOSTBOT_DOMAIN, IQDATA_MAINTENANCE } from 'src/constants';
import { MaintenanceMessage } from '../maintenance-message';
import { useCampaigns } from 'src/hooks/use-campaigns';
import { useAllCampaignCreators } from 'src/hooks/use-all-campaign-creators';
import { InfluencerAlreadyAddedModal } from '../influencer-already-added';
import { useRudderstack } from 'src/hooks/use-rudderstack';
import { useAnalytics } from '../analytics/analytics-provider';
import { AnalyzeAddToCampaign } from 'src/utils/analytics/events';
import { ANALYZE_PAGE } from 'src/utils/rudderstack/event-names';
import { AddToSequenceModal } from '../modal-add-to-sequence';
import { useSequences } from 'src/hooks/use-sequences';
import type { Sequence, SequenceInfluencer } from 'src/utils/api/db';
import { updateSequenceInfluencerIfSocialProfileAvailable } from '../sequences/helpers';
import { useSequenceInfluencers } from 'src/hooks/use-sequence-influencers';
import { useCompany } from 'src/hooks/use-company';
import { useAllSequenceInfluencersBasicInfo } from 'src/hooks/use-all-sequence-influencers-iqdata-id-and-sequence';
import { InfluencerAlreadyAddedSequenceModal } from '../influencer-already-added-sequence-modal';
import { clientLogger } from 'src/utils/logger-client';
import { isInMaintenance } from 'src/utils/maintenance';
import MaintenanceComponent from '../maintenance/Component';
import { useReportV2 } from 'src/hooks/v2/use-report';
import { useReportStore } from 'src/store/reducers/report';

export const CreatorPage = ({ creator_id, platform }: { creator_id: string; platform: CreatorPlatform }) => {
    const { sequences } = useSequences();
    const { company } = useCompany();
    const { allSequenceInfluencersIqDataIdsAndSequenceNames, refresh: refreshAllSequenceInfluencersBasicInfo } =
        useAllSequenceInfluencersBasicInfo();

    const [sequence, setSequence] = useState<Sequence | null>(sequences?.[0] ?? null);

    const { updateSequenceInfluencer } = useSequenceInfluencers();
    const { loading, report, socialProfile, reportCreatedAt, errorMessage } = useReportV2({
        platform,
        creator_id,
    });

    const [showCampaignListModal, setShowCampaignListModal] = useState(false);
    const [showAlreadyAddedModal, setShowAlreadyAddedModal] = useState(false);
    const [showSequenceListModal, setShowSequenceListModal] = useState(false);

    const [selectedSequence, setSelectedSequence] = useState<string>();
    const [showAlreadyAddedSequenceModal, setShowAlreadyAddedSequenceModal] = useState(false);

    const alreadyAddedSequence = allSequenceInfluencersIqDataIdsAndSequenceNames?.find(
        ({ iqdata_id }) => iqdata_id === creator_id,
    );
    const addToSequence = () => {
        if (alreadyAddedSequence) {
            setShowAlreadyAddedSequenceModal(true);
        } else {
            setShowSequenceListModal(true);
        }
    };
    const { t } = useTranslation();
    const { campaigns } = useCampaigns({});
    const { allCampaignCreators } = useAllCampaignCreators(campaigns);
    const { trackEvent } = useRudderstack();
    const { track } = useAnalytics();
    const [sequenceInfluencer, setSequenceInfluencer] = useState<SequenceInfluencer | null>(null);
    const { setSelectedInfluencer } = useReportStore();

    useEffect(() => {
        updateSequenceInfluencerIfSocialProfileAvailable({
            sequenceInfluencer,
            socialProfile,
            report,
            updateSequenceInfluencer,
            company_id: company?.id ?? '',
        }).catch((error) => {
            clientLogger(error);
        });
    }, [report, socialProfile, sequenceInfluencer, company, updateSequenceInfluencer]);

    useEffect(() => {
        setSelectedInfluencer({
            name: report?.user_profile?.fullname as string,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [report?.user_profile]);

    const handleSetSequenceInfluencer = (sequenceInfluencer: SequenceInfluencer | null) => {
        if (!sequenceInfluencer) {
            return;
        }
        const sequenceName = sequences?.find((sequence) => sequence.id === sequenceInfluencer.sequence_id)?.name;
        refreshAllSequenceInfluencersBasicInfo([
            ...allSequenceInfluencersIqDataIdsAndSequenceNames.map((influencer) => ({
                ...influencer,
                sequences: {
                    name: sequenceName ?? '',
                },
            })),
            {
                iqdata_id: sequenceInfluencer.iqdata_id,
                id: sequenceInfluencer.id,
                email: sequenceInfluencer.email,
                sequences: {
                    name: sequenceName ?? '',
                },
            },
        ]);
        setSelectedSequence(sequenceInfluencer?.sequence_id);
        setSequenceInfluencer(sequenceInfluencer);
    };

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
        trackEvent(ANALYZE_PAGE('Add to Campaign'), { platform, user_id: selectedCreatorUserId });
    };

    const isMaintenancePage = isInMaintenance('report');

    if (isMaintenancePage) {
        return <MaintenanceComponent message={t('maintenance.reportPage')} />;
    }

    if (IQDATA_MAINTENANCE) {
        return <MaintenanceMessage />;
    }

    return (
        <div>
            <div className="flex flex-col">
                {!report || loading || errorMessage?.length > 0 ? (
                    <CreatorSkeleton
                        loading={loading}
                        error={errorMessage?.length > 0}
                        errorMessage={errorMessage === 'server_busy' ? t('creators.failedToFetchReport') : errorMessage}
                    />
                ) : (
                    <>
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
                        <AddToSequenceModal
                            show={showSequenceListModal}
                            setShow={setShowSequenceListModal}
                            creatorProfile={report?.user_profile || {}}
                            platform={platform}
                            sequence={sequence}
                            sequences={sequences || []}
                            setSequence={setSequence}
                            setSequenceInfluencer={handleSetSequenceInfluencer}
                        />
                        <InfluencerAlreadyAddedSequenceModal
                            visible={showAlreadyAddedSequenceModal}
                            onClose={() => {
                                setShowAlreadyAddedSequenceModal(false);
                            }}
                            alreadyAddedSequence={
                                alreadyAddedSequence?.sequenceName ||
                                sequences?.find((sequence) => sequence.id === selectedSequence)?.name ||
                                ''
                            }
                        />
                        <InfluencerAlreadyAddedModal
                            show={showAlreadyAddedModal}
                            setCampaignListModal={setShowCampaignListModal}
                            setShow={setShowAlreadyAddedModal}
                            selectedCreatorUserId={report?.user_profile?.user_id}
                            campaigns={campaigns}
                            allCampaignCreators={allCampaignCreators}
                        />
                        <Head>
                            <title>{report?.user_profile?.fullname || BOOSTBOT_DOMAIN}</title>
                        </Head>
                        <TitleSection
                            user_profile={report.user_profile}
                            platform={platform}
                            onAddToCampaign={addToCampaign}
                            onAddToSequence={addToSequence}
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

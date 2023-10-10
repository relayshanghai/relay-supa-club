import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import type { CreatorPlatform, CreatorUserProfile } from 'types';
import CampaignModalCard from './campaigns/campaign-modal-card';
import { Modal } from './modal';
import type { CampaignCreatorBasicInfo } from 'src/utils/api/db/calls/campaignCreators';
import type { CampaignDB } from 'src/utils/api/db';

export const AddToCampaignModal = ({
    show,
    setShow,
    platform,
    selectedCreator,
    campaigns,
    allCampaignCreators,
    track,
}: {
    show: boolean;
    setShow: (show: boolean) => void;
    platform: CreatorPlatform;
    selectedCreator?: CreatorUserProfile | null;
    campaigns?: CampaignDB[] | undefined;
    allCampaignCreators?: CampaignCreatorBasicInfo[];
    track: (campaign: string) => void;
}) => {
    const { t } = useTranslation();
    return (
        <Modal
            title={t('campaigns.modal.addToCampaign') || ''}
            visible={show}
            onClose={() => {
                setShow(false);
            }}
        >
            {campaigns?.length ? (
                <>
                    <div className="py-4 text-sm text-tertiary-800">{t('campaigns.modal.addThisInfluencer')}</div>
                    <div>
                        {campaigns.map((campaign, index) => (
                            <CampaignModalCard
                                campaign={campaign}
                                platform={platform}
                                creator={selectedCreator}
                                key={index}
                                campaignCreators={
                                    allCampaignCreators?.filter((creator) => creator.campaign_id === campaign.id) ?? []
                                }
                                track={track}
                            />
                        ))}
                    </div>
                </>
            ) : (
                <div className="h-full text-sm text-gray-600">
                    {t('campaigns.index.noCampaignsAvailable')}
                    <div className="cursor-pointer text-primary-500 duration-300 hover:text-primary-700">
                        <Link href="/campaigns/form" legacyBehavior>
                            {t('campaigns.index.clickCreate')}
                        </Link>
                    </div>
                </div>
            )}
        </Modal>
    );
};

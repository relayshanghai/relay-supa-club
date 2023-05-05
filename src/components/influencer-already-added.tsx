import { useTranslation } from 'react-i18next';
import { ModalWithButtons } from './modal-with-buttons';
import type { CampaignDB } from 'src/utils/api/db';
import type { CreatorSearchAccountObject } from 'types';
import type { CampaignCreatorBasicInfo } from 'src/utils/client-db/campaignCreators';

export const InfluencerAlreadyAddedModal = ({
    show,
    setShow,
    setCampaignListModal,
    campaigns,
    allCampaignCreators,
    selectedCreator,
}: {
    show: boolean;
    setShow: (show: boolean) => void;
    setCampaignListModal: (show: boolean) => void;
    campaigns: CampaignDB[];
    allCampaignCreators?: CampaignCreatorBasicInfo[];
    selectedCreator: CreatorSearchAccountObject | null;
}) => {
    const { t } = useTranslation();
    const campaignsWithCreator = campaigns
        .filter((campaign) => {
            const campaignCreators = allCampaignCreators?.filter(
                (campaignCreator) => campaignCreator.campaign_id === campaign.id,
            );
            return campaignCreators?.some(
                (campaignCreator) => campaignCreator.creator_id === selectedCreator?.account.user_profile.user_id,
            );
        })
        .map((campaign) => campaign.name);
    return (
        <ModalWithButtons
            title={t('campaigns.modal.addToCampaign') || ''}
            visible={show}
            onClose={() => {
                setShow(false);
            }}
            closeButtonText={t('campaigns.modal.doNotAdd') || ''}
            okButtonText={t('campaigns.modal.addAnyway') || ''}
            onOkay={() => {
                setShow(false);
                setCampaignListModal(true);
            }}
        >
            <div className="flex flex-col gap-2">
                <p>
                    {`${t('campaigns.modal.influencerAlreadyAdded')} ${campaignsWithCreator
                        ?.map((campaign) => campaign)
                        .join(', ')}`}
                </p>
            </div>
        </ModalWithButtons>
    );
};

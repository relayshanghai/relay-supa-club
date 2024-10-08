import { useTranslation } from 'react-i18next';
import { ModalWithButtons } from './modal-with-buttons';
import type { CampaignDB } from 'src/utils/api/db';
import type { CampaignCreatorBasicInfo } from 'src/utils/api/db/calls/campaignCreators';
import { useRudderstack } from 'src/hooks/use-rudderstack';
import { ALREADY_ADDED_MODAL } from 'src/utils/rudderstack/event-names';

export const InfluencerAlreadyAddedModal = ({
    show,
    setShow,
    setCampaignListModal,
    campaigns,
    allCampaignCreators,
    selectedCreatorUserId,
}: {
    show: boolean;
    setShow: (show: boolean) => void;
    setCampaignListModal: (show: boolean) => void;
    campaigns: CampaignDB[];
    allCampaignCreators?: CampaignCreatorBasicInfo[];
    selectedCreatorUserId?: string;
}) => {
    const { t } = useTranslation();
    const filterForSelectedCreator = (campaign: CampaignDB) => {
        const campaignCreators = allCampaignCreators?.filter(
            (campaignCreator) => campaignCreator.campaign_id === campaign.id,
        );
        return campaignCreators?.some((campaignCreator) => campaignCreator.creator_id === selectedCreatorUserId);
    };
    const campaignsWithCreator = campaigns.filter(filterForSelectedCreator).map((campaign) => campaign.name);
    const { trackEvent } = useRudderstack();

    return (
        <ModalWithButtons
            title={t('campaigns.modal.addToCampaign') || ''}
            visible={show}
            onClose={() => {
                setShow(false);
                trackEvent(ALREADY_ADDED_MODAL('click do not add'));
            }}
            closeButtonText={t('campaigns.modal.doNotAdd') || ''}
            okButtonText={t('campaigns.modal.addAnyway') || ''}
            onOkay={() => {
                setShow(false);
                setCampaignListModal(true);
                trackEvent(ALREADY_ADDED_MODAL('click add anyway'));
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

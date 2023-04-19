import { useTranslation } from 'react-i18next';
import { ModalWithButtons } from './library/modal-with-buttons';

export const InfluencerAlreadyAddedModal = ({
    show,
    setShow,
    setCampaignListModal,
    campaignsWithCreator,
}: {
    show: boolean;
    setShow: (show: boolean) => void;
    setCampaignListModal: (show: boolean) => void;
    campaignsWithCreator: string[];
}) => {
    const { t } = useTranslation();

    return (
        <ModalWithButtons
            title={t('campaigns.modal.addToCampaign') || ''}
            visible={!!show}
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

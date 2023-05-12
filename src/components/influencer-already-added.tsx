import { useTranslation } from 'react-i18next';
import { ModalWithButtons } from './modal-with-buttons';
import { useRudderstack } from 'src/hooks/use-rudderstack';

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
    const { trackEvent } = useRudderstack();

    return (
        <ModalWithButtons
            title={t('campaigns.modal.addToCampaign') || ''}
            visible={show}
            onClose={() => {
                setShow(false);
                trackEvent('Already Added Modal - click do not add');
            }}
            closeButtonText={t('campaigns.modal.doNotAdd') || ''}
            okButtonText={t('campaigns.modal.addAnyway') || ''}
            onOkay={() => {
                setShow(false);
                setCampaignListModal(true);
                trackEvent('Already Added Modal - click add anyway');
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

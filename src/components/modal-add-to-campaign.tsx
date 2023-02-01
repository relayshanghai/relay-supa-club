import { t } from 'i18next';
import { useCampaigns } from 'src/hooks/use-campaigns';
import { CreatorPlatform, CreatorUserProfile } from 'types';
import CampaignModalCard from './campaigns/campaign-modal-card';
import { Modal } from './modal';

export const AddToCampaignModal = ({
    show,
    setShow,
    platform,
    selectedCreator,
}: {
    show: boolean;
    setShow: (show: boolean) => void;
    platform: CreatorPlatform;
    selectedCreator: CreatorUserProfile | null;
}) => {
    const { campaigns } = useCampaigns({});

    return (
        <Modal
            title={t('campaigns.modal.addToCampaign') || ''}
            visible={!!show}
            onClose={() => setShow(false)}
        >
            <>
                <div className="py-4 text-sm text-tertiary-800">
                    {t('campaigns.modal.addThisInfluencer')}
                </div>
                {campaigns?.length ? (
                    <div>
                        {campaigns.map((campaign, index) => (
                            <CampaignModalCard
                                campaign={campaign}
                                platform={platform}
                                creator={selectedCreator}
                                key={index}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-sm text-gray-600">{t('campaigns.modal.noCampaigns')}</div>
                )}
            </>
        </Modal>
    );
};

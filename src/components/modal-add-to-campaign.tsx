import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useCampaigns } from 'src/hooks/use-campaigns';
import { CreatorPlatform, CreatorUserProfile } from 'types';
import CampaignModalCard from './campaigns/campaign-modal-card';
import { Modal } from './modal';

export const AddToCampaignModal = ({
    show,
    setShow,
    platform,
    selectedCreator,
    companyId,
}: {
    show: boolean;
    setShow: (show: boolean) => void;
    platform: CreatorPlatform;
    selectedCreator: CreatorUserProfile | null;
    companyId?: string;
}) => {
    const { t } = useTranslation();

    const { campaigns } = useCampaigns({ companyId });

    return (
        <Modal
            title={t('campaigns.modal.addToCampaign') || ''}
            visible={!!show}
            onClose={() => setShow(false)}
        >
            {campaigns?.length ? (
                <>
                    <div className="py-4 text-sm text-tertiary-800">
                        {t('campaigns.modal.addThisInfluencer')}
                    </div>
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

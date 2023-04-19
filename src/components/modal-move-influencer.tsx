import Link from 'next/link';
import type { CampaignsIndexGetResult } from 'pages/api/campaigns';
import { useTranslation } from 'react-i18next';
import type { CampaignCreatorDB, CampaignWithCompanyCreators } from 'src/utils/api/db';
import type { CreatorPlatform } from 'types';
import MoveInfluencerModalCard from './campaigns/move-influencer-modal-card';
import { Modal } from './library';

export const MoveInfluencerModal = ({
    show,
    setShow,
    platform,
    selectedCreator,
    campaigns,
    currentCampaign,
}: {
    show: boolean;
    setShow: (show: boolean) => void;
    platform: CreatorPlatform;
    selectedCreator: CampaignCreatorDB;
    campaigns: CampaignsIndexGetResult;
    currentCampaign: CampaignWithCompanyCreators;
}) => {
    const { t } = useTranslation();

    return (
        <Modal
            title={t('campaigns.modal.moveToCampaign') || ''}
            visible={show}
            onClose={() => {
                setShow(false);
            }}
        >
            {campaigns.length ? (
                <>
                    <div className="py-4 text-sm text-tertiary-800">{t('campaigns.modal.moveThisInfluencer')}</div>
                    <div>
                        {campaigns.map((campaign, index) => (
                            <MoveInfluencerModalCard
                                targetCampaign={campaign}
                                currentCampaign={currentCampaign}
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

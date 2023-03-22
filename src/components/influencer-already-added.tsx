import Link from 'next/link';
import { CampaignsIndexGetResult } from 'pages/api/campaigns';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CampaignWithCompanyCreators } from 'src/utils/api/db';
import type { CreatorPlatform, CreatorUserProfile } from 'types';
import CampaignModalCard from './campaigns/campaign-modal-card';
import { DialogModal } from './dialog-modal';
import { Modal } from './modal';

export const InfluencerAlreadyAddedModal = ({
    show,
    setShow,
    setCampaignListModal,
    campaignsWithCreator,
}: {
    show: boolean;
    setShow: (show: boolean) => void;
    setCampaignListModal: (show: boolean) => void;
    campaignsWithCreator: CampaignWithCompanyCreators[];
}) => {
    const { t } = useTranslation();

    return (
        <DialogModal
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
                    {t('campaigns.modal.influencerAlreadyAdded')}{' '}
                    {campaignsWithCreator?.map((campaign) => campaign).join(', ')}
                </p>
            </div>
        </DialogModal>
    );
};

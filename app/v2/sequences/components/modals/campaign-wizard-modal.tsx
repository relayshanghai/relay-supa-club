import { useTranslation } from 'react-i18next';
import { CampaignModalStepOne } from './campaign-modal-steps/step-1';
import { CampaignModalStepTwo } from './campaign-modal-steps/step-2';
import { CampaignModalStepThree } from './campaign-modal-steps/step-3';
import { WizardModal } from './wizard-modal/wizard-modal';
import { type WizardStep } from '../../types';
import { useEffect, useState } from 'react';
import { useDriverV2 } from 'src/hooks/use-driver-v2';

export const CampaignWizardModal = ({
    showCreateCampaignModal,
    setShowCreateCampaignModal,
}: {
    showCreateCampaignModal: boolean;
    setShowCreateCampaignModal: (showCreateCampaignModal: boolean) => void;
}) => {
    const { t } = useTranslation();
    const [activeModalStep, setActiveModalStep] = useState(0);

    const { startTour, guidesReady } = useDriverV2();
    const steps: WizardStep[] = [
        {
            component: CampaignModalStepOne,
            title: t('outreaches.chooseStartingPoint'),
            description: t('outreaches.starterOrBlank'),
        },
        {
            component: CampaignModalStepTwo,
            title: t('outreaches.nameYourTemplate'),
            description: t('outreaches.nameAndBriefDescription'),
        },
        {
            component: CampaignModalStepThree,
            title: t('outreaches.setTemplateVariables'),
            description: t('outreaches.canDoNowOrLater'),
        },
    ];

    useEffect(() => {
        if (showCreateCampaignModal && guidesReady) {
            if (activeModalStep === 1) {
                startTour('campaignWizardStep1');
            } else if (activeModalStep === 2) {
                startTour('campaignWizardStep2');
            } else if (activeModalStep === 3) {
                startTour('campaignWizardStep3');
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [guidesReady, showCreateCampaignModal, activeModalStep]);

    return (
        <WizardModal
            show={showCreateCampaignModal}
            setShow={setShowCreateCampaignModal}
            steps={steps}
            setActiveStep={(step) => setActiveModalStep(step)}
        />
    );
};

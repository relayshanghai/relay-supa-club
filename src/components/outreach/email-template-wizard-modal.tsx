import { useTranslation } from 'react-i18next';
import { CampaignModalStepOne } from './email-template-modal-steps/step-1';
import { CampaignModalStepTwo } from './email-template-modal-steps/step-2';
import { CampaignModalStepThree } from './email-template-modal-steps/step-3';
import { WizardModal } from './wizard-modal/wizard-modal';
import { type WizardStep } from './types';

export const EmailTemplateWizardModal = ({
    modalOpen,
    setModalOpen,
}: {
    modalOpen: boolean;
    setModalOpen: (showCreateCampaignModal: boolean) => void;
}) => {
    const { t } = useTranslation();
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
    return <WizardModal show={modalOpen} setShow={setModalOpen} steps={steps} />;
};

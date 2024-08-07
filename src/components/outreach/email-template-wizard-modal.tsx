import { useTranslation } from 'react-i18next';
import { EmailTemplateModalStepOne } from './email-template-modal-steps/step-1';
import { EmailTemplateModalStepThree } from './email-template-modal-steps/step-3';
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
            component: EmailTemplateModalStepOne,
            title: t('outreaches.chooseStartingPoint'),
            description: t('outreaches.starterOrBlank'),
        },
        {
            component: EmailTemplateModalStepThree,
            title: t('outreaches.setTemplateContent'),
            description: t('outreaches.subjectAndEmailBody'),
        },
        {
            component: EmailTemplateModalStepThree,
            title: t('outreaches.nameYourTemplate'),
            description: t('outreaches.nameAndBriefDescription'),
        },
    ];
    return <WizardModal show={modalOpen} setShow={setModalOpen} steps={steps} stepsDisabled={[1]} />;
};

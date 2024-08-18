import { useTranslation } from 'react-i18next';
import { EmailTemplateModalStepOne } from './email-template-modal-steps/step-1';
import { EmailTemplateModalStepTwo } from './email-template-modal-steps/step-2';
import { WizardModal } from './wizard-modal/wizard-modal';
import type { WizardStep } from '../../types';
import { useDriverV2 } from 'src/hooks/use-driver-v2';
import { useEffect, useState } from 'react';

export const EmailTemplateWizardModal = ({
    modalOpen,
    setModalOpen,
}: {
    modalOpen: boolean;
    setModalOpen: (showCreateCampaignModal: boolean) => void;
}) => {
    const { t } = useTranslation();
    const [activeModalStep, setActiveModalStep] = useState(0);

    const { startTour, guidesReady } = useDriverV2();

    const steps: WizardStep[] = [
        {
            component: EmailTemplateModalStepOne,
            title: t('outreaches.chooseStartingPoint'),
            description: t('outreaches.starterOrBlank'),
        },
        {
            component: EmailTemplateModalStepOne,
            title: t('outreaches.setTemplateContent'),
            description: t('outreaches.subjectAndEmailBody'),
        },
        {
            component: EmailTemplateModalStepTwo,
            title: t('outreaches.nameYourTemplate'),
            description: t('outreaches.nameAndBriefDescription'),
        },
    ];

    useEffect(() => {
        if (modalOpen && guidesReady) {
            if (activeModalStep === 2) {
                startTour('templateLibraryWizardStep1');
            } else if (activeModalStep === 3) {
                startTour('templateLibraryWizardStep2');
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [guidesReady, modalOpen, activeModalStep]);

    return (
        <WizardModal
            show={modalOpen}
            setShow={setModalOpen}
            steps={steps}
            stepsDisabled={[1]}
            setActiveStep={(step) => setActiveModalStep(step)}
        />
    );
};

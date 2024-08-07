import { type FC } from 'react';

export type ModalStepProps = {
    setModalOpen: (visible: boolean) => void;
    onNextStep: () => void;
    onPrevStep: () => void;
};

export type WizardStep = {
    title: string;
    description: string;
    component: FC<ModalStepProps>;
};

export type WizardModalProps = {
    show: boolean;
    setShow: (show: boolean) => void;
    steps: WizardStep[];
};

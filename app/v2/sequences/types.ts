import { type FC } from 'react';
import { OUTREACH_STATUSES } from 'src/utils/outreach/constants';

export type OutreachStatus = (typeof OUTREACH_STATUSES)[number];

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
    stepsDisabled?: number[];
};

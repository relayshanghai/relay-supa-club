import { Cross } from '../icons';
import { Modal } from '../modal';
import { CampaignModalStepOne } from './modal-steps/step-1';
import { CampaignModalStepTwo } from './modal-steps/step-2';
import { ModalHeader } from './create-campaign-modal-header';
import { useState } from 'react';
import { CampaignModalStepThree } from './modal-steps/step-3';

export type ModalStepProps = {
    setModalOpen: (visible: boolean) => void;
    onNextStep: () => void;
    onPrevStep: () => void;
};

export const CreateCampaignModal = ({
    showCreateCampaignModal,
    setShowCreateCampaignModal,
}: {
    title: string;
    showCreateCampaignModal: boolean;
    setShowCreateCampaignModal: (showCreateCampaignModal: boolean) => void;
}) => {
    const [step, setStep] = useState<number>(1);

    const onNextStep = () => setStep(step + 1);
    const onPrevStep = () => setStep(step - 1);

    return (
        <Modal visible={showCreateCampaignModal} onClose={() => null} padding={0} maxWidth="!w-[960px]">
            <div className="relative inline-flex h-[680px] w-[960px] flex-col items-start justify-start rounded-lg bg-violet-50 shadow">
                <div
                    className="absolute right-2 top-2 z-10 h-6 w-6 cursor-pointer"
                    onClick={() => setShowCreateCampaignModal(false)}
                >
                    <Cross className="flex h-6 w-6 fill-white stroke-white" />
                </div>
                <ModalHeader step={step.toString() as '1' | '2' | '3'} />
                {/* body start */}
                {step === 1 && (
                    <CampaignModalStepOne
                        onNextStep={onNextStep}
                        onPrevStep={onPrevStep}
                        setModalOpen={(v) => setShowCreateCampaignModal(v)}
                    />
                )}
                {step === 2 && (
                    <CampaignModalStepTwo
                        onNextStep={onNextStep}
                        onPrevStep={onPrevStep}
                        setModalOpen={(v) => setShowCreateCampaignModal(v)}
                    />
                )}
                {step === 3 && (
                    <CampaignModalStepThree
                        onNextStep={onNextStep}
                        onPrevStep={onPrevStep}
                        setModalOpen={(v) => setShowCreateCampaignModal(v)}
                    />
                )}
                {/* body end */}
            </div>
        </Modal>
    );
};

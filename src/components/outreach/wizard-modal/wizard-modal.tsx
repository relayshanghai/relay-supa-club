import { type FC, useState } from 'react';
import { Modal } from 'src/components/modal';
import { Cross } from 'src/components/icons';
import { ModalHeader } from './wizard-modal-header';
import { type WizardModalProps } from '../types';

export const WizardModal: FC<WizardModalProps> = ({ show, setShow, steps }) => {
    const [step, setStep] = useState<number>(1);

    const onNextStep = () => setStep(step + 1);
    const onPrevStep = () => setStep(step - 1);

    return (
        <Modal visible={show} onClose={() => null} padding={0} maxWidth="!w-[960px]">
            <div className="relative inline-flex h-[680px] w-[960px] flex-col items-start justify-start rounded-lg bg-violet-50 shadow">
                <div className="absolute right-2 top-2 z-10 h-6 w-6 cursor-pointer" onClick={() => setShow(false)}>
                    <Cross className="flex h-6 w-6 fill-white stroke-white" />
                </div>
                <ModalHeader
                    step={step}
                    steps={steps.map((d) => ({
                        title: d.title,
                        description: d.description,
                    }))}
                />
                {steps.map((d, i) => {
                    const Component = d.component;
                    return step === i + 1 ? (
                        <Component
                            key={i}
                            onNextStep={onNextStep}
                            onPrevStep={onPrevStep}
                            setModalOpen={(v) => setShow(v)}
                        />
                    ) : null;
                })}
            </div>
        </Modal>
    );
};

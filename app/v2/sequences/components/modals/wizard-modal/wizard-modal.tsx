import { type FC, useEffect, useState } from 'react';
import { Modal } from 'src/components/modal';
import { Cross } from 'src/components/icons';
import { ModalHeader } from './wizard-modal-header';
import { type WizardModalProps } from 'app/v2/sequences/types';

export const WizardModal: FC<WizardModalProps> = ({ show, setShow, steps, stepsDisabled, setActiveStep }) => {
    const getUnDisabledNextStep = (s: number): number => {
        if (stepsDisabled?.includes(s + 1)) {
            return getUnDisabledNextStep(s + 1);
        }
        return s + 1;
    };

    const getUndisabledPrevStep = (s: number): number => {
        if (stepsDisabled?.includes(s - 1)) {
            return getUndisabledPrevStep(s - 1);
        }
        return s - 1;
    };

    const [step, setStep] = useState<number>(stepsDisabled?.includes(1) ? getUnDisabledNextStep(1) : 1);

    const onNextStep = () => {
        // check if next step is disabled
        if (stepsDisabled?.includes(step + 1)) {
            return setStep(getUnDisabledNextStep(step));
        }
        setStep(step + 1);
    };
    const onPrevStep = () => {
        // check if prev step is disabled
        if (stepsDisabled?.includes(step - 1)) {
            return setStep(getUndisabledPrevStep(step));
        }
        setStep(step - 1);
    };

    useEffect(() => {
        setActiveStep && setActiveStep(step);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [step]);

    return (
        <Modal visible={show} onClose={() => null} padding={0} maxWidth="!w-[960px]">
            <div className="relative inline-flex h-[680px] w-[960px] flex-col items-start justify-start rounded-lg bg-violet-50 shadow">
                <div
                    className="absolute right-2 top-2 z-10 h-6 w-6 cursor-pointer"
                    onClick={() => {
                        setShow(false);
                        setStep(getUnDisabledNextStep(0));
                    }}
                >
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
                            setModalOpen={(v) => {
                                setShow(v);
                                if (!v) {
                                    setStep(getUnDisabledNextStep(0));
                                }
                            }}
                        />
                    ) : null;
                })}
            </div>
        </Modal>
    );
};

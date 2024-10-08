import { type FC } from 'react';
import { CheckIcon } from 'src/components/icons';

type StepProperty = {
    title: string;
    description: string;
};

type ModalHeaderProps = {
    step: number;
    steps: StepProperty[];
};

export const ModalHeader: FC<ModalHeaderProps> = ({ step, steps }) => {
    const stepStyles = {
        pending: {
            text: 'text-violet-200',
            center: (
                <div className="relative flex h-6 w-6 flex-col items-start justify-start rounded-xl border border-violet-50 bg-violet-50">
                    <div className="inline-flex h-full w-full items-center justify-center rounded-xl border-4 border-violet-50 bg-violet-50">
                        <div className="h-2 w-2 rounded-full bg-violet-400" />
                    </div>
                </div>
            ),
        },
        active: {
            text: 'text-white',
            center: (
                <div className="relative flex h-6 w-6 flex-col items-start justify-start rounded-xl border border-violet-400 bg-violet-400">
                    <div className="inline-flex h-full w-full items-center justify-center rounded-xl border-4 border-violet-400 bg-violet-200">
                        <div className="h-2 w-2 rounded-full bg-violet-50" />
                    </div>
                </div>
            ),
        },
        complete: {
            text: 'text-violet-400',
            center: <CheckIcon className="flex h-4 w-4 stroke-white" />,
        },
    };

    const defineStep = (step: number, currentStep: number) => {
        if (step === currentStep) return stepStyles.active;
        if (step < currentStep) return stepStyles.complete;
        return stepStyles.pending;
    };

    return (
        <div
            className="inline-flex items-start justify-between self-stretch rounded-t-lg bg-gradient-to-tr from-violet-900 to-violet-700 pl-8 pr-3 pt-4"
            data-testid="modal-header"
        >
            <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start">
                <div className="inline-flex w-[896px] items-start justify-between pb-3 pt-2">
                    <div className="relative flex h-[68px] shrink grow basis-0 items-start justify-between">
                        {/* step line */}
                        <div
                            className="absolute left-[150px] top-3 inline-flex h-1 w-[640px] items-start justify-start"
                            data-testid="modal-step-line"
                        >
                            <div className="h-0.5 shrink grow basis-0 bg-violet-200" />
                            <div className="h-0.5 shrink grow basis-0 bg-violet-50" />
                        </div>
                        {/* step line */}

                        {/* steps */}
                        {steps.map((s, i) => (
                            <div
                                key={s.title}
                                className="inline-flex w-80 flex-col items-center justify-start gap-3"
                                data-testid="modal-step-1-indicator"
                            >
                                <div className="inline-flex h-6 w-6 items-center justify-center rounded-xl bg-violet-50">
                                    <div className="relative flex h-6 w-6 flex-col items-center justify-center rounded-xl border border-violet-400 bg-violet-400">
                                        {defineStep(i + 1, step).center}
                                    </div>
                                </div>
                                <div className="flex h-8 flex-col items-center justify-start self-stretch">
                                    <div
                                        className={`self-stretch text-center font-['Poppins'] text-xs font-semibold leading-none ${
                                            defineStep(i + 1, step).text
                                        }`}
                                        data-testid="step-1-active-indicator"
                                    >
                                        {s.title}
                                    </div>
                                    <div
                                        className={`self-stretch text-center font-['Poppins'] text-xs font-normal leading-none ${
                                            defineStep(i + 1, step).text
                                        }`}
                                    >
                                        {s.description}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {/* steps */}
                    </div>
                </div>
            </div>
            <div className="relative h-6 w-6" />
        </div>
    );
};

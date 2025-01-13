import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Progress } from '../library';
import { FormWizardContext } from 'src/context/form-wizard-context';
interface StepsType {
    title: string;
    num: number;
}

export const FormWizard = ({
    title,
    children,
    steps,
    currentStep: currentStepProp = 1,
    showProgress = true,
    getCurrentStep,
}: {
    title: string;
    children: ReactNode;
    currentStep?: number;
    steps?: StepsType[];
    showProgress?: boolean;
    getCurrentStep?: (step: number) => void;
}) => {
    const [currentStep, setCurrentStep] = useState<number>(currentStepProp);
    const contextValue = useMemo(() => ({ currentStep, setCurrentStep }), [currentStep, setCurrentStep]);
    useEffect(() => {
        setCurrentStep(currentStepProp);
        getCurrentStep && getCurrentStep(currentStepProp);
    }, [currentStepProp, getCurrentStep]);
    return (
        <FormWizardContext.Provider value={contextValue}>
            {/* The width is to match the exact design on Figma */}
            <div className="w-80 lg:w-[28rem]">
                {Boolean(showProgress && currentStep && steps) && (
                    <Progress height="small" percentage={(currentStep / (steps ?? []).length) * 100} className="mb-2" />
                )}
                <div className="flex flex-col rounded shadow-md">
                    <form
                        onSubmit={(e) => e.preventDefault()}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                            }
                        }}
                    >
                        <div className="border-b-gray-100 bg-gray-100 p-5 text-base font-semibold text-gray-500">
                            {title}
                        </div>
                        <div className="p-5">{children}</div>
                    </form>
                </div>
            </div>
        </FormWizardContext.Provider>
    );
};

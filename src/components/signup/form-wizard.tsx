import { useTranslation } from 'react-i18next';
import type { ReactNode } from 'react';
import { Progress } from '../library';
import { Button } from '../button';

interface stepsType {
    title: string;
    num: number;
}

export const FormWizard = ({
    title,
    children,
    steps,
    currentStep,
    setCurrentStep,
}: {
    title: string;
    children: ReactNode;
    currentStep: number;
    steps: stepsType[];
    setCurrentStep: (step: number) => void;
}) => {
    const { t } = useTranslation();

    return (
        <div className="w-80">
            <Progress height="small" percentage={((currentStep - 1) / steps.length) * 100} className="mb-2" />
            <div className="flex flex-col rounded shadow-sm">
                <div className="border-b-gray-100 bg-gray-100 p-5 font-semibold text-gray-500">{title}</div>
                <div className="p-5">{children}</div>
                <div className="m-4 flex justify-between">
                    {currentStep === 1 ? (
                        <></>
                    ) : (
                        <Button variant="secondary" className="w-32" onClick={() => setCurrentStep(currentStep - 1)}>
                            {t('signup.back')}
                        </Button>
                    )}
                    <Button className="w-32" onClick={() => setCurrentStep(currentStep + 1)}>
                        {currentStep === steps.length ? t('signup.submit') : t('signup.next')}
                    </Button>
                </div>
            </div>
        </div>
    );
};

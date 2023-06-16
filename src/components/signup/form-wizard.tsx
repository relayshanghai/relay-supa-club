import { useTranslation } from 'react-i18next';
import type { ReactNode } from 'react';
import { Progress } from '../library';
import { Button } from '../button';
// import type { UseFormHandleSubmit } from 'react-hook-form';

interface stepsType {
    title: string;
    num: number;
}

export const FormWizard = ({
    title,
    children,
    steps,
    currentStep,
    handleSubmit,
    onNext,
    onBack,
    loading,
}: {
    title: string;
    children: ReactNode;
    currentStep: number;
    steps: stepsType[];
    handleSubmit: any;
    onNext: any; //TODO: update the type before push
    onBack: () => void;
    loading: boolean;
}) => {
    const { t } = useTranslation();

    return (
        // The width is to match the exact design on Figma
        <div className="w-80 lg:w-[28rem]">
            <Progress height="small" percentage={((currentStep - 1) / steps.length) * 100} className="mb-2" />
            <div className="flex flex-col rounded shadow-md">
                <form>
                    <div className="border-b-gray-100 bg-gray-100 p-5 text-base font-semibold text-gray-500">
                        {title}
                    </div>
                    <div className="p-5">{children}</div>
                    <div className="m-5 flex justify-between">
                        {currentStep === 1 ? (
                            <Button disabled={loading} className="w-full" onClick={onNext}>
                                {t('signup.next')}
                            </Button>
                        ) : (
                            <>
                                <Button variant="secondary" className="w-32 lg:w-44" onClick={onBack}>
                                    {t('signup.back')}
                                </Button>
                                <Button
                                    disabled={loading}
                                    type="submit"
                                    className="w-32 lg:w-44"
                                    onClick={handleSubmit(onNext)}
                                >
                                    {currentStep === steps.length ? t('signup.submit') : t('signup.next')}
                                </Button>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

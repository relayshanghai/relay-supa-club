import { useTranslation } from 'react-i18next';
import type { ReactNode } from 'react';
import { Progress } from '../library';
import { Button } from '../button';
import type { FieldValues, UseFormHandleSubmit } from 'react-hook-form';
// import { useUser } from 'src/hooks/use-user';

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
    formData,
}: {
    title: string;
    children: ReactNode;
    currentStep: number;
    steps: stepsType[];
    setCurrentStep: (step: number) => void;
    handleSubmit: UseFormHandleSubmit<FieldValues, undefined>;
    formData: FieldValues;
}) => {
    const { t } = useTranslation();
    // const { signup } = useUser();

    const handleProfileCreate = async (formData: FieldValues) => {
        const { firstName, lastName, phoneNumber, email, password } = formData;
        const data = {
            email,
            password,
            data: {
                first_name: firstName,
                last_name: lastName,
                phone: phoneNumber,
            },
        };
        //eslint-disable-next-line
        console.log('Create Profile', data);
        // try {
        //     const signUpProfileRes = await signup(data);
        //     console.log('signup!!', signUpProfileRes);
        // } catch (error) {
        //     clientLogger(error, 'error');
        // }
    };

    const handleCompanyCreate = async (formData: FieldValues) => {
        const { companyName, companyWebsite, companyCategories, companySize } = formData;
        const data = {
            name: companyName,
            website: companyWebsite,
            categories: companyCategories,
            size: companySize,
        };
        //eslint-disable-next-line
        console.log('Create Company!', data);
    };

    const handleNext = () => {
        if (currentStep === steps.length) {
            return;
        }
        setCurrentStep(currentStep + 1);
        // console.log(formData);
        if (currentStep === 2) {
            handleProfileCreate(formData);
        }
        if (currentStep === 4) {
            handleCompanyCreate(formData);
        }
    };

    const handleBack = () => {
        if (currentStep === 1) {
            return;
        }
        setCurrentStep(currentStep - 1);
    };

    return (
        // The width is to match the exact design on Figma
        <div className="w-80 lg:w-[28rem]">
            <Progress height="small" percentage={((currentStep - 1) / steps.length) * 100} className="mb-2" />
            <div className="flex flex-col rounded shadow-md">
                <div className="border-b-gray-100 bg-gray-100 p-5 text-base font-semibold text-gray-500">{title}</div>
                <div className="p-5">{children}</div>
                <div className="m-5 flex justify-between">
                    {currentStep === 1 ? (
                        <Button className="w-full" onClick={() => setCurrentStep(currentStep + 1)}>
                            {t('signup.next')}
                        </Button>
                    ) : (
                        <>
                            <Button variant="secondary" className="w-32 lg:w-44" onClick={() => handleBack()}>
                                {t('signup.back')}
                            </Button>
                            <Button type="submit" className="w-32 lg:w-44" onClick={() => handleNext()}>
                                {currentStep === steps.length ? t('signup.submit') : t('signup.next')}
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

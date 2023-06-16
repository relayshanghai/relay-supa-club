import { useTranslation } from 'react-i18next';
import { useState, type ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { Progress } from '../library';
import { Button } from '../button';
import type { FieldValues, UseFormHandleSubmit } from 'react-hook-form';
import { useUser } from 'src/hooks/use-user';
import { useCompany } from 'src/hooks/use-company';
import { clientLogger } from 'src/utils/logger-client';
import { EMPLOYEE_EMAILS } from 'src/constants/employeeContacts';
import { hasCustomError } from 'src/utils/errors';
import { createCompanyErrors, createCompanyValidationErrors } from 'src/errors/company';

interface stepsType {
    title: string;
    num: number;
}
const CompanyErrors = {
    ...createCompanyErrors,
    ...createCompanyValidationErrors,
};

export const FormWizard = ({
    title,
    children,
    steps,
    currentStep,
    setCurrentStep,
    handleSubmit,
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
    const router = useRouter();
    const { signup, createEmployee, profile } = useUser();
    const { createCompany } = useCompany();

    const [signupSuccess, setSignupSuccess] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const handleNext = async (data: FieldValues) => {
        // console.log(data.companyCategory);
        setSelectedCategory(data.companyCategory);
        // console.log('selectedCategory', selectedCategory);
        if (currentStep === steps.length) {
            return;
        }
        setCurrentStep(currentStep + 1);
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
        // console.log('profileData', data);
        try {
            setLoading(true);
            const signUpProfileRes = await signup(data);
            if (signUpProfileRes?.session?.user.id) {
                if (EMPLOYEE_EMAILS.includes(email)) {
                    const employeeRes = await createEmployee(email);
                    if (employeeRes?.id) {
                        setSignupSuccess(true);
                    } else {
                        throw new Error('Could not create employee');
                    }
                }
            } else {
                throw new Error('Could not sign up');
            }
        } catch (error: any) {
            clientLogger(error, 'error');
            // this is a supabase provided error so we don't have our custom error handling
            if (error?.message === 'User already registered') {
                toast.error(t('login.userAlreadyRegistered'));
            } else {
                toast.error(t('login.oopsSomethingWentWrong'));
            }
            setLoading(false);
        }
        // why do we not set loading to false here? Because sometimes the user is logged in but the profile has not loaded yet. The next page needs the profile ready. Therefore we wait in the useEffect above for the profile to load before redirecting.
    };

    const handleCompanyCreate = async (formData: FieldValues) => {
        const { companyName, companyWebsite, companySize } = formData;
        const data = {
            name: companyName,
            website: companyWebsite,
            category: selectedCategory,
            size: companySize,
        };
        // console.log('Create Company!', data);
        try {
            setLoading(true);
            const signupCompanyRes = await createCompany(data);
            if (!signupCompanyRes?.cus_id) {
                throw new Error('no cus_id, error creating company');
            }
        } catch (e: any) {
            clientLogger(e, 'error');
            if (hasCustomError(e, CompanyErrors)) {
                toast.error(t(`login.${e.message}`));
            } else {
                toast.error(t('login.oopsSomethingWentWrong'));
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (signupSuccess && profile?.id) {
            if (EMPLOYEE_EMAILS.includes(formData.email)) {
                router.push('/dashboard');
            }
        }
    }, [profile?.id, router, signupSuccess, formData.email]);

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
                            <Button
                                disabled={loading}
                                className="w-full"
                                onClick={() => setCurrentStep(currentStep + 1)}
                            >
                                {t('signup.next')}
                            </Button>
                        ) : (
                            <>
                                <Button variant="secondary" className="w-32 lg:w-44" onClick={() => handleBack()}>
                                    {t('signup.back')}
                                </Button>
                                <Button
                                    disabled={loading}
                                    type="submit"
                                    className="w-32 lg:w-44"
                                    onClick={handleSubmit(handleNext)}
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

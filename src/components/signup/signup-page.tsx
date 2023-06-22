import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FormWizard } from './form-wizard';
import { OnboardPaymentSection } from './onboard-payment-section';
import { validateSignupInput } from 'src/utils/validation/signup';
import { useFields } from 'src/hooks/use-fields';
import { StepOne, StepTwo, StepThree, StepFour } from './steps';
import { createCompanyErrors, createCompanyValidationErrors } from 'src/errors/company';
import { clientLogger } from 'src/utils/logger-client';
import { hasCustomError } from 'src/utils/errors';
import { useUser } from 'src/hooks/use-user';
import { useCompany } from 'src/hooks/use-company';
import type { SignupInputTypes } from 'src/utils/validation/signup';
import type { FieldValues } from 'react-hook-form';
import { EMPLOYEE_EMAILS } from 'src/constants/employeeContacts';

export interface SignUpValidationErrors {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    phoneNumber?: string;
    companyName: string;
    companyWebsite?: string;
}

const CompanyErrors = {
    ...createCompanyErrors,
    ...createCompanyValidationErrors,
};

const SignUpPage = ({ selectedPriceId }: { selectedPriceId: string }) => {
    const { t } = useTranslation();
    const router = useRouter();
    const { signup, createEmployee, profile } = useUser();
    const { createCompany } = useCompany();

    const {
        values: { firstName, lastName, email, password, confirmPassword, phoneNumber, companyName, companyWebsite },
        setFieldValue,
    } = useFields({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        companyName: '',
        companyWebsite: '',
    });

    const [currentStep, setCurrentStep] = useState(1);
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [validationErrors, setValidationErrors] = useState<SignUpValidationErrors>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        companyName: '',
        companyWebsite: '',
    });
    const [createProfileSuccess, setCreateProfileSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const formData = {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        phoneNumber,
        companyName,
        companyWebsite,
        companySize: selectedSize,
        companyCategory: selectedCategory,
    };

    const steps = [
        {
            title: t('signup.step1title'),
            num: 1,
        },
        {
            title: t('signup.step2title'),
            num: 2,
        },
        {
            title: t('signup.step3title'),
            num: 3,
        },
        {
            title: t('signup.step4title'),
            num: 4,
        },
        {
            title: t('signup.step5title'),
            num: 5,
        },
    ];

    //TODO: phone validation need to be updated
    const setAndValidate = (type: SignupInputTypes, value: string) => {
        setFieldValue(type, value);
        const validationError = validateSignupInput(type, value, password);
        if (validationError) {
            setValidationErrors({ ...validationErrors, [type]: t(validationError) });
        } else {
            setValidationErrors({ ...validationErrors, [type]: '' });
        }
    };

    const onNext = async () => {
        if (currentStep === steps.length) {
            return;
        }

        if (currentStep === 2) {
            await handleProfileCreate(formData);
        } else if (currentStep === 4) {
            await handleCompanyCreate(formData);
        } else {
            setCurrentStep(currentStep + 1);
        }
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
        try {
            setLoading(true);
            const signupProfileRes = await signup(data);
            if (signupProfileRes?.session?.user.id) {
                if (EMPLOYEE_EMAILS.includes(email)) {
                    const employeeRes = await createEmployee(email);
                    if (employeeRes?.id) {
                        setCreateProfileSuccess(true);
                    } else {
                        throw new Error('Could not create employee');
                    }
                } else {
                    setCreateProfileSuccess(true);
                }
                setCurrentStep(currentStep + 1);
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
        }
        setLoading(false);
    };

    const handleCompanyCreate = async (formData: FieldValues) => {
        const { companyName, companyWebsite, companySize, companyCategory } = formData;
        const data = {
            name: companyName,
            website: companyWebsite,
            category: companyCategory,
            size: companySize,
        };
        try {
            setLoading(true);
            if (!createProfileSuccess || !profile?.id) {
                throw new Error('no profile id');
            }
            const signupCompanyRes = await createCompany(data);
            if (!signupCompanyRes?.cus_id) {
                throw new Error('no cus_id, error creating company');
            }
            setCurrentStep(currentStep + 1);
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
        if (createProfileSuccess && profile?.id && EMPLOYEE_EMAILS.includes(email)) {
            router.push('/dashboard');
        }
    }, [email, router, createProfileSuccess, profile?.id]);

    return (
        <div>
            {steps.map(
                (step) =>
                    step.num === currentStep && (
                        <FormWizard title={step.title} key={step.num} steps={steps} currentStep={currentStep}>
                            {currentStep === 1 && (
                                <StepOne
                                    firstName={firstName}
                                    lastName={lastName}
                                    phoneNumber={phoneNumber}
                                    validationErrors={validationErrors}
                                    setAndValidate={setAndValidate}
                                    loading={loading}
                                    onNext={onNext}
                                />
                            )}

                            {currentStep === 2 && (
                                <StepTwo
                                    email={email}
                                    password={password}
                                    confirmPassword={confirmPassword}
                                    setAndValidate={setAndValidate}
                                    validationErrors={validationErrors}
                                    loading={loading}
                                    onNext={onNext}
                                />
                            )}

                            {currentStep === 3 && (
                                <StepThree
                                    setSelectedCategory={setSelectedCategory}
                                    loading={loading}
                                    onNext={onNext}
                                />
                            )}

                            {currentStep === 4 && (
                                <StepFour
                                    companyName={companyName}
                                    companyWebsite={companyWebsite}
                                    setSelectedSize={setSelectedSize}
                                    setAndValidate={setAndValidate}
                                    validationErrors={validationErrors}
                                    loading={loading}
                                    onNext={onNext}
                                />
                            )}

                            {currentStep === 5 && <OnboardPaymentSection priceId={selectedPriceId} />}
                        </FormWizard>
                    ),
            )}
        </div>
    );
};

export default SignUpPage;

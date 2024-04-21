import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { useState, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FormWizard } from './form-wizard';
import { validateSignupInput } from 'src/utils/validation/signup';
import { StepOne, StepTwo, StepThree } from './steps';
import { createCompanyErrors, createCompanyValidationErrors } from 'src/errors/company';
import { clientLogger } from 'src/utils/logger-client';
import { hasCustomError } from 'src/utils/errors';
import type { SignupInputTypes } from 'src/utils/validation/signup';
import Link from 'next/link';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { Button } from '../button';
import { CompleteSignupStep, GoToLogin } from 'src/utils/analytics/events';
import type { SignupPostBody } from 'pages/api/signup';
import { useUser } from 'src/hooks/use-user';
import { usePersistentState } from 'src/hooks/use-persistent-state';
import { truncatedText } from 'src/utils/outreach/helpers';
import { ReCaptchaProvider } from 'next-recaptcha-v3';
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

const signupErrors = {
    ...createCompanyErrors,
    ...createCompanyValidationErrors,
};

const PROFILE_FORM_STEP = 1;
const EMAIL_FORM_STEP = 2;
const COMPANY_FORM_STEP = 3;

const steps = [
    {
        title: 'signup.step1title',
        num: PROFILE_FORM_STEP,
    },
    {
        title: 'signup.step2title',
        num: EMAIL_FORM_STEP,
    },
    {
        title: 'signup.step3title',
        num: COMPANY_FORM_STEP,
    },
];

const SignUpPage = ({
    currentStep,
    setCurrentStep,
}: {
    currentStep: number;
    setCurrentStep: (step: number) => void;
    selectedPriceId: string;
}) => {
    const { t } = useTranslation();
    const router = useRouter();
    const { track } = useRudderstackTrack();
    const { login, logout, signup } = useUser();

    const [firstName, setFirstName, removeFirstName] = usePersistentState('firstName', '');
    const [lastName, setLastName, removeLastName] = usePersistentState('lastName', '');
    const [email, setEmail, removeEmail] = usePersistentState('email', '');
    const [password, setPassword, removePassword] = usePersistentState('password', '');
    const [confirmPassword, setConfirmPassword, removeConfirmPassword] = usePersistentState('confirmPassword', '');
    const [phoneNumber, setPhoneNumber, removePhoneNumber] = usePersistentState('phoneNumber', '');
    const [companyName, setCompanyName, removeCompanyName] = usePersistentState('companyName', '');
    const [companyWebsite, setCompanyWebsite, removeCompanyWebsite] = usePersistentState('companyWebsite', '');
    const [rewardfulReferral, setRewardfulReferral] = useState<string>();
    const setFieldValue = useCallback(
        (type: SignupInputTypes, value: string) => {
            switch (type) {
                case 'firstName':
                    setFirstName(value);
                    break;
                case 'lastName':
                    setLastName(value);
                    break;
                case 'email':
                    setEmail(value);
                    break;
                case 'password':
                    setPassword(value);
                    break;
                case 'confirmPassword':
                    setConfirmPassword(value);
                    break;
                case 'phoneNumber':
                    setPhoneNumber(value);
                    break;
                case 'companyName':
                    setCompanyName(value);
                    break;
                case 'companyWebsite':
                    setCompanyWebsite(value);
                    break;
                default:
                    break;
            }
        },
        [
            setFirstName,
            setLastName,
            setEmail,
            setPassword,
            setConfirmPassword,
            setPhoneNumber,
            setCompanyName,
            setCompanyWebsite,
        ],
    );

    const clearForm = useCallback(() => {
        removeFirstName();
        removeLastName();
        removeEmail();
        removePassword();
        removeConfirmPassword();
        removePhoneNumber();
        removeCompanyName();
        removeCompanyWebsite();
    }, [
        removeCompanyName,
        removeCompanyWebsite,
        removeConfirmPassword,
        removeEmail,
        removeFirstName,
        removeLastName,
        removePassword,
        removePhoneNumber,
    ]);

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
        rewardfulReferral,
    };

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

    const handleSignup = useCallback(
        async (data: SignupPostBody) => {
            try {
                setLoading(true);

                const signupCompanyRes: any = await signup(data);
                if (!signupCompanyRes?.cusId) {
                    throw new Error('no cusId, error creating company');
                } else {
                    await login(email, password);
                    return 'success';
                }
            } catch (e: any) {
                clientLogger(e, 'error');
                if (e?.message.includes('User already registered')) {
                    toast.error(t('login.emailDomainNotAllowed', { domain: email.split('@')[1] }));
                }
                if (e?.message.includes('This email domain is blocked')) {
                    toast.error(t('login.emailDomainNotAllowed', { domain: email.split('@')[1] }));
                } else if (hasCustomError(e, signupErrors)) {
                    toast.error(t(`login.${e.message}`));
                } else {
                    toast.error(`${t('login.oopsSomethingWentWrong')} ${truncatedText(e?.message, 40)}`);
                }
            } finally {
                setLoading(false);
            }
        },
        [signup, email, login, password, t],
    );

    const onNext = async () => {
        if (currentStep === PROFILE_FORM_STEP) {
            await logout(false);
        }
        if (currentStep === COMPANY_FORM_STEP) {
            const result = await handleSignup(formData);
            if (result === 'success') {
                clearForm();
                router.push('/boostbot');
            }
        } else {
            setCurrentStep(currentStep + 1);
        }

        await track(CompleteSignupStep, {
            current_step: currentStep,
            firstName,
            lastName,
            email,
            phoneNumber,
            companyName,
            companyWebsite,
        });
    };
    useEffect(() => {
        (window as any).rewardful('ready', function () {
            setRewardfulReferral((window as any).Rewardful.referral);
        });
        return () => {
            (window as any).rewardful('destroy');
        };
    }, []);
    return (
        <div>
            {steps.map(
                (step) =>
                    step.num === currentStep && (
                        <FormWizard title={t(step.title || '')} key={step.num} steps={steps} currentStep={currentStep}>
                            {currentStep === PROFILE_FORM_STEP && (
                                <ReCaptchaProvider>
                                    <StepOne
                                        firstName={firstName}
                                        lastName={lastName}
                                        phoneNumber={phoneNumber}
                                        validationErrors={validationErrors}
                                        setAndValidate={setAndValidate}
                                        loading={loading}
                                        onNext={onNext}
                                    />
                                </ReCaptchaProvider>
                            )}

                            {currentStep === EMAIL_FORM_STEP && (
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

                            {currentStep === COMPANY_FORM_STEP && (
                                <StepThree
                                    companyName={companyName}
                                    companyWebsite={companyWebsite}
                                    setAndValidate={setAndValidate}
                                    validationErrors={validationErrors}
                                    loading={loading}
                                    onNext={onNext}
                                />
                            )}
                        </FormWizard>
                    ),
            )}
            <div className="mb-2 mt-6 text-center">
                <p className="inline text-sm text-gray-500">
                    {t('login.alreadyHaveAnAccount')}{' '}
                    <Link
                        onClick={() => track(GoToLogin)}
                        href="/login"
                        className="inline cursor-pointer text-primary-500 hover:text-primary-700"
                    >
                        <Button variant="secondary" className="ml-2 px-1 pb-1 pt-1 text-xs">
                            {t('login.logIn')}
                        </Button>
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignUpPage;

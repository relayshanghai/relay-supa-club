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
import { truncatedText } from 'src/utils/outreach/helpers';
import { AxiosError } from 'axios';
import { useLocalStorage } from 'src/hooks/use-localstorage';
import { ConfirmModal } from 'app/components/confirmation/confirm-modal';
export interface SignUpValidationErrors {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    phoneNumber?: string;
    companyName: string;
    companyWebsite?: string;
    currency?: string;
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

const initialSignUpData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '+86',
    companyName: '',
    companyWebsite: '',
};

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
    const [signUpData, setSignUpData] = useLocalStorage('userSignUpData', initialSignUpData);
    const { firstName, lastName, email, password, confirmPassword, phoneNumber, companyName, companyWebsite } =
        signUpData;
    const {
        setFirstName,
        setLastName,
        setEmail,
        setPassword,
        setConfirmPassword,
        setPhoneNumber,
        setCompanyName,
        setCompanyWebsite,
    } = {
        setFirstName: (value: string) => {
            setSignUpData({ ...signUpData, firstName: value });
        },
        setLastName: (value: string) => {
            setSignUpData({ ...signUpData, lastName: value });
        },
        setEmail: (value: string) => {
            setSignUpData({ ...signUpData, email: value });
        },
        setPassword: (value: string) => {
            setSignUpData({ ...signUpData, password: value });
        },
        setConfirmPassword: (value: string) => {
            setSignUpData({ ...signUpData, confirmPassword: value });
        },
        setPhoneNumber: (value: string) => {
            setSignUpData({ ...signUpData, phoneNumber: value });
        },
        setCompanyName: (value: string) => {
            setSignUpData({ ...signUpData, companyName: value });
        },
        setCompanyWebsite: (value: string) => {
            setSignUpData({ ...signUpData, companyWebsite: value });
        },
    };
    const {
        removeFirstName,
        removeLastName,
        removeEmail,
        removePassword,
        removeConfirmPassword,
        removePhoneNumber,
        removeCompanyName,
        removeCompanyWebsite,
    } = {
        removeFirstName: () => {
            setSignUpData({ ...signUpData, firstName: '' });
        },
        removeLastName: () => {
            setSignUpData({ ...signUpData, lastName: '' });
        },
        removeEmail: () => {
            setSignUpData({ ...signUpData, email: '' });
        },
        removePassword: () => {
            setSignUpData({ ...signUpData, password: '' });
        },
        removeConfirmPassword: () => {
            setSignUpData({ ...signUpData, confirmPassword: '' });
        },
        removePhoneNumber: () => {
            setSignUpData({ ...signUpData, phoneNumber: '' });
        },
        removeCompanyName: () => {
            setSignUpData({ ...signUpData, companyName: '' });
        },
        removeCompanyWebsite: () => {
            setSignUpData({ ...signUpData, companyWebsite: '' });
        },
    };
    const [currency, setCurrency] = useState('cny');
    const [confirmCurrencyModalOpen, setConfirmCurrencyModalOpen] = useState(false);
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
                case 'currency':
                    setCurrency(value);
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
        currency: '',
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
        currency,
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
                } else if (e instanceof AxiosError) {
                    if (e.response?.status === 409) {
                        toast.error(e.response.data.message);
                    }
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
            logout(false);
        }
        if (currentStep === COMPANY_FORM_STEP) {
            const result = await handleSignup(formData);
            if (result === 'success') {
                clearForm();
                router.push('/payments/details');
            }
        } else {
            setCurrentStep(currentStep + 1);
        }

        track(CompleteSignupStep, {
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
        setSignUpData(initialSignUpData);
        (window as any).rewardful('ready', function () {
            setRewardfulReferral((window as any).Rewardful.referral);
        });
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            // Custom message for the user
            const message = 'Are you sure you want to leave? Your changes may not be saved.';
            event.returnValue = message; // Standard way to set the message
            return message; // Some browsers require this
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            (window as any).rewardful('destroy');
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <ConfirmModal
                positiveHandler={() => onNext()}
                setShow={(show) => setConfirmCurrencyModalOpen(show)}
                show={confirmCurrencyModalOpen}
                title={t(`login.confirm${currency.toUpperCase()}Currency`) as string}
                okButtonText={t('login.yesContinue') as string}
                cancelButtonText={t('account.cancel') as string}
            />
            {steps.map(
                (step) =>
                    step.num === currentStep && (
                        <FormWizard title={t(step.title || '')} key={step.num} steps={steps} currentStep={currentStep}>
                            {currentStep === PROFILE_FORM_STEP && (
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
                                    currency={currency}
                                    setAndValidate={setAndValidate}
                                    validationErrors={validationErrors}
                                    loading={loading}
                                    onNext={() => {
                                        setConfirmCurrencyModalOpen(true);
                                    }}
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

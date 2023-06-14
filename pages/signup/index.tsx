import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Button } from 'src/components/button';
import { Input } from 'src/components/input';
import SignUpPage from 'src/components/signup/signup-page';
import { LegacyLoginSignupLayout } from 'src/components/LegacySignupLayout';
import { EMPLOYEE_EMAILS } from 'src/constants/employeeContacts';
import { featSignupV2 } from 'src/constants/feature-flags';
import { useFields } from 'src/hooks/use-fields';
import { useRudderstack } from 'src/hooks/use-rudderstack';
import { useUser } from 'src/hooks/use-user';
import { clientLogger } from 'src/utils/logger-client';
import { isMissing } from 'src/utils/utils';
import type { SignupInputTypes } from 'src/utils/validation/signup';
import { validateSignupInput } from 'src/utils/validation/signup';
import { LoginSignupLayout } from 'src/components/SignupLayout';
import { ScreenshotsCarousel } from 'src/components/signup/screenshots-carousel';

export default function Register() {
    const { t } = useTranslation();
    const { trackEvent } = useRudderstack();

    const router = useRouter();
    const {
        values: { firstName, lastName, email, password, confirmPassword, phoneNumber },
        setFieldValue,
    } = useFields({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
    });
    const { signup, profile, createEmployee } = useUser();
    const [loading, setLoading] = useState(false);
    const [signupSuccess, setSignupSuccess] = useState(false);
    const [validationErrors, setValidationErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
    });

    useEffect(() => {
        if (signupSuccess && profile?.id) {
            if (EMPLOYEE_EMAILS.includes(email)) {
                router.push('/dashboard');
            } else {
                router.push('/signup/onboarding');
            }
        }
    }, [email, router, signupSuccess, profile]);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const signupRes = await signup({
                email,
                password,
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    phone: phoneNumber,
                },
            });
            if (signupRes?.session?.user.id) {
                if (EMPLOYEE_EMAILS.includes(email)) {
                    const employeeRes = await createEmployee(email);
                    if (employeeRes?.id) {
                        setSignupSuccess(true);
                    } else {
                        throw new Error('Could not create employee');
                    }
                } else {
                    setSignupSuccess(true);
                }
            } else {
                throw new Error('Could not sign up');
            }
            trackEvent('Clicked on Sign Up', { firstName, lastName, email });
        } catch (error: any) {
            clientLogger(error, 'error');
            // this is a supabase provided error so we don't have our custom error handling
            if (error?.message === 'User already registered') {
                toast.error(t('login.userAlreadyRegistered'));
                router.push(`/login?email=${encodeURIComponent(email)}`);
            } else {
                toast.error(t('login.oopsSomethingWentWrong'));
            }
            setLoading(false);
        }
        // why do we not set loading to false here? Because sometimes the user is logged in but the profile has not loaded yet. The next page needs the profile ready. Therefore we wait in the useEffect above for the profile to load before redirecting.
    };

    const setAndValidate = (type: SignupInputTypes, value: string) => {
        setFieldValue(type, value);
        const validationError = validateSignupInput(type, value, password);
        if (validationError) {
            setValidationErrors({ ...validationErrors, [type]: t(validationError) });
        } else {
            setValidationErrors({ ...validationErrors, [type]: '' });
        }
    };
    const hasValidationErrors = Object.entries(validationErrors).some(
        // ignore validation numbers for not required fields
        ([key, error]) => key !== 'phoneNumber' && error !== '',
    );

    const invalidFormInput = isMissing(firstName, lastName, email, password, confirmPassword) || hasValidationErrors;
    const submitDisabled = invalidFormInput || loading;

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <>
            {featSignupV2() ? (
                <LoginSignupLayout left={<ScreenshotsCarousel />} right={<SignUpPage />} />
            ) : (
                <LegacyLoginSignupLayout>
                    <form className="mx-auto flex w-full max-w-xs flex-grow flex-col items-center justify-center space-y-2">
                        <div className="w-full text-left">
                            <h1 className="mb-2 text-4xl font-bold">{t('login.signUp')}</h1>
                            <h3 className="mb-8 text-sm text-gray-600">{t('login.signupSubtitle')}</h3>
                        </div>
                        <p className="text-md inline pb-4 text-gray-500">
                            {t('login.alreadyHaveAnAccount')}
                            <Link
                                href="/login"
                                className="inline cursor-pointer text-primary-700 hover:text-primary-600"
                            >
                                <Button variant="secondary" className="ml-2 px-1 pb-1 pt-1 text-xs">
                                    {t('login.logIn')}
                                </Button>
                            </Link>
                        </p>
                        <Input
                            error={validationErrors.firstName}
                            label={t('login.firstName')}
                            type="first_name"
                            placeholder={t('login.firstNamePlaceholder')}
                            value={firstName}
                            required
                            onChange={(e) => setAndValidate('firstName', e.target.value)}
                        />
                        <Input
                            error={validationErrors.lastName}
                            label={t('login.lastName')}
                            type="last_name"
                            placeholder={t('login.lastNamePlaceholder')}
                            value={lastName}
                            required
                            onChange={(e) => setAndValidate('lastName', e.target.value)}
                        />
                        <Input
                            error={validationErrors.email}
                            label={t('login.email')}
                            type="email"
                            placeholder="hello@relay.club"
                            value={email}
                            required
                            onChange={(e) => setAndValidate('email', e.target.value)}
                        />
                        <Input
                            error={validationErrors.phoneNumber}
                            label={t('login.phoneNumber')}
                            type="tel"
                            placeholder="139-999-9999"
                            value={phoneNumber}
                            onChange={(e) => setAndValidate('phoneNumber', e.target.value)}
                        />
                        <Input
                            error={validationErrors.password}
                            note={t('login.passwordRequirements')}
                            label={t('login.password')}
                            type="password"
                            placeholder={t('login.passwordPlaceholder')}
                            value={password}
                            required
                            onChange={(e) => setAndValidate('password', e.target.value)}
                        />
                        <Input
                            error={validationErrors.confirmPassword}
                            label={t('login.confirmPassword')}
                            type="password"
                            placeholder={t('login.passwordPlaceholder')}
                            value={confirmPassword}
                            required
                            onChange={(e) => setAndValidate('confirmPassword', e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e)}
                        />
                        <Button disabled={submitDisabled} type="button" onClick={handleSubmit}>
                            {t('login.signUp')}
                        </Button>
                        <p className="py-8 text-xs text-gray-500">{t('login.disclaimer')}</p>
                    </form>
                </LegacyLoginSignupLayout>
            )}
        </>
    );
}

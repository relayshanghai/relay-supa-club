import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Button } from 'src/components/button';
import { LanguageToggle } from 'src/components/common/language-toggle';
import { Input } from 'src/components/input';
import { Title } from 'src/components/title';
import { EMPLOYEE_EMAILS } from 'src/constants/employeeContacts';
import { useFields } from 'src/hooks/use-fields';
import { useUser } from 'src/hooks/use-user';
import { clientLogger } from 'src/utils/logger';
import { isMissing } from 'src/utils/utils';
import { SignupInputTypes, validateSignupInput } from 'src/utils/validation/signup';

export default function Register() {
    const { t } = useTranslation();

    const router = useRouter();
    const {
        values: { firstName, lastName, email, password, confirmPassword },
        setFieldValue,
    } = useFields({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
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
    const hasValidationErrors = Object.values(validationErrors).some((error) => error !== '');

    const invalidFormInput = isMissing(firstName, lastName, email, password) || hasValidationErrors;
    const submitDisabled = invalidFormInput || loading;

    return (
        <div className="w-full h-screen px-10 flex flex-col">
            <div className="sticky top-0 flex items-center w-full justify-between">
                <Title />
                <LanguageToggle />
            </div>
            <form className="max-w-xs w-full mx-auto flex-grow flex flex-col justify-center items-center space-y-5">
                <div className="text-left w-full">
                    <h1 className="font-bold text-4xl mb-2">{t('login.signUp')}</h1>
                    <h3 className="text-sm text-gray-600 mb-8">
                        {t('login.startYour30DayFreeTrial')}
                    </h3>
                </div>
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
                />
                <Button disabled={submitDisabled} type="button" onClick={handleSubmit}>
                    {t('login.signUp')}
                </Button>
                <p className="inline text-gray-500 text-sm pb-4">
                    {t('login.alreadyHaveAnAccount')}
                    <Link
                        href="/login"
                        className="inline text-primary-700 hover:text-primary-600 cursor-pointer"
                    >
                        {t('login.logIn')}
                    </Link>
                </p>
            </form>
        </div>
    );
}

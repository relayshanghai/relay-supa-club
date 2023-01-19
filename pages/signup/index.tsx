import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Button } from 'src/components/button';
import { LanguageToggle } from 'src/components/common/language-toggle';
import { Input } from 'src/components/input';
import { Title } from 'src/components/title';
import { useFields } from 'src/hooks/use-fields';
import { useUser } from 'src/hooks/use-user';
import { clientLogger } from 'src/utils/logger';

export default function Register() {
    const { t } = useTranslation();
    const [submitting, setSubmitting] = useState(false);

    const router = useRouter();
    const {
        values: { firstName, lastName, email, password, confirmPassword },
        setFieldValue
    } = useFields({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const { signup, logout, user } = useUser();
    const [signupSuccess, setSignupSuccess] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
    useEffect(() => {
        const loutOutOnLoad = async () => {
            // sometimes the cookies and signed in status still persist to this page, so call logout again

            await logout();
            setInitialLoad(false);
        };
        if (initialLoad) loutOutOnLoad();
    }, [logout, initialLoad]);

    useEffect(() => {
        if (signupSuccess && user?.id) router.push('/signup/onboarding');
    }, [initialLoad, router, signupSuccess, user]);

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const signupRes = await signup({
                email,
                password,
                data: {
                    first_name: firstName,
                    last_name: lastName
                }
            });
            if (signupRes?.session?.user.id) setSignupSuccess(true);
        } catch (error) {
            clientLogger(error, 'error');
            toast.error(t('login.oopsSomethingWentWrong'));
        } finally {
            setSubmitting(false);
        }
    };

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
                    label={t('login.firstName')}
                    type="first_name"
                    placeholder={t('login.firstNamePlaceholder') || ''}
                    value={firstName}
                    required
                    onChange={(e) => setFieldValue('firstName', e.target.value)}
                />
                <Input
                    label={t('login.lastName')}
                    type="last_name"
                    placeholder={t('login.lastNamePlaceholder') || ''}
                    value={lastName}
                    required
                    onChange={(e) => setFieldValue('lastName', e.target.value)}
                />
                <Input
                    label={t('login.email')}
                    type="email"
                    placeholder="hello@relay.club"
                    value={email}
                    required
                    onChange={(e) => setFieldValue('email', e.target.value)}
                />
                <Input
                    label={t('login.password')}
                    type="password"
                    placeholder={t('login.passwordPlaceholder') || ''}
                    value={password}
                    required
                    onChange={(e) => setFieldValue('password', e.target.value)}
                />
                <Input
                    label={t('login.confirmPassword')}
                    type="password"
                    placeholder={t('login.passwordPlaceholder') || ''}
                    value={confirmPassword}
                    required
                    onChange={(e) => setFieldValue('confirmPassword', e.target.value)}
                />
                <Button
                    disabled={
                        !firstName ||
                        !lastName ||
                        !email ||
                        !password ||
                        password !== confirmPassword ||
                        submitting
                    }
                    onClick={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                >
                    {t('login.signUp')}
                </Button>
                <p className="inline text-gray-500 text-sm">
                    {t('login.alreadyHaveAnAccount')}
                    <Link href="/login">
                        <a className="inline text-primary-700 hover:text-primary-600 cursor-pointer">
                            {t('login.logIn')}
                        </a>
                    </Link>
                </p>
            </form>
        </div>
    );
}

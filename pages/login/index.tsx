import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Button } from 'src/components/button';
import { Input } from 'src/components/input';
import { LoginSignupLayout } from 'src/components/SignupLayout';
import { APP_URL } from 'src/constants';
import { useFields } from 'src/hooks/use-fields';
import { useRudderstack } from 'src/hooks/use-rudderstack';
import { useUser } from 'src/hooks/use-user';

export default function Login() {
    const { t } = useTranslation();
    const router = useRouter();
    const { email: emailQuery } = router.query;
    const { login, supabaseClient, profile } = useUser();
    const [loggingIn, setLoggingIn] = useState(false);
    const [generatingResetEmail, setGeneratingResetEmail] = useState(false);
    const {
        values: { email, password },
        setFieldValue,
    } = useFields({
        email: '',
        password: '',
    });
    const { Identify } = useRudderstack();

    useEffect(() => {
        if (emailQuery) {
            setFieldValue('email', emailQuery.toString());
        }
    }, [emailQuery, setFieldValue]);

    const handleSubmit = async () => {
        try {
            setLoggingIn(true);
            await login(email, password);
            toast.success(t('login.loginSuccess'));
            console.log({ profile });
            // Identify(profile?.id, {
            //     email: profile?.email,
            //     name: `${profile?.first_name} ${profile?.last_name}`,
            // });

            await router.push('/dashboard');
        } catch (error: any) {
            toast.error(error.message || t('login.oopsSomethingWentWrong'));
        } finally {
            setLoggingIn(false);
        }
    };

    const handleResetPassword = async () => {
        setGeneratingResetEmail(true);
        try {
            if (!supabaseClient) {
                throw new Error('Supabase client not initialized');
            }
            if (!email) {
                throw new Error('Please enter your email');
            }
            const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
                redirectTo: `${APP_URL}/login/reset-password/${email}`,
            });
            if (error) throw error;
            toast.success(t('login.resetPasswordEmailSent'));
        } catch (error: any) {
            toast.error(error.message || t('login.oopsSomethingWentWrong'));
        }
        setGeneratingResetEmail(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <LoginSignupLayout>
            <form className="mx-auto flex w-full max-w-xs flex-grow flex-col items-center justify-center space-y-2">
                <div className="w-full text-left">
                    <h1 className="mb-2 text-4xl font-bold">{t('login.logIn')}</h1>
                    <h3 className="mb-8 text-sm text-gray-600">{t('login.welcomeBack')}</h3>
                </div>
                <p className="inline text-sm text-gray-500">
                    {t('login.dontHaveAnAccount')}{' '}
                    <Link
                        href="/signup"
                        className="inline cursor-pointer text-primary-700 hover:text-primary-600"
                    >
                        <Button variant="secondary" className="ml-2 px-1 pt-1 pb-1 text-xs">
                            {t('login.signUp')}
                        </Button>
                    </Link>
                </p>
                <Input
                    label={t('login.email')}
                    type="email"
                    placeholder="hello@relay.club"
                    value={email}
                    onChange={(e) => {
                        setFieldValue('email', e.target.value);
                    }}
                />
                <Input
                    label={t('login.password')}
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                        setFieldValue('password', e.target.value);
                    }}
                    onKeyDown={(e) => handleKeyDown(e)}
                />
                <Button
                    disabled={!email || !password || loggingIn}
                    type="button"
                    onClick={handleSubmit}
                >
                    {t('login.logIn')}
                </Button>

                <button type="button" onClick={handleResetPassword} disabled={generatingResetEmail}>
                    <p className="mt-4 inline pb-4 text-sm text-gray-400 hover:text-primary-500">
                        {t('login.forgotPasswordReset')}
                    </p>
                </button>
            </form>
        </LoginSignupLayout>
    );
}

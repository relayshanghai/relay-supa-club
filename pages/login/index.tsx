import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Button } from 'src/components/button';
import { LanguageToggle } from 'src/components/common/language-toggle';
import { Input } from 'src/components/input';
import { Title } from 'src/components/title';
import { APP_URL } from 'src/constants';
import { useFields } from 'src/hooks/use-fields';
import { useUser } from 'src/hooks/use-user';

export default function Login() {
    const { t } = useTranslation();
    const router = useRouter();
    const { email: emailQuery, update_email } = router.query;
    const { login, supabaseClient } = useUser();
    const [loggingIn, setLoggingIn] = useState(false);
    const [generatingResetEmail, setGeneratingResetEmail] = useState(false);
    const {
        values: { email, password },
        setFieldValue,
    } = useFields({
        email: '',
        password: '',
    });
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
            await router.push(
                update_email && update_email === '1'
                    ? `/dashboard?update_email=${1}`
                    : '/dashboard',
            );
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

    return (
        <div className="w-full h-screen px-10 flex flex-col">
            <div className="sticky top-0 flex items-center w-full justify-between">
                <Title />
                <LanguageToggle />
            </div>
            <form className="max-w-xs w-full mx-auto flex-grow flex flex-col justify-center items-center space-y-5">
                <div className="text-left w-full">
                    <h1 className="font-bold text-4xl mb-2">{t('login.logIn')}</h1>
                    <h3 className="text-sm text-gray-600 mb-8">{t('login.welcomeBack')}</h3>
                </div>
                <Input
                    label={t('login.email')}
                    type="email"
                    placeholder="hello@relay.club"
                    value={email}
                    onChange={(e) => setFieldValue('email', e.target.value)}
                />
                <Input
                    label={t('login.password')}
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setFieldValue('password', e.target.value)}
                />
                <Button
                    disabled={!email || !password || loggingIn}
                    type="button"
                    onClick={handleSubmit}
                >
                    {t('login.logIn')}
                </Button>
                <p className="inline text-gray-500 text-sm">
                    {t('login.dontHaveAnAccount')}{' '}
                    <Link href="/signup">
                        <a className="inline text-primary-700 hover:text-primary-600 cursor-pointer">
                            {t('login.signUp')}
                        </a>
                    </Link>
                </p>
                <button type="button" onClick={handleResetPassword} disabled={generatingResetEmail}>
                    <p className="mt-4 inline text-gray-400 text-sm">
                        {t('login.forgotPasswordClickHereToReset')}
                    </p>
                </button>
            </form>
        </div>
    );
}

import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Button } from 'src/components/button';
import { Input } from 'src/components/input';
import { APP_URL } from 'src/constants';
import { useFields } from 'src/hooks/use-fields';
import { useUser } from 'src/hooks/use-user';
import { FormWizard } from './signup/form-wizard';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { PasswordReset } from 'src/utils/analytics/events';
import { SignupStarted } from 'src/utils/analytics/events';
import { useIdentifySession } from 'src/hooks/use-session';

const LoginPage = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const { track } = useRudderstackTrack();
    const { email: emailQuery } = router.query;
    const { login, supabaseClient, profile, refreshProfile } = useUser();
    const [loggingIn, setLoggingIn] = useState(false);
    const [generatingResetEmail, setGeneratingResetEmail] = useState(false);
    const {
        values: { email, password },
        setFieldValue,
    } = useFields({
        email: '',
        password: '',
    });

    const identifySession = useIdentifySession();

    useEffect(() => {
        if (profile) {
            toast.success(t('login.loginSuccess'));
            identifySession(() => {
                router.push('/boostbot');
            });
        }
    }, [profile, router, t, identifySession]);

    useEffect(() => {
        if (!router.isReady || typeof emailQuery !== 'string') return;
        if (emailQuery) {
            setFieldValue('email', emailQuery.toString());
        }
    }, [emailQuery, setFieldValue, router.isReady]);

    const handleSubmit = async () => {
        try {
            setLoggingIn(true);
            await login(email, password);
            await refreshProfile();
        } catch (error: any) {
            toast.error(error.message || t('login.oopsSomethingWentWrong'));
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
            track(PasswordReset);
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
        <div>
            <FormWizard title={t('login.welcomeBack')} showProgress={false}>
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
                    placeholder={t('login.passwordPlaceholder')}
                    value={password}
                    onChange={(e) => setFieldValue('password', e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e)}
                />
                <Button
                    disabled={!email || !password || loggingIn}
                    type="button"
                    onClick={handleSubmit}
                    className="mt-12 w-full"
                >
                    {t('login.logIn')}
                </Button>
            </FormWizard>
            <div className="mb-2 mt-6 text-center">
                <p className="inline text-sm text-gray-500">
                    {t('login.dontHaveAnAccount')}{' '}
                    <Link
                        onClick={() => track(SignupStarted)}
                        href="/signup"
                        className="inline cursor-pointer text-primary-500 hover:text-primary-700"
                    >
                        <Button variant="secondary" className="ml-2 px-1 pb-1 pt-1 text-xs">
                            {t('login.signUp')}
                        </Button>
                    </Link>
                </p>
            </div>
            <button type="button" onClick={handleResetPassword} disabled={generatingResetEmail} className="w-full">
                <p className="mt-4 inline pb-4 text-sm text-gray-500 ">
                    {t('login.forgotPassword')}{' '}
                    <span className="text-primary-500 hover:text-primary-700">{t('login.resetPassword')}</span>
                </p>
            </button>
        </div>
    );
};

export default LoginPage;

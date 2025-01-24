import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Button } from 'src/components/button';
import { Input } from 'src/components/input';
import { useFields } from 'src/hooks/use-fields';
import { useUser } from 'src/hooks/use-user';
import { FormWizard } from './signup/form-wizard';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { PasswordReset } from 'src/utils/analytics/events';
import { clientLogger } from 'src/utils/logger-client';
import { useHostname } from 'src/utils/get-host';
import { nextFetch } from 'src/utils/fetcher';

const LoginPage = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const { track } = useRudderstackTrack();
    const { email: emailQuery } = router.query;
    const { login } = useUser();
    const [loggingIn, setLoggingIn] = useState(false);
    const [generatingResetEmail, setGeneratingResetEmail] = useState(false);
    const { appUrl } = useHostname();
    const {
        values: { email, password },
        setFieldValue,
    } = useFields({
        email: '',
        password: '',
    });

    useEffect(() => {
        if (!router.isReady || typeof emailQuery !== 'string') return;
        if (emailQuery) {
            setFieldValue('email', emailQuery.toString());
        }
    }, [emailQuery, setFieldValue, router.isReady]);

    const handleSubmit = useCallback(async () => {
        try {
            setLoggingIn(true);
            await login(email, password).then((data) => {
                const { user, hasDefaultPaymentMethod } = data;

                // @note if for some reason we cannot get the user after logging in
                if (!user) {
                    clientLogger(`Cannot alias ${email}. User not loaded after login`, 'error', true);
                    return;
                }

                toast.success(t('login.loginSuccess'));
                if (!hasDefaultPaymentMethod) {
                    router.push('/payments/details');
                    return;
                }
                router.push('/boostbot');
            });
        } catch (error: any) {
            toast.error(error.message || t('login.oopsSomethingWentWrong'));
            setLoggingIn(false);
        }
    }, [email, password, login, t, router]);

    const handleResetPassword = async () => {
        setGeneratingResetEmail(true);
        try {
            if (!email) {
                throw new Error('Please enter your email');
            }
            await nextFetch('profiles/reset-password', {
                method: 'POST',
                body: {
                    email,
                    redirectUrl: appUrl,
                },
            });
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
                    placeholder="hello@boostbot.ai"
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
            <div className="mb-2 mt-6 text-center" />
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

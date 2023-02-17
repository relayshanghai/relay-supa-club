import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Button } from 'src/components/button';
import { LanguageToggle } from 'src/components/common/language-toggle';
import { Spinner } from 'src/components/icons';
import { Input } from 'src/components/input';
import { Title } from 'src/components/title';

import { useFields } from 'src/hooks/use-fields';
import { useUser } from 'src/hooks/use-user';
import { validateSignupInput } from 'src/utils/validation/signup';
type ResetInputTypes = 'password' | 'confirmPassword';
const ResetPassword = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const { email: emailQuery } = router.query;
    // supabase gives query params in the form of #key=value&key=value
    const supabaseQueries = router.asPath.split('#')[1];
    const supabaseQueriesObject = Object.fromEntries(
        new URLSearchParams(supabaseQueries).entries(),
    );

    const { error_description } = supabaseQueriesObject;

    const { login, supabaseClient } = useUser();
    const [submitting, setSubmitting] = useState(false);
    const {
        values: { password, email, confirmPassword },
        setFieldValue,
    } = useFields({
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [validationErrors, setValidationErrors] = useState({
        password: '',
        confirmPassword: '',
    });

    useEffect(() => {
        if (emailQuery) {
            setFieldValue('email', emailQuery.toString());
        }
    }, [emailQuery, setFieldValue]);

    const handleSubmit = async () => {
        if (!supabaseClient) {
            throw new Error('Supabase client not initialized');
        }
        if (!email) {
            throw new Error('No email found');
        }
        try {
            setSubmitting(true);
            const { data, error } = await supabaseClient.auth.updateUser({
                password,
            });
            if (error) {
                throw error;
            }
            if (data) {
                toast.success(t('login.passwordUpdated'));
            } else {
                throw new Error('No data returned');
            }
            await login(email, password);
            toast.success(t('login.loginSuccess'));
            await router.push('/dashboard');
        } catch (error: any) {
            toast.error(error.message || t('login.oopsSomethingWentWrong'));
        } finally {
            setSubmitting(false);
        }
    };
    const [resetDetected, setResetDetected] = useState(false);

    useEffect(() => {
        supabaseClient?.auth.onAuthStateChange(async (event) => {
            if (event === 'PASSWORD_RECOVERY') {
                setResetDetected(true);
            }
        });
    }, [supabaseClient]);

    const setAndValidate = (type: ResetInputTypes, value: string) => {
        setFieldValue(type, value);
        const validationError = validateSignupInput(type, value, password);
        if (validationError) {
            setValidationErrors({ ...validationErrors, [type]: t(validationError) });
        } else {
            setValidationErrors({ ...validationErrors, [type]: '' });
        }
    };

    const hasValidationErrors = Object.values(validationErrors).some((error) => error !== '');
    const invalidFormInput = !email || !password || hasValidationErrors || !confirmPassword;
    const submitDisabled = invalidFormInput || submitting;

    return (
        <div className="w-full h-screen px-10 flex flex-col">
            <div className="sticky top-0 flex items-center w-full justify-between">
                <Title />
                <LanguageToggle />
            </div>
            {error_description ? (
                <h1>{error_description}</h1>
            ) : resetDetected ? (
                <form className="max-w-xs w-full mx-auto flex-grow flex flex-col justify-center items-center space-y-5">
                    <div className="text-left w-full">
                        <h1 className="font-bold text-4xl mb-2">{t('login.changePassword')}</h1>
                    </div>
                    <Input
                        error={validationErrors.password}
                        label={t('login.password')}
                        type="password"
                        placeholder={t('login.inputNewPassword') || ''}
                        value={password}
                        required
                        onChange={(e) => setAndValidate('password', e.target.value)}
                    />

                    <Input
                        error={validationErrors.confirmPassword}
                        label={t('login.confirmPassword')}
                        type="password"
                        placeholder={t('login.passwordPlaceholder') || ''}
                        value={confirmPassword}
                        required
                        onChange={(e) => setAndValidate('confirmPassword', e.target.value)}
                    />
                    <Button
                        disabled={submitDisabled}
                        onClick={(e) => {
                            e.preventDefault();
                            handleSubmit();
                        }}
                    >
                        {t('login.updateAndLogIn')}
                    </Button>
                </form>
            ) : (
                <Spinner className="mx-auto mt-10 w-10 h-10 fill-primary-600 text-white" />
            )}
        </div>
    );
};

export default ResetPassword;

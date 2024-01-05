import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Button } from 'src/components/button';
import { Spinner } from 'src/components/icons';
import { Input } from 'src/components/input';
import { LegacyLoginSignupLayout } from 'src/components/LegacySignupLayout';

import { useFields } from 'src/hooks/use-fields';
import { useUser } from 'src/hooks/use-user';
import { isMissing } from 'src/utils/utils';
import { validateSignupInput } from 'src/utils/validation/signup';
type ResetInputTypes = 'password' | 'confirmPassword';
const ResetPassword = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const { email: emailQuery } = router.query;
    // supabase gives query params in the form of #key=value&key=value
    const supabaseQueries = router.asPath.split('#')[1];
    const supabaseQueriesObject = Object.fromEntries(new URLSearchParams(supabaseQueries).entries());

    const { error_description } = supabaseQueriesObject;

    const { login, supabaseClient, profile } = useUser();
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
            await router.push('/boostbot');
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

    useEffect(() => {
        if (profile?.id) {
            setResetDetected(true);
        }
    }, [profile?.id]);

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
    const invalidFormInput = isMissing(email, password, confirmPassword) || hasValidationErrors;
    const submitDisabled = invalidFormInput || submitting;

    return (
        <LegacyLoginSignupLayout>
            {error_description ? (
                <h1>{error_description}</h1>
            ) : resetDetected ? (
                <form className="mx-auto flex w-full max-w-xs flex-grow flex-col items-center justify-center space-y-2">
                    <div className="w-full text-left">
                        <h1 className="mb-2 text-4xl font-bold">{t('login.changePassword')}</h1>
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
                <Spinner className="mx-auto mt-10 h-10 w-10 fill-primary-600 text-white" />
            )}
        </LegacyLoginSignupLayout>
    );
};

export default ResetPassword;

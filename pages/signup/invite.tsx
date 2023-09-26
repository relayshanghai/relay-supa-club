import { useRouter } from 'next/router';

import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Button } from 'src/components/button';

import { Input } from 'src/components/input';
import { acceptInviteErrors } from 'src/errors/company';
import { inviteStatusErrors, loginValidationErrors } from 'src/errors/login';
import type { InviteStatusError } from 'src/errors/login';
import { useFields } from 'src/hooks/use-fields';
import { useUser } from 'src/hooks/use-user';
import { hasCustomError } from 'src/utils/errors';

import { clientLogger } from 'src/utils/logger-client';
import { validateSignupInput } from 'src/utils/validation/signup';
import type { LegacySignupInputTypes } from 'src/utils/validation/signup';
import { Spinner } from 'src/components/icons';
import { isMissing } from 'src/utils/utils';
import { useInvites } from 'src/hooks/use-invites';
import { LegacyLoginSignupLayout } from 'src/components/LegacySignupLayout';

type InviteStatus = InviteStatusError | 'pending' | 'inviteValid';

export default function Register() {
    const { t } = useTranslation();
    const { login, supabaseClient } = useUser();

    const router = useRouter();
    const {
        values: { password, confirmPassword, firstName, lastName, email, phoneNumber },
        setFieldValue,
    } = useFields({
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: '',
        email: '',
        phoneNumber: '',
    });
    const token = router.query.token as string;
    const [registering, setRegistering] = useState(false);
    const [inviteStatus, setInviteStatus] = useState<InviteStatus>('pending');
    const [validationErrors, setValidationErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
    });
    const { getInviteStatus, acceptInvite } = useInvites();

    useEffect(() => {
        const checkInvite = async (token: string) => {
            try {
                const tokenStatus = await getInviteStatus(token);
                if (tokenStatus.message && tokenStatus.email) {
                    setFieldValue('email', tokenStatus.email);
                    setInviteStatus(tokenStatus.message);
                } else setInviteStatus('inviteValid');
            } catch (error: any) {
                if (hasCustomError(error, inviteStatusErrors)) {
                    setInviteStatus(error.message);
                } else {
                    clientLogger(error, 'error');
                }
            }
        };
        if (token) checkInvite(token);
    }, [token, setFieldValue, router, getInviteStatus]);

    const handleSubmit = useCallback(async () => {
        try {
            setRegistering(true);
            if (!supabaseClient?.auth) {
                throw new Error('Error loading supabase client');
            }
            const { error: signOutError } = await supabaseClient.auth.signOut();
            if (signOutError) {
                throw new Error(signOutError?.message || 'Error signing out previous session');
            }

            const res = await acceptInvite({
                token,
                password,
                firstName,
                lastName,
                email,
                phone: phoneNumber,
            });
            if (!res.id) {
                throw new Error('Error accepting invite');
            }
            toast.success(t('login.inviteAccepted'));
            const loginRes = await login(email, password);
            if (!loginRes.user?.id) {
                throw new Error('Error logging in');
            }
            router.push('/boostbot');
        } catch (error: any) {
            if (
                error?.message === 'User already registered' ||
                error?.message === acceptInviteErrors.userAlreadyRegistered
            ) {
                toast.error(t(acceptInviteErrors.userAlreadyRegistered));
                return await router.push('/login');
            }
            clientLogger(error, 'error');
            if (hasCustomError(error, { ...acceptInviteErrors, ...loginValidationErrors })) {
                toast.error(t(error.message));
            } else {
                toast.error(t('login.oopsSomethingWentWrong'));
            }
        } finally {
            setRegistering(false);
        }
    }, [
        acceptInvite,
        email,
        firstName,
        lastName,
        login,
        password,
        phoneNumber,
        router,
        supabaseClient?.auth,
        t,
        token,
    ]);
    if (!token)
        return (
            <div className="mx-auto flex h-full flex-col items-center justify-center space-y-6">
                <h2>{t('login.noInviteTokenFound')}</h2>
                <Button onClick={() => router.back()}>{t('login.back')}</Button>
            </div>
        );

    const setAndValidate = (type: LegacySignupInputTypes, value: string) => {
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

    const invalidFormInput =
        isMissing(token, firstName, lastName, email, password, confirmPassword) || hasValidationErrors;
    const submitDisabled = registering || invalidFormInput;

    return (
        <LegacyLoginSignupLayout>
            {inviteStatus === 'inviteValid' ? (
                <form className="mx-auto flex w-full max-w-xs flex-grow flex-col items-center justify-center space-y-2">
                    <div className="w-full text-left">
                        <h1 className="mb-2 text-4xl font-bold">{t('login.acceptInvite')}</h1>
                        <h3 className="mb-8 text-sm text-gray-600">{t('login.someoneInvitedYouToJoinRelayClub')}</h3>
                    </div>
                    <Input label={t('login.email')} value={email} disabled />
                    <Input
                        error={validationErrors.firstName}
                        label={t('login.firstName')}
                        type="text"
                        placeholder={t('login.firstNamePlaceholder')}
                        value={firstName}
                        required
                        onChange={(e) => setAndValidate('firstName', e.target.value)}
                    />
                    <Input
                        error={validationErrors.lastName}
                        label={t('login.lastName')}
                        type="text"
                        placeholder={t('login.lastNamePlaceholder')}
                        value={lastName}
                        required
                        onChange={(e) => setAndValidate('lastName', e.target.value)}
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
                    <Input
                        error={validationErrors.phoneNumber}
                        label={t('login.phoneNumber')}
                        type="tel"
                        placeholder="139-999-9999"
                        value={phoneNumber}
                        onChange={(e) => setAndValidate('phoneNumber', e.target.value)}
                    />
                    <Button disabled={submitDisabled} type="button" onClick={handleSubmit}>
                        {t('login.signUp')}
                    </Button>
                    <p className="pt-8 text-xs text-gray-500">{t('login.disclaimer')}</p>
                </form>
            ) : inviteStatus === 'pending' ? (
                <div className="mx-auto flex h-full flex-col items-center justify-center space-y-6">
                    <p>{t('login.checkingInviteStatus')}</p>
                    <Spinner className="h-5 w-5 fill-primary-600 text-white" />{' '}
                </div>
            ) : (
                <div className="mx-auto flex h-full flex-col items-center justify-center space-y-6">
                    <h2>{t(inviteStatus)}</h2>
                    <Button onClick={() => router.back()}>{t('login.back')}</Button>
                </div>
            )}
        </LegacyLoginSignupLayout>
    );
}

import { useRouter } from 'next/router';
import {
    CompanyAcceptInviteGetQueries,
    CompanyAcceptInviteGetResponse,
    CompanyAcceptInvitePostBody,
    CompanyAcceptInvitePostResponse,
} from 'pages/api/company/accept-invite';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Button } from 'src/components/button';
import { LanguageToggle } from 'src/components/common/language-toggle';
import { Input } from 'src/components/input';
import { Title } from 'src/components/title';
import { acceptInviteErrors } from 'src/errors/company';
import { inviteStatusErrors, loginValidationErrors } from 'src/errors/login';
import type { InviteStatusError } from 'src/errors/login';
import { useFields } from 'src/hooks/use-fields';
import { useUser } from 'src/hooks/use-user';
import { hasCustomError } from 'src/utils/errors';
import { nextFetch, nextFetchWithQueries } from 'src/utils/fetcher';
import { clientLogger } from 'src/utils/logger';
import { SignupInputTypes, validateSignupInput } from 'src/utils/validation/signup';
import { Spinner } from 'src/components/icons';

type InviteStatus = InviteStatusError | 'pending' | 'inviteValid';

export default function Register() {
    const { t } = useTranslation();
    const { login, supabaseClient } = useUser();

    const router = useRouter();
    const {
        values: { password, confirmPassword, firstName, lastName, email },
        setFieldValue,
    } = useFields({
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: '',
        email: '',
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
    });

    useEffect(() => {
        const checkInvite = async () => {
            try {
                const tokenStatus = await nextFetchWithQueries<
                    CompanyAcceptInviteGetQueries,
                    CompanyAcceptInviteGetResponse
                >('company/accept-invite', { token });
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
        if (token) checkInvite();
    }, [token, setFieldValue, router]);

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
            const body: CompanyAcceptInvitePostBody = {
                token,
                password,
                firstName,
                lastName,
                email,
            };
            const res = await nextFetch<CompanyAcceptInvitePostResponse>('company/accept-invite', {
                method: 'post',
                body,
            });
            if (!res.id) {
                throw new Error('Error accepting invite');
            }
            toast.success(t('login.inviteAccepted'));
            const loginRes = await login(email, password);
            if (!loginRes.user?.id) {
                throw new Error('Error logging in');
            }
            router.push('/dashboard');
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
    }, [email, firstName, lastName, login, password, router, supabaseClient?.auth, t, token]);
    if (!token)
        return (
            <div className="mx-auto h-full flex flex-col justify-center items-center space-y-6">
                <h2>{t('login.noInviteTokenFound')}</h2>
                <Button onClick={() => router.back()}>{t('login.back')}</Button>
            </div>
        );

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

    const invalidFormInput =
        !token || !firstName || !lastName || !email || !password || hasValidationErrors;
    const submitDisabled = registering || invalidFormInput;

    return (
        <div className="w-full h-screen px-10 flex flex-col">
            <div className="sticky top-0 flex items-center w-full justify-between">
                <Title />
                <LanguageToggle />
            </div>
            {inviteStatus === 'inviteValid' ? (
                <form className="max-w-xs w-full mx-auto flex-grow flex flex-col justify-center items-center space-y-5">
                    <div className="text-left w-full">
                        <h1 className="font-bold text-4xl mb-2">{t('login.acceptInvite')}</h1>
                        <h3 className="text-sm text-gray-600 mb-8">
                            {t('login.someoneInvitedYouToJoinRelayClub')}
                        </h3>
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
                        onChange={(e) => setAndValidate('password', e.target.value)}
                    />
                    <Input
                        error={validationErrors.confirmPassword}
                        label={t('login.confirmPassword')}
                        type="password"
                        placeholder={t('login.passwordPlaceholder')}
                        value={confirmPassword}
                        onChange={(e) => setAndValidate('confirmPassword', e.target.value)}
                    />
                    <Button disabled={submitDisabled} type="button" onClick={handleSubmit}>
                        {t('login.signUp')}
                    </Button>
                </form>
            ) : inviteStatus === 'pending' ? (
                <div className="mx-auto h-full flex flex-col justify-center items-center space-y-6">
                    <p>{t('login.checkingInviteStatus')}</p>
                    <Spinner className="w-5 h-5 fill-primary-600 text-white" />{' '}
                </div>
            ) : (
                <div className="mx-auto h-full flex flex-col justify-center items-center space-y-6">
                    <h2>{t(inviteStatus)}</h2>
                    <Button onClick={() => router.back()}>{t('login.back')}</Button>
                </div>
            )}
        </div>
    );
}

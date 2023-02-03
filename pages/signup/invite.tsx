import { useRouter } from 'next/router';
import {
    acceptInviteErrors,
    CompanyAcceptInviteGetQueries,
    CompanyAcceptInviteGetResponse,
    CompanyAcceptInvitePostBody,
    CompanyAcceptInvitePostResponse,
} from 'pages/api/company/accept-invite';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Button } from 'src/components/button';
import { LanguageToggle } from 'src/components/common/language-toggle';
import { Input } from 'src/components/input';
import { Title } from 'src/components/title';
import { useFields } from 'src/hooks/use-fields';
import { useUser } from 'src/hooks/use-user';
import { nextFetch, nextFetchWithQueries } from 'src/utils/fetcher';
import { clientLogger } from 'src/utils/logger';

export default function Register() {
    const { t } = useTranslation();
    const { login, logout } = useUser();

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
    const [inviteStatus, setInviteStatus] = useState('pending');
    useEffect(() => {
        logout();
    }, [logout]);

    useEffect(() => {
        const checkInvite = async () => {
            try {
                const tokenStatus = await nextFetchWithQueries<
                    CompanyAcceptInviteGetQueries,
                    CompanyAcceptInviteGetResponse
                >('company/accept-invite', { token });
                if (tokenStatus.message && tokenStatus.email) {
                    setFieldValue('email', tokenStatus.email);
                    setInviteStatus(tokenStatus?.message);
                } else setInviteStatus('inviteValid');
            } catch (error: any) {
                clientLogger(error, 'error');
                if (error.message) setInviteStatus(error.message);
            }
        };
        if (token) checkInvite();
    }, [token, setFieldValue, router]);

    const handleSubmit = async () => {
        try {
            setRegistering(true);
            const body: CompanyAcceptInvitePostBody = {
                token,
                password,
                firstName,
                lastName,
                email,
            };
            await nextFetch<CompanyAcceptInvitePostResponse>('company/accept-invite', {
                method: 'post',
                body,
            });
            toast.success(t('login.inviteAccepted'));
            await login(email, password);
            router.push('/dashboard');
        } catch (error: any) {
            if (error?.message === 'User already registered') {
                return router.push('/login');
            }
            clientLogger(error, 'error');
            if (Object.values(acceptInviteErrors).includes(error?.message)) {
                toast.error(t(`login.${error.message}`));
            } else {
                toast.error(t('login.oopsSomethingWentWrong'));
            }
        } finally {
            setRegistering(false);
        }
    };
    if (!token)
        return (
            <div className="mx-auto h-full flex flex-col justify-center items-center space-y-6">
                <h2>{t('login.noInviteTokenFound')}</h2>
                <Button onClick={() => router.back()}>{t('login.back')}</Button>
            </div>
        );

    return (
        <div className="w-full h-screen px-10 flex flex-col">
            <div className="sticky top-0 flex items-center w-full justify-between">
                <Title />
                <LanguageToggle />
            </div>
            {inviteStatus === 'inviteValid' && (
                <form className="max-w-xs w-full mx-auto flex-grow flex flex-col justify-center items-center space-y-5">
                    <div className="text-left w-full">
                        <h1 className="font-bold text-4xl mb-2">{t('login.acceptInvite')}</h1>
                        <h3 className="text-sm text-gray-600 mb-8">
                            {t('login.someoneInvitedYouToJoinRelayClub')}
                        </h3>
                    </div>
                    <Input label={t('login.email')} value={email} disabled />

                    <Input
                        label={t('login.firstName')}
                        type="text"
                        placeholder={t('login.firstNamePlaceholder') || ''}
                        value={firstName}
                        required
                        onChange={(e) => setFieldValue('firstName', e.target.value)}
                    />
                    <Input
                        label={t('login.lastName')}
                        type="text"
                        placeholder={t('login.lastNamePlaceholder') || ''}
                        value={lastName}
                        required
                        onChange={(e) => setFieldValue('lastName', e.target.value)}
                    />
                    <Input
                        label={t('login.password')}
                        type="password"
                        placeholder={t('login.passwordPlaceholder') || ''}
                        value={password}
                        onChange={(e) => setFieldValue('password', e.target.value)}
                    />
                    <Input
                        label={t('login.confirmPassword')}
                        type="password"
                        placeholder={t('login.passwordPlaceholder') || ''}
                        value={confirmPassword}
                        onChange={(e) => setFieldValue('confirmPassword', e.target.value)}
                    />
                    <Button
                        disabled={
                            registering ||
                            !firstName ||
                            !lastName ||
                            !password ||
                            !confirmPassword ||
                            password !== confirmPassword ||
                            !token
                        }
                        onClick={(e) => {
                            e.preventDefault();
                            handleSubmit();
                        }}
                    >
                        {t('login.signUp')}
                    </Button>
                </form>
            )}
            {inviteStatus === 'pending' && (
                <div className="mx-auto h-full flex flex-col justify-center items-center space-y-6">
                    <p>{t('login.checkingInviteStatus')}</p>
                </div>
            )}
            {inviteStatus !== 'pending' && inviteStatus !== 'inviteValid' && (
                <div className="mx-auto h-full flex flex-col justify-center items-center space-y-6">
                    <h2>{inviteStatus}</h2>
                    <Button onClick={() => router.back()}>{t('login.back')}</Button>
                </div>
            )}
        </div>
    );
}

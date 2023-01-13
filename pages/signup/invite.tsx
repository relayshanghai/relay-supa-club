import { useRouter } from 'next/router';
import {
    CompanyAcceptInviteGetQueries,
    CompanyAcceptInviteGetResponse
} from 'pages/api/company/accept-invite';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Button } from 'src/components/button';
import { Input } from 'src/components/input';
import { Title } from 'src/components/title';
import { useFields } from 'src/hooks/use-fields';
import { nextFetch, nextFetchWithQueries } from 'src/utils/fetcher';
import { clientLogger } from 'src/utils/logger';

export default function Register() {
    const { t } = useTranslation();

    const router = useRouter();
    const {
        values: { password, confirmPassword, firstName, lastName },
        setFieldValue
    } = useFields({
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: ''
    });
    const token = router.query.token as string;
    const [registering, setRegistering] = useState(false);
    const [inviteStatus, setInviteStatus] = useState('pending');

    useEffect(() => {
        const checkInvite = async () => {
            try {
                const tokenStatus = await nextFetchWithQueries<
                    CompanyAcceptInviteGetQueries,
                    CompanyAcceptInviteGetResponse
                >('company/accept-invite', { token });
                if (tokenStatus?.message) setInviteStatus(tokenStatus?.message);
            } catch (error: any) {
                clientLogger(error, 'error');
                if (error.message) setInviteStatus(error.message);
            }
        };
        if (token) checkInvite();
    }, [token]);

    const handleSubmit = async () => {
        try {
            setRegistering(true);
            await nextFetch('company/accept-invite', {
                method: 'post',
                body: JSON.stringify({
                    token,
                    password,
                    firstName,
                    lastName
                })
            });
            toast.success(t('login.inviteAccepted'));
            router.push('/login');
        } catch (error: any) {
            clientLogger(error, 'error');
            if (error.message) toast.error(t(`login.${error.message}`));
            else toast.error(t('login.oopsSomethingWentWrong'));
        } finally {
            setRegistering(false);
        }
    };

    return (
        <div className="w-full h-full px-10 py-8">
            <Title />
            {token && inviteStatus === 'inviteValid' && (
                <form className="max-w-sm mx-auto h-full flex flex-col justify-center items-center space-y-6">
                    <div>{t('login.someoneInvitedYouToJoinRelayClub')}</div>
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
            {token && inviteStatus === 'pending' && (
                <div className="mx-auto h-full flex flex-col justify-center items-center space-y-6">
                    <div>{t('login.checkingInviteStatus')}</div>
                </div>
            )}
            {token && inviteStatus !== 'pending' && (
                <div className="mx-auto h-full flex flex-col justify-center items-center space-y-6">
                    <h2>{inviteStatus}</h2>
                    <Button onClick={() => router.back()}>{t('login.back')}</Button>
                </div>
            )}
            {!token && (
                <div className="mx-auto h-full flex flex-col justify-center items-center space-y-6">
                    <h2>{t('login.noInviteTokenFound')}</h2>
                    <Button onClick={() => router.back()}>{t('login.back')}</Button>
                </div>
            )}
        </div>
    );
}

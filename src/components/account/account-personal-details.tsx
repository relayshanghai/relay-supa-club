import { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { APP_URL } from 'src/constants';
import { useFields } from 'src/hooks/use-fields';
import { clientLogger } from 'src/utils/logger';
import { Button } from '../button';
import { Edit } from '../icons';
import { Input } from '../input';
import { AccountContext } from './account-context';

export const PersonalDetails = () => {
    const {
        values: { firstName, lastName, email },
        setFieldValue: setUserFieldValues,
        reset: resetUserValues,
    } = useFields({
        firstName: '',
        lastName: '',
        email: '',
    });
    const {
        userDataLoading,
        profile,
        user,
        updateProfile,
        refreshProfile,
        refreshCompany,
        supabaseClient,
    } = useContext(AccountContext);

    const [editMode, setEditMode] = useState(false);
    const [generatingResetEmail, setGeneratingResetEmail] = useState(false);

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

    useEffect(() => {
        if (!userDataLoading && profile) {
            resetUserValues({
                firstName: profile.first_name,
                lastName: profile.last_name,
                email: user?.email || '',
            });
        }
    }, [userDataLoading, profile, user, resetUserValues]);

    const { t } = useTranslation();

    const handleUpdateProfile = async () => {
        try {
            await updateProfile({
                first_name: firstName,
                last_name: lastName,
                email: email,
            });
            refreshProfile();
            refreshCompany();
            toast.success(t('account.personal.profileUpdated'));
            setEditMode(false);
        } catch (e) {
            clientLogger(e, 'error');
            toast.error(t('account.personal.oopsWentWrong'));
        }
    };

    return (
        <div
            className={`flex flex-col items-start space-y-4 p-4 bg-white rounded-lg w-full lg:max-w-2xl relative ${
                userDataLoading ? 'opacity-50' : ''
            } shadow-lg shadow-gray-200`}
        >
            <h2 className="text-lg font-bold">{t('account.personal.title')}</h2>
            {editMode ? (
                <div className={`w-full lg:w-1/2 `}>
                    <Input
                        label={t('account.personal.firstName')}
                        type="first_name"
                        placeholder={t('account.personal.firstNamePlaceholder') || ''}
                        value={firstName}
                        required
                        onChange={(e) => setUserFieldValues('firstName', e.target.value)}
                    />
                    <Input
                        label={t('account.personal.lastName')}
                        type="last_name"
                        placeholder={t('account.personal.lastNamePlaceholder') || ''}
                        value={lastName}
                        required
                        onChange={(e) => setUserFieldValues('lastName', e.target.value)}
                    />
                    {/* TODO: changing email should require a confirmation step */}
                    {/* <Input
                        label={t('account.personal.email')}
                        type="email"
                        placeholder={t('account.personal.emailPlaceholder') || ''}
                        value={email}
                        required
                        onChange={(e) => setUserFieldValues('email', e.target.value)}
                    /> */}
                    <div className="flex flex-col space-y-3">
                        <div className="text-sm">{t('account.personal.email')}</div>
                        <div className="text-sm font-bold ml-2">{email}</div>
                    </div>
                </div>
            ) : (
                <div className={`w-full space-y-6`}>
                    <div className="flex flex-col space-y-3">
                        <div className="text-sm">{t('account.personal.firstName')}</div>
                        <div className="text-sm font-bold ml-2">{firstName}</div>
                    </div>

                    <div className="flex flex-col space-y-3">
                        <div className="text-sm">{t('account.personal.lastName')}</div>
                        <div className="text-sm font-bold ml-2">{lastName}</div>
                    </div>
                    <div className="flex flex-col space-y-3">
                        <div className="text-sm">{t('account.personal.email')}</div>
                        <div className="text-sm font-bold ml-2">{email}</div>
                    </div>
                </div>
            )}
            <Button
                variant="secondary"
                onClick={handleResetPassword}
                disabled={generatingResetEmail}
            >
                {t('login.changePassword')}
            </Button>

            {editMode ? (
                <div className="flex flex-row justify-end w-full space-x-4">
                    <Button disabled={userDataLoading} onClick={handleUpdateProfile}>
                        {t('account.update')}
                    </Button>{' '}
                    <Button onClick={() => setEditMode(false)} variant="secondary">
                        {t('account.cancel')}
                    </Button>
                </div>
            ) : (
                <Button
                    className={`absolute top-4 right-4 px-3 py-1 disabled:bg-white ${
                        userDataLoading ? 'opacity-75' : ''
                    }`}
                    disabled={userDataLoading}
                    onClick={() => setEditMode(true)}
                    variant="secondary"
                >
                    <Edit className="text-primary-500 w-4 h-4" />
                </Button>
            )}
        </div>
    );
};

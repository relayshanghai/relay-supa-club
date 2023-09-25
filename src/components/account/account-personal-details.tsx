import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { APP_URL, emailRegex } from 'src/constants';
import { useCompany } from 'src/hooks/use-company';
import { useFields } from 'src/hooks/use-fields';
import { useUser } from 'src/hooks/use-user';
import { clientLogger } from 'src/utils/logger-client';
import { Button } from '../button';
import { Edit } from '../icons';
import { Input } from '../input';
import { useRudderstack, useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { ACCOUNT_PERSONAL_DETAILS } from 'src/utils/rudderstack/event-names';
import { UpdateProfileInfo } from 'src/utils/analytics/events';

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
    const { refreshCompany } = useCompany();
    const { loading: userDataLoading, profile, user, supabaseClient, updateProfile, refreshProfile } = useUser();
    const { trackEvent } = useRudderstack();
    const { track } = useRudderstackTrack();

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
            });
            refreshProfile();
            refreshCompany();
            toast.success(t('account.personal.profileUpdated'));
            setEditMode(false);
            if (firstName !== profile?.first_name) {
                track(UpdateProfileInfo, {
                    info_type: 'Profile',
                    info_name: 'First Name',
                });
            }
            if (lastName !== profile?.last_name) {
                track(UpdateProfileInfo, {
                    info_type: 'Profile',
                    info_name: 'Last Name',
                });
            }
        } catch (e) {
            clientLogger(e, 'error');
            toast.error(t('account.personal.oopsWentWrong'));
        }
    };
    const handleUpdateEmail = async () => {
        try {
            if (!supabaseClient) {
                throw new Error('Supabase client not initialized');
            }
            if (!email || email === profile?.email) {
                throw new Error(t('account.personal.pleaseEnterNewEmail') || '');
            }

            // TODO: replace regex with library https://toil.kitemaker.co/0JhYl8-relayclub/8sxeDu-v2_project/items/176
            if (!emailRegex.test(email)) {
                throw new Error(t('account.personal.pleaseEnterValidEmail') || '');
            }
            const { error } = await supabaseClient.auth.updateUser(
                { email },
                { emailRedirectTo: `${APP_URL}/login?${new URLSearchParams({ email })}` },
            );
            if (error) throw error;
            toast.success(t('account.personal.confirmationEmailSentToNewAddress'));
            track(UpdateProfileInfo, {
                info_type: 'Profile',
                info_name: 'Email',
            });
        } catch (error: any) {
            clientLogger(error, 'error');
            toast.error(error?.message || t('account.personal.oopsWentWrong'));
        }
    };

    return (
        <div
            className={`relative flex w-full flex-col items-start space-y-4 rounded-lg bg-white p-4 lg:max-w-2xl ${
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

                    {editMode && (
                        <div className="mb-6 flex w-full flex-row justify-end space-x-4">
                            <Button disabled={userDataLoading} onClick={handleUpdateProfile}>
                                {t('account.update')}
                            </Button>
                            <Button onClick={() => setEditMode(false)} variant="secondary">
                                {t('account.cancel')}
                            </Button>
                        </div>
                    )}

                    <Input
                        label={t('account.personal.email')}
                        type="email"
                        placeholder={t('account.personal.emailPlaceholder') || ''}
                        value={email}
                        required
                        onChange={(e) => setUserFieldValues('email', e.target.value)}
                    />

                    <div className="flex w-full flex-row justify-end space-x-4">
                        <Button onClick={handleUpdateEmail}>{t('account.personal.updateEmail')}</Button>
                        <Button onClick={() => setEditMode(false)} variant="secondary">
                            {t('account.cancel')}
                        </Button>
                    </div>
                </div>
            ) : (
                <div className={`w-full space-y-6`}>
                    <div className="flex flex-col space-y-3">
                        <div className="text-sm">{t('account.personal.firstName')}</div>
                        <div className="ml-2 text-sm font-bold">{profile?.first_name}</div>
                    </div>

                    <div className="flex flex-col space-y-3">
                        <div className="text-sm">{t('account.personal.lastName')}</div>
                        <div className="ml-2 text-sm font-bold">{profile?.last_name}</div>
                    </div>
                    <div className="flex flex-col space-y-3">
                        <div className="text-sm">{t('account.personal.email')}</div>
                        <div className="ml-2 text-sm font-bold">{profile?.email}</div>
                    </div>
                </div>
            )}
            {!editMode && (
                <Button variant="secondary" onClick={handleResetPassword} disabled={generatingResetEmail}>
                    {t('login.changePassword')}
                </Button>
            )}

            {!editMode && (
                <Button
                    className={`absolute right-4 top-4 px-3 py-1 disabled:bg-white ${
                        userDataLoading ? 'opacity-75' : ''
                    }`}
                    disabled={userDataLoading}
                    onClick={() => {
                        setEditMode(true);
                        trackEvent(ACCOUNT_PERSONAL_DETAILS('click on Edit'));
                    }}
                    variant="secondary"
                >
                    <Edit className="h-4 w-4 text-primary-500" />
                </Button>
            )}
        </div>
    );
};

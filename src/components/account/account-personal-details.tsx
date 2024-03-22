import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { emailRegex } from 'src/constants';
import { useCompany } from 'src/hooks/use-company';
import { useFields } from 'src/hooks/use-fields';
import { useUser } from 'src/hooks/use-user';
import { clientLogger } from 'src/utils/logger-client';
import { Button } from 'shadcn/components/ui/button';
import { Input } from '../input';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { UpdateProfileInfo } from 'src/utils/analytics/events';
import { useHostname } from 'src/utils/get-host';
import { nextFetch } from 'src/utils/fetcher';

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
    const { loading: userDataLoading, profile, user, updateProfile, refreshProfile } = useUser();
    const { track } = useRudderstackTrack();
    const { appUrl } = useHostname();

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
            if (!email || email === profile?.email) {
                throw new Error(t('account.personal.pleaseEnterNewEmail') || '');
            }

            // TODO: replace regex with library https://toil.kitemaker.co/0JhYl8-relayclub/8sxeDu-v2_project/items/176
            if (!emailRegex.test(email)) {
                throw new Error(t('account.personal.pleaseEnterValidEmail') || '');
            }

            await nextFetch('profiles/change-email-link', {
                method: 'POST',
                body: {
                    name: `${profile?.first_name} ${profile?.last_name}`,
                    oldMail: profile?.email,
                    newMail: email,
                    redirectUrl: appUrl,
                },
            });
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
        <section id="personal-details" className="w-full">
            <p className="pb-6 font-semibold">{t('account.personal.title')}</p>
            <hr className="pb-5" />
            <section className="flex w-full justify-end">
                <div className={`relative flex w-full flex-col items-start space-y-4 rounded-lg bg-white p-4 lg:w-3/4`}>
                    <div className={`w-full`}>
                        <section className="flex gap-6">
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
                        </section>
                        <div className="mb-6 flex w-full flex-row justify-end space-x-4">
                            <Button
                                className="bg-navy-50 font-semibold text-navy-500 hover:bg-navy-100"
                                disabled={userDataLoading}
                                onClick={handleUpdateProfile}
                            >
                                {t('account.update')}
                            </Button>
                        </div>

                        <hr className="pb-5" />
                        <Input
                            label={t('account.personal.email')}
                            type="email"
                            placeholder={t('account.personal.emailPlaceholder') || ''}
                            value={email}
                            required
                            onChange={(e) => setUserFieldValues('email', e.target.value)}
                        />

                        <div className="flex w-full flex-row justify-end space-x-4">
                            <Button
                                className="bg-navy-50 font-semibold text-navy-500 hover:bg-navy-100"
                                onClick={handleUpdateEmail}
                            >
                                {t('account.personal.updateEmail')}
                            </Button>
                        </div>
                    </div>
                    <hr />
                </div>
            </section>
        </section>
    );
};

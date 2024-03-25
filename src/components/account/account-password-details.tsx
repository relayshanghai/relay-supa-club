import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useFields } from 'src/hooks/use-fields';
import { useUser } from 'src/hooks/use-user';
import { Button } from 'shadcn/components/ui/button';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { ChangePassword } from 'src/utils/analytics/events';
import { useHostname } from 'src/utils/get-host';
import { nextFetch } from 'src/utils/fetcher';

export const PasswordDetails = () => {
    const {
        values: { email },
        reset: resetUserValues,
    } = useFields({
        firstName: '',
        lastName: '',
        email: '',
    });
    const { loading: userDataLoading, profile, user } = useUser();
    const { track } = useRudderstackTrack();
    const { appUrl } = useHostname();
    const { t } = useTranslation();

    const [generatingResetEmail, setGeneratingResetEmail] = useState(false);
    const handleResetPassword = async () => {
        setGeneratingResetEmail(true);
        try {
            if (!email) {
                throw new Error('Please enter your email');
            }
            await nextFetch('profiles/reset-password', {
                method: 'POST',
                body: {
                    name: `${profile?.first_name} ${profile?.last_name}`,
                    email,
                    redirectUrl: appUrl,
                },
            });
            toast.success(t('login.resetPasswordEmailSent'));
            track(ChangePassword);
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

    return (
        <section id="personal-details" className="w-full">
            <p className="pb-6 font-semibold">{t('login.password')}</p>
            <hr className="pb-5" />
            <section className="flex w-full justify-end">
                <div className={`relative flex w-full flex-col items-start space-y-4 rounded-lg bg-white p-4 lg:w-3/4`}>
                    <p className="text-base font-normal text-gray-700">{t('login.requestResetPassword')}.</p>
                    <section className="flex w-full justify-end">
                        <Button
                            className="border-primary-500 bg-white font-semibold text-primary-500 hover:bg-primary-500"
                            variant="outline"
                            onClick={handleResetPassword}
                            disabled={generatingResetEmail}
                        >
                            {t('login.sendResetPasswordEmail')}.
                        </Button>
                    </section>
                </div>
            </section>
        </section>
    );
};

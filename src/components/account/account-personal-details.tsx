import { useContext, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useFields } from 'src/hooks/use-fields';
import { clientLogger } from 'src/utils/logger';
import { Button } from '../button';
import { Input } from '../input';
import { AccountContext } from './account-context';

export const PersonalDetails = () => {
    const {
        values: { firstName, lastName, email },
        setFieldValue: setUserFieldValues,
        reset: resetUserValues
    } = useFields({
        firstName: '',
        lastName: '',
        email: ''
    });
    const { userDataLoading, profile, user, upsertProfile } = useContext(AccountContext);

    useEffect(() => {
        if (!userDataLoading && profile) {
            resetUserValues({
                firstName: profile.first_name,
                lastName: profile.last_name,
                email: user?.email || ''
            });
        }
    }, [userDataLoading, profile, user, resetUserValues]);

    const { t } = useTranslation();

    const handleupsertProfile = async () => {
        try {
            await upsertProfile({
                first_name: firstName,
                last_name: lastName,
                email: email
            });
            toast.success(t('account.personal.profileUpdated'));
        } catch (e) {
            clientLogger(e, 'error');
            toast.error(t('account.personal.oopsWentWrong'));
        }
    };

    return (
        <div className="flex flex-col items-start space-y-4 p-4 bg-white rounded-lg w-full lg:max-w-2xl">
            <h2 className="">{t('account.personal.title')}</h2>
            <div className={`w-full ${userDataLoading ? 'opacity-50' : ''}`}>
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
                <Input
                    label={t('account.personal.email')}
                    type="email"
                    placeholder={t('account.personal.emailPlaceholder') || ''}
                    value={email}
                    required
                    onChange={(e) => setUserFieldValues('email', e.target.value)}
                />
            </div>
            <div className="flex flex-row justify-end w-full">
                <Button disabled={userDataLoading} onClick={handleupsertProfile}>
                    {t('account.update')}
                </Button>
            </div>
        </div>
    );
};

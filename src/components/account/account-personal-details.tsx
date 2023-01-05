import { useContext } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Button } from '../button';
import { Input } from '../input';
import { AccountContext } from './account-context';

export const PersonalDetails = () => {
    const { userDataLoading, firstName, lastName, email, setUserFieldValues, updateProfile } =
        useContext(AccountContext);

    const { t } = useTranslation();
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
                <Button
                    disabled={userDataLoading}
                    onClick={async () => {
                        try {
                            await updateProfile({
                                first_name: firstName,
                                last_name: lastName,
                                email: email
                            });
                            toast.success(t('account.personal.profileUpdated'));
                        } catch (e) {
                            toast.error(t('account.personal.oopsWentWrong'));
                        }
                    }}
                >
                    {t('account.update')}
                </Button>
            </div>
        </div>
    );
};

import { useRouter } from 'next/router';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Button } from 'src/components/button';
import { LanguageToggle } from 'src/components/common/language-toggle';
import { Spinner } from 'src/components/icons';
import { Input } from 'src/components/input';
import { Title } from 'src/components/title';
import { useCompany } from 'src/hooks/use-company';
import { useFields } from 'src/hooks/use-fields';
import { useUser } from 'src/hooks/use-user';
import { clientLogger } from 'src/utils/logger';

export default function Register() {
    const { t } = useTranslation();
    const router = useRouter();
    const { loading } = useUser();
    const { createCompany } = useCompany();
    const { values, setFieldValue } = useFields({
        name: '',
        website: '',
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        try {
            setSubmitting(true);
            await createCompany(values);
            toast.success(t('login.companyCreated'));
            await router.push('/signup/payment-onboard');
        } catch (e: any) {
            clientLogger(e, 'error');
            if (
                (e?.message && e.message.includes('No logged in user found')) ||
                e.message.includes('No company name found')
            ) {
                toast.error(e.message);
            } else {
                toast.error(t('login.oopsSomethingWentWrong'));
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="w-full h-screen px-10 flex flex-col">
            <div className="sticky top-0 flex items-center w-full justify-between">
                <Title />
                <LanguageToggle />
            </div>
            <form className="max-w-xs w-full mx-auto flex-grow flex flex-col justify-center items-center space-y-5">
                {loading && !submitting ? (
                    <Spinner className="fill-primary-600 text-white w-20 h-20" />
                ) : (
                    <>
                        <div className="text-left w-full">
                            <h1 className="font-bold text-4xl mb-2">{t('login.onboardCompany')}</h1>
                            <h3 className="text-sm text-gray-600 mb-8">
                                {t('login.addCompanyDetails')}
                            </h3>
                        </div>
                        <Input
                            label={t('login.companyName')}
                            type="company_name"
                            placeholder={t('login.companyNamePlaceholder') || ''}
                            value={values.name}
                            required
                            onChange={(e) => setFieldValue('name', e.target.value)}
                        />
                        <Input
                            label={t('login.companyWebsite')}
                            type="company_website"
                            placeholder={t('login.companyWebsitePlaceholder') || ''}
                            value={values.website}
                            onChange={(e) => setFieldValue('website', e.target.value)}
                        />
                        <Button disabled={!values.name || submitting} onClick={handleSubmit}>
                            {t('login.createCompany')}
                        </Button>
                    </>
                )}
            </form>
        </div>
    );
}

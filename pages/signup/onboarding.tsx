import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Button } from 'src/components/button';

import { Spinner } from 'src/components/icons';
import { Input } from 'src/components/input';
import { LoginSignupLayout } from 'src/components/SignupLayout';
import { createCompanyErrors, createCompanyValidationErrors } from 'src/errors/company';
import { useCompany } from 'src/hooks/use-company';
import { useFields } from 'src/hooks/use-fields';
import { useRudderstack } from 'src/hooks/use-rudderstack';
import { useUser } from 'src/hooks/use-user';
import { hasCustomError } from 'src/utils/errors';
import { clientLogger } from 'src/utils/logger-client';

const errors = {
    ...createCompanyValidationErrors,
    ...createCompanyErrors,
};

export default function Register() {
    const { t } = useTranslation();
    const { Track } = useRudderstack();
    const router = useRouter();
    const { loading, logout } = useUser();
    const { createCompany } = useCompany();
    const { values, setFieldValue } = useFields({
        name: '',
        website: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const handleSubmit = useCallback(async () => {
        try {
            setSubmitting(true);
            const created = await createCompany(values);
            if (!created?.cus_id) {
                throw new Error('no cus_id, error creating company');
            }
            toast.success(t('login.companyCreated'));
            Track('Clicked on Create Company', { company: values.name });
            await router.push('/signup/payment-onboard');
        } catch (e: any) {
            clientLogger(e, 'error');
            if (hasCustomError(e, errors)) {
                toast.error(t(`login.${e.message}`));
            } else {
                toast.error(t('login.oopsSomethingWentWrong'));
            }
        } finally {
            setSubmitting(false);
        }
    }, [Track, createCompany, router, t, values]);

    return (
        <LoginSignupLayout>
            <form className="mx-auto flex w-full max-w-xs flex-grow flex-col items-center justify-center space-y-2">
                {loading && !submitting ? (
                    <Spinner className="h-20 w-20 fill-primary-600 text-white" />
                ) : (
                    <>
                        <div className="w-full text-left">
                            <h1 className="mb-2 text-4xl font-bold">{t('login.onboardCompany')}</h1>
                            <h3 className="mb-8 text-sm text-gray-600">{t('login.addCompanyDetails')}</h3>
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
                        <Button type="button" disabled={!values.name || submitting} onClick={handleSubmit}>
                            {t('login.createCompany')}
                        </Button>
                    </>
                )}
                <div className="pt-20">
                    <button type="button" className="text-sm text-gray-500" onClick={logout}>
                        {t('login.stuckHereTryAgain1')}
                        <Link className="text-primary-500" href="/logout">
                            {t('login.signOut')}
                        </Link>
                        {t('login.stuckHereTryAgain2')}
                    </button>
                </div>
            </form>
        </LoginSignupLayout>
    );
}

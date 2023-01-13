import { useRouter } from 'next/router';
import { useEffect } from 'react';
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
    const { loading, profile, refreshProfile } = useUser();
    const { createCompany, company, refreshCompany } = useCompany();
    const { values, setFieldValue } = useFields({
        name: '',
        website: ''
    });

    // const [paymentMethod, setPaymentMethod ] = useState(false);
    // TODO: during this component's initial loading start, optimistically make a company. Then use the company ID to generate a Stripe customer id. Then create an add payment button that links to the strip account dashboard, detect the payment method and add a customer id when finally submitting this page. middleware.ts checks for cus_id to confirm payment method.
    useEffect(() => {
        const checkForCompletedOnboard = async () => {
            if (company?.cus_id) router.push('/dashboard');
            else refreshCompany();
        };
        if (!loading) checkForCompletedOnboard();
    }, [company?.cus_id, loading, profile, refreshCompany, router]);

    const handleSubmit = async () => {
        try {
            await createCompany(values);
            toast.success(t('login.companyCreated'));
            refreshProfile();
        } catch (e) {
            clientLogger(e, 'error');
            toast.error(t('login.oopsSomethingWentWrong'));
        }
    };

    return (
        <div className="w-full h-screen px-10 flex flex-col">
            <div className="sticky top-0 flex items-center w-full justify-between">
                <Title />
                <LanguageToggle />
            </div>
            <form className="max-w-xs w-full mx-auto flex-grow flex flex-col justify-center items-center space-y-5">
                {loading ? (
                    <Spinner className="fill-primary-600 text-white w-20 h-20" />
                ) : (
                    <>
                        <div className="text-left w-full">
                            <h1 className="font-bold text-4xl mb-2">{t('login.onboardCompany')}</h1>
                            <h3 className="text-sm text-gray-600 mb-8">
                                {t('login.addCompanyDetailsAndPaymentMethod')}
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
                        <Button
                            disabled={!values.name}
                            onClick={(e) => {
                                e.preventDefault();
                                handleSubmit();
                            }}
                        >
                            {t('login.createCompany')}
                        </Button>
                    </>
                )}
            </form>
        </div>
    );
}

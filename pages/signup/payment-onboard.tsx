import Link from 'next/link';
import router from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Button } from 'src/components/button';
import { LanguageToggle } from 'src/components/common/language-toggle';
import { Spinner } from 'src/components/icons';
import { Title } from 'src/components/title';
import { APP_URL } from 'src/constants';
import { useCompany } from 'src/hooks/use-company';
import { useSubscription } from 'src/hooks/use-subscription';
import { buildSubscriptionPortalUrl } from 'src/utils/api/stripe/helpers';
import { clientLogger } from 'src/utils/logger';

const PaymentOnboard = () => {
    const { t } = useTranslation();
    const { company } = useCompany();
    const { subscription, createTrial, paymentMethods } = useSubscription();
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const redirectIfSubscribed = async () => {
            if (subscription?.status === 'trialing' || subscription?.status === 'active')
                await router.push('/dashboard');
        };
        redirectIfSubscribed();
    }, [subscription?.status]);

    const handleSubmit = async () => {
        try {
            setSubmitting(true);
            const result = await createTrial();
            if (result.status === 'trialing' || subscription?.status === 'active') {
                toast.success(t('login.companyCreated'));
                await router.push('/dashboard');
            } else {
                throw new Error(JSON.stringify(result));
            }
        } catch (e: any) {
            clientLogger(e, 'error');
            if (e.message && e.message === 'Already subscribed') await router.push('/dashboard');

            toast.error(t('login.oopsSomethingWentWrong'));
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
                <div className="text-left w-full">
                    <h1 className="font-bold text-4xl mb-2">{t('login.addPaymentMethod')}</h1>
                    <h3 className="text-sm text-gray-600 mb-8">{t('login.andActivateTrial')}</h3>
                </div>
                {!company?.id ? (
                    <Spinner className="fill-primary-600 text-white w-20 h-20" />
                ) : (
                    <>
                        {paymentMethods?.length && paymentMethods?.length > 0 ? (
                            <div className="flex flex-col space-y-6">
                                <Button onClick={handleSubmit} disabled={submitting}>
                                    {t('login.activateTrial')}
                                </Button>
                                <p className="text-xs text-gray-500">{t('login.signupTerms')}</p>
                            </div>
                        ) : (
                            <Link
                                href={buildSubscriptionPortalUrl({
                                    id: company.id,
                                    returnUrl: `${APP_URL}/signup/payment-onboard`,
                                })}
                            >
                                <a>
                                    <Button variant="secondary">
                                        {t('login.addPaymentMethod')}
                                    </Button>
                                </a>
                            </Link>
                        )}
                    </>
                )}
            </form>
        </div>
    );
};

export default PaymentOnboard;

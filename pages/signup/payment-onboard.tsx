import Link from 'next/link';
import router from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Button } from 'src/components/button';

import { Spinner } from 'src/components/icons';
import { LoginSignupLayout } from 'src/components/SignupLayout';
import { APP_URL } from 'src/constants';
import { createSubscriptionErrors } from 'src/errors/subscription';
import { useCompany } from 'src/hooks/use-company';
import { useSubscription } from 'src/hooks/use-subscription';
import { useUser } from 'src/hooks/use-user';
import { buildSubscriptionPortalUrl } from 'src/utils/api/stripe/portal';
import { hasCustomError } from 'src/utils/errors';
import { clientLogger } from 'src/utils/logger-client';

const PaymentOnboard = () => {
    const { t } = useTranslation();
    const { company } = useCompany();
    const { subscription, createTrial, paymentMethods } = useSubscription();
    const [submitting, setSubmitting] = useState(false);
    const { logout } = useUser();
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
            if (result.status === 'trialing') {
                toast.success(t('login.accountActivated'));
                await router.push('/dashboard');
            } else {
                throw new Error(JSON.stringify(result));
            }
        } catch (e: any) {
            clientLogger(e, 'error');
            if (e.message && e.message === 'Already subscribed') {
                await router.push('/dashboard');
            } else if (hasCustomError(e, createSubscriptionErrors)) {
                toast.error(t(`account.subscription.modal.${e.message}`));
            } else {
                toast.error(t('login.oopsSomethingWentWrong'));
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <LoginSignupLayout>
            <form className="mx-auto flex w-full max-w-xs flex-grow flex-col items-center justify-center space-y-2">
                <div className="w-full text-left">
                    <h1 className="mb-2 text-4xl font-bold">{t('login.addPaymentMethod')}</h1>
                    <h3 className="mb-8 text-sm text-gray-600">{t('login.andActivateTrial')}</h3>
                </div>
                {!company?.id ? (
                    <Spinner className="h-20 w-20 fill-primary-600 text-white" />
                ) : (
                    <>
                        {paymentMethods?.length && paymentMethods?.length > 0 ? (
                            <div className="flex flex-col space-y-6">
                                <Button type="button" onClick={handleSubmit} disabled={submitting}>
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
                                <Button variant="secondary">{t('login.addPaymentMethod')}</Button>
                            </Link>
                        )}
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
};

export default PaymentOnboard;

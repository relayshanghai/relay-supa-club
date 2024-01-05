import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { LanguageToggle } from 'src/components/common/language-toggle';
import { Loader } from 'src/components/icons';
import { Title } from 'src/components/title';
import {
    cancelSubscriptionWithSubscriptionId,
    getSetupIntents,
    upgradeSubscriptionWithAlipay,
} from 'src/utils/api/stripe/handle-subscriptions';
import toast from 'react-hot-toast';
import { clientLogger } from 'src/utils/logger-client';
import { useTranslation } from 'react-i18next';
import { useAtom } from 'jotai';
import { alipaySubscriptionSubmitting } from 'src/atoms/alipay-subscription-submitting';

const ConfirmAlipayPaymentPage = () => {
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useAtom(alipaySubscriptionSubmitting);
    const { companyId, customerId, priceId, selectedPlan, couponId } = router.query;
    const { t } = useTranslation();
    const handleCreateSubscriptionWithAlipay = useCallback(async () => {
        if (
            !companyId ||
            typeof companyId !== 'string' ||
            !customerId ||
            typeof customerId !== 'string' ||
            !priceId ||
            typeof priceId !== 'string'
        ) {
            return;
        }

        try {
            // handle setupIntent authorization failure first
            const setupIntents = (await getSetupIntents(customerId)).data;
            // get the latest setup intent
            setupIntents.sort((a, b) => b.created - a.created);

            const latestSetupIntent = setupIntents[0];
            if (!latestSetupIntent?.payment_method) {
                toast.error(t('account.generalPaymentError'));
                clientLogger(`Cannot find setupIntents from this customer - ${customerId}`, 'error');
                router.push(`/payments?plan=${selectedPlan}`);
                return;
            }
            const { last_setup_error } = latestSetupIntent;
            if (last_setup_error && last_setup_error.code?.includes('setup_intent_authentication_failure')) {
                toast.error(t('account.authorizationPaymentError'));
                router.push(`/payments?plan=${selectedPlan}`);
                clientLogger(`SetupIntent setup failed - ${customerId}`, 'error');
                return;
            }
            // if no setupError, create subscription with the customer
            const { paymentIntent, oldSubscriptionId } = await upgradeSubscriptionWithAlipay({
                companyId,
                cusId: customerId,
                priceId,
                couponId: typeof couponId === 'string' ? couponId : undefined,
            });
            if (paymentIntent.status === 'succeeded') {
                await cancelSubscriptionWithSubscriptionId(oldSubscriptionId);
                toast.success('Your subscription has been upgraded successfully!');
            }
            router.push('/account');
        } catch (error: any) {
            toast.error(t('account.generalPaymentError'));
            router.push(`/payments?plan=${selectedPlan}`);
            clientLogger(error, (scope) => {
                return scope.setContext('Error', {
                    error: 'Create subscription with Alipay Error',
                    customer: customerId,
                });
            });
        }
    }, [companyId, couponId, customerId, priceId, router, selectedPlan, t]);

    useEffect(() => {
        if (
            isProcessing ||
            !companyId ||
            typeof companyId !== 'string' ||
            !customerId ||
            typeof customerId !== 'string' ||
            !priceId ||
            typeof priceId !== 'string'
        ) {
            return;
        }
        setIsProcessing(true);
        handleCreateSubscriptionWithAlipay();
    }, [companyId, customerId, handleCreateSubscriptionWithAlipay, isProcessing, priceId, setIsProcessing]);

    return (
        <div className="h-screen">
            <div className="mb-3 flex w-full items-center justify-between p-5">
                <Title />
                <LanguageToggle />
            </div>
            <div className="flex h-full flex-col justify-center pb-32 text-center">
                {isProcessing && (
                    <div className="flex flex-col">
                        <Loader className="m-auto h-6 w-6 fill-primary-600 text-white" />
                        <div className="p-6">{t('account.processingMessage')}</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConfirmAlipayPaymentPage;

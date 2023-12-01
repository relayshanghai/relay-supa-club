import { useCallback, useEffect, useState } from 'react';
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

const ConfirmAlipayPaymentPage = () => {
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const { companyId, customerId, priceId, selectedPlan } = router.query;
    const { t } = useTranslation();
    const handleCreateSubscriptionWithAlipay = useCallback(async () => {
        if (typeof companyId !== 'string' || typeof customerId !== 'string' || typeof priceId !== 'string') {
            return;
        }
        setIsProcessing(true);

        try {
            //handle setupIntent authorization failure first
            const setupIntents = await getSetupIntents(customerId);
            if (setupIntents.length < 1) {
                toast.error(t('account.generalPaymentError'));
                clientLogger(`Cannot find setupIntents from this customer - ${customerId}`, 'error');
                router.push(`/payments?plan=${selectedPlan}`);
                return;
            }
            //get the latest setup intent
            const latestSetupIntent = setupIntents.data[0];
            const { last_setup_error } = latestSetupIntent;
            if (last_setup_error && last_setup_error.code.includes('setup_intent_authentication_failure')) {
                toast.error(t('account.authorizationPaymentError'));
                router.push(`/payments?plan=${selectedPlan}`);
                clientLogger(`SetupIntent setup failed - ${customerId}`, 'error');
                return;
            }
            //if no setupError, create subscription with the customer
            const { paymentIntent, oldSubscriptionId } = await upgradeSubscriptionWithAlipay(
                companyId,
                customerId,
                priceId,
            );
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
        } finally {
            setIsProcessing(false);
        }
    }, [companyId, customerId, priceId, router, selectedPlan, t]);

    useEffect(() => {
        handleCreateSubscriptionWithAlipay();
    }, [handleCreateSubscriptionWithAlipay]);

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

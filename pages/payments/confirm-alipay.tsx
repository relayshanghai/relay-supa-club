import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { LanguageToggle } from 'src/components/common/language-toggle';
import { Spinner } from 'src/components/icons';
import { Title } from 'src/components/title';
import {
    cancelSubscriptionWithSubscriptionId,
    getSetupIntents,
    upgradeSubscriptionWithAlipay,
} from 'src/utils/api/stripe/handle-subscriptions';
import toast from 'react-hot-toast';
import { clientLogger } from 'src/utils/logger-client';

const ConfirmAlipayPaymentPage = () => {
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const { companyId, customerId, priceId, selectedPlan } = router.query;

    const handleCreateSubscriptionWithAlipay = useCallback(async () => {
        if (typeof companyId !== 'string' || typeof customerId !== 'string' || typeof priceId !== 'string') {
            return;
        }
        setIsProcessing(true);

        try {
            //handle setupIntent authorization failure
            const setupIntents = await getSetupIntents(customerId);
            if (setupIntents.length < 1) {
                toast.error('Something went wrong in the process, please try again or use another payment method.');
                router.push(`/payments?plan=${selectedPlan}`);
                clientLogger(`Cannot find setupIntents from this customer - ${customerId}`, 'error');
                return;
            }
            //get the latest setup intent
            const latestSetupIntent = setupIntents.data[0];
            const { last_setup_error } = latestSetupIntent;
            if (last_setup_error && last_setup_error.code.includes('setup_intent_authentication_failure')) {
                toast.error('Your payment authorization failed, please try again or use another payment method.');
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
            toast.error('Something went wrong in the process, please try again');
            router.push('/account');
            clientLogger(error, 'error');
        } finally {
            setIsProcessing(false);
        }
    }, [companyId, customerId, priceId, router, selectedPlan]);

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
                        <Spinner className="m-auto h-5 w-5 fill-primary-600 text-white" />
                        <div className="p-3">We are processing the payment for you...</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConfirmAlipayPaymentPage;

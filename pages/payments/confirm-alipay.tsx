import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { LanguageToggle } from 'src/components/common/language-toggle';
import { Spinner } from 'src/components/icons';
import { Title } from 'src/components/title';
import {
    cancelSubscriptionWithSubscriptionId,
    upgradeSubscriptionWithAlipay,
} from 'src/utils/api/stripe/handle-subscriptions';
import toast from 'react-hot-toast';

const ConfirmAlipayPaymentPage = () => {
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const { companyId, customerId, priceId } = router.query;
    const [errorMessage, setErrorMessage] = useState(null);

    const handleCreateSubscriptionWithAlipay = useCallback(async () => {
        if (typeof companyId !== 'string' || typeof customerId !== 'string' || typeof priceId !== 'string') {
            return;
        }
        setIsProcessing(true);
        try {
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
            setErrorMessage(error.message);
        } finally {
            setIsProcessing(false);
        }
    }, [companyId, customerId, priceId, router]);

    useEffect(() => {
        handleCreateSubscriptionWithAlipay();
    }, [handleCreateSubscriptionWithAlipay]);

    return (
        <div className="h-screen">
            <div className="mb-3 flex w-full items-center justify-between p-5">
                <Title open={true} />
                <LanguageToggle />
            </div>
            <div className="flex h-full flex-col justify-center pb-32 text-center">
                {isProcessing && (
                    <div className="flex flex-col">
                        <Spinner className="m-auto h-5 w-5 fill-primary-600 text-white" />
                        <div className="p-3">We are generating new subscription for you...</div>
                    </div>
                )}
                {errorMessage && (
                    <div className="flex flex-col text-red-500 ">
                        <div>{errorMessage}</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConfirmAlipayPaymentPage;

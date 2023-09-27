import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { LanguageToggle } from 'src/components/common/language-toggle';
import { Spinner } from 'src/components/icons';
import { Title } from 'src/components/title';
import { upgradeSubscriptionWithAlipay } from 'src/utils/api/stripe/handle-subscriptions';

const ConfirmAlipayPaymentPage = () => {
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const { companyId, customerId, priceId } = router.query;

    const handleCreateSubscriptionWithAlipay = useCallback(async () => {
        setIsProcessing(true);
        if (typeof companyId !== 'string' || typeof customerId !== 'string' || typeof priceId !== 'string') {
            return;
        }
        try {
            const { confirmPaymentIntent } = await upgradeSubscriptionWithAlipay(companyId, customerId, priceId);
            console.log('confirmPaymentIntent =================>', confirmPaymentIntent);

            // router.push('/account');
        } catch (error) {
            console.log('error', error);
        } finally {
            setIsProcessing(false);
        }
    }, [companyId, customerId, priceId]);

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
                {isProcessing ? (
                    <Spinner className="m-auto h-5 w-5 fill-primary-600 text-white" />
                ) : (
                    ' this is the redirected page after confirm the setupIntent succeeded'
                )}
            </div>
        </div>
    );
};

export default ConfirmAlipayPaymentPage;

import { type AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { SuccessCallback } from 'src/components/callback/success';
import { usePayment } from 'src/hooks/use-payment';

const CheckoutCallback = () => {
    const router = useRouter();
    const { callback } = usePayment();
    const { payment_intent, payment_intent_client_secret, redirect_status } = router.query;
    useEffect(() => {
        if (payment_intent && payment_intent_client_secret && redirect_status) {
            postConfirmation();
        } else if (redirect_status) {
            router.push(`/account`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [payment_intent, payment_intent_client_secret, redirect_status]);

    const postConfirmation = async () => {
        await callback({
            paymentIntentId: payment_intent as string,
            paymentIntentSecret: payment_intent_client_secret as string,
            redirectStatus: redirect_status as string,
        })
            .catch((e: AxiosError) => {
                if (e.response?.status !== 404) {
                    toast.error('Failed to pay');
                }
            })
            .finally(() => {
                router.push(`/account`);
            });
    };

    return <SuccessCallback />;
};

export default CheckoutCallback;

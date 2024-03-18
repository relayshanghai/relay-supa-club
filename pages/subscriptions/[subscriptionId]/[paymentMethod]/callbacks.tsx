import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useApiClient } from 'src/utils/api-client/request';
import { clientLogger } from 'src/utils/logger-client';
import toast from 'react-hot-toast';

const PaymentCallback = () => {
    const { t } = useTranslation();
    const { apiClient } = useApiClient();
    const router = useRouter();
    const { subscriptionId, payment_intent, payment_intent_client_secret, redirect_status } = router.query;
    useEffect(() => {
        const data = {
            paymentIntentId: payment_intent,
            paymentIntentSecret: payment_intent_client_secret,
            redirectStatus: redirect_status,
            subscriptionId: subscriptionId,
        };
        apiClient
            .put(`/v2/subscriptions/stripe-post-confirmation`, data)
            .catch((e) => {
                clientLogger(`post confirmation error: ${e}`, 'error');
                toast.error(t('subscription.failedToConfirm'));
            })
            .finally(() => {
                router.push(`/account`);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subscriptionId, payment_intent, payment_intent_client_secret, redirect_status]);

    return (
        <>
            <div className="flex h-full items-center justify-center">
                <span className="text-xl">{t('subscription.redirection')}</span>
            </div>
        </>
    );
};

export default PaymentCallback;

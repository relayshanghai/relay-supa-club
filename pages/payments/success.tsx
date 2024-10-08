import { useCallback, useEffect } from 'react';
import { LanguageToggle } from 'src/components/common/language-toggle';
import { CheckCircleOutline } from 'src/components/icons';
import { Title } from 'src/components/title';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { useRudderstack } from 'src/hooks/use-rudderstack';
import { PAYMENT_PAGE } from 'src/utils/rudderstack/event-names';
import { cancelSubscriptionWithSubscriptionId } from 'src/utils/api/stripe/handle-subscriptions';
import toast from 'react-hot-toast';

const UpgradeSubscriptionSuccess = () => {
    const router = useRouter();
    const { t } = useTranslation();
    const { trackEvent } = useRudderstack();
    const { oldSubscriptionId, subscriptionId, priceId, companyId } = router.query;

    const handleUpgradeSubscription = useCallback(async () => {
        if (
            typeof subscriptionId !== 'string' ||
            typeof oldSubscriptionId !== 'string' ||
            typeof priceId !== 'string' ||
            typeof companyId !== 'string'
        ) {
            return;
        }
        try {
            // cancel previous subscription when new one is created successfully
            await cancelSubscriptionWithSubscriptionId(oldSubscriptionId);
            // and the update subscription status and usages will be handled from the webhook
            trackEvent(PAYMENT_PAGE('Upgrade Subscription Success'));
            router.push('/account');
        } catch (error) {
            toast.error(t('account.subscription.upgradeSubscriptionError'));
        }
    }, [companyId, oldSubscriptionId, priceId, router, subscriptionId, t, trackEvent]);

    useEffect(() => {
        handleUpgradeSubscription();
    }, [handleUpgradeSubscription]);

    return (
        <div className="h-screen">
            <div className="mb-3 flex w-full items-center justify-between p-5">
                <Title />
                <LanguageToggle />
            </div>
            <div className="flex h-full flex-col justify-center pb-32 text-center">
                <p className="mb-3 text-lg font-medium text-gray-400 ">{t('account.redirectingMsg')}</p>
                <h1 className="mb-6 text-4xl font-bold">{t('account.planIsReady')}</h1>
                <CheckCircleOutline className="mx-auto my-10 h-12 w-12 text-green-500 " />
            </div>
        </div>
    );
};

export default UpgradeSubscriptionSuccess;

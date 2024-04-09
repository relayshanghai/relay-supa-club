import { useRouter } from 'next/router';
import LoginSignupLayout from 'src/components/SignupLayout';
import { AddPaymentsSection } from 'src/components/payments/add-payments-section';
import { PlanDetails } from 'src/components/payments/plan-details';
import { type ActiveSubscriptionTier } from 'src/hooks/use-prices';
import { useLocalStorageSubscribeResponse } from 'src/hooks/v2/use-subscription';

export default function SubscriptionPaymentPage() {
    const router = useRouter();
    const [stripeSubscribeResponse] = useLocalStorageSubscribeResponse();
    const { isReady } = router;

    const priceTier =
        typeof stripeSubscribeResponse.plan === 'string'
            ? (stripeSubscribeResponse.plan as ActiveSubscriptionTier)
            : 'discovery';

    return (
        <LoginSignupLayout
            leftBgColor="bg-primary-500"
            left={isReady ? <PlanDetails priceTier={priceTier as ActiveSubscriptionTier} /> : <></>}
            right={isReady ? <AddPaymentsSection priceTier={priceTier as ActiveSubscriptionTier} /> : <></>}
        />
    );
}

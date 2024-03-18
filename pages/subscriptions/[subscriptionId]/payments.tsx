import { useRouter } from 'next/router';
import LoginSignupLayout from 'src/components/SignupLayout';
import { AddPaymentsSection } from 'src/components/payments/add-payments-section';
import { PlanDetails } from 'src/components/payments/plan-details';
import { useLocalStorage } from 'src/hooks/use-localstorage';
import { type ActiveSubscriptionTier } from 'src/hooks/use-prices';
import { STRIPE_SUBSCRIBE_RESPONSE, stripeSubscribeResponseInitialValue } from 'src/hooks/use-subscription-v2';

export default function SubscriptionPaymentPage() {
    const router = useRouter();
    const [stripeSubscribeResponse] = useLocalStorage(STRIPE_SUBSCRIBE_RESPONSE, stripeSubscribeResponseInitialValue);
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
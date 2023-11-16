import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { AddPaymentsSection } from 'src/components/payments/add-payments-section';
import { PlanDetails } from 'src/components/payments/plan-details';
import LoginSignupLayout from 'src/components/SignupLayout';
import type { ActiveSubscriptionTier } from 'src/hooks/use-prices';

export default function PaymentPage() {
    const router = useRouter();
    const {
        isReady,
        query: { plan },
    } = router;
    useEffect(() => {
        if (!isReady) {
            throw new Error('Router is not ready');
        }
    }, [isReady]);

    return (
        <LoginSignupLayout
            leftBgColor="bg-primary-500"
            left={<PlanDetails priceTier={plan as ActiveSubscriptionTier} />}
            right={<AddPaymentsSection priceTier={plan as ActiveSubscriptionTier} />}
        />
    );
}

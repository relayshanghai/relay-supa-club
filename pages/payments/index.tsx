import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { AddPaymentsSection } from 'src/components/payments/add-payments-section';
import { PlanDetails } from 'src/components/payments/plan-details';
import LoginSignupLayout from 'src/components/SignupLayout';
import type { newActiveSubscriptionTier } from 'types';

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
            leftBgColor="bg-white"
            left={<PlanDetails priceTier={plan as newActiveSubscriptionTier} />}
            right={<AddPaymentsSection priceTier={plan as newActiveSubscriptionTier} />}
        />
    );
}

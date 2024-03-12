import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import LoginSignupLayout from 'src/components/SignupLayout';
import { AddPaymentsSection } from 'src/components/payments/add-payments-section';
import { PlanDetails } from 'src/components/payments/plan-details';
import { type ActiveSubscriptionTier } from 'src/hooks/use-prices';

export default function SubscriptionPaymentPage() {
    const router = useRouter();
    const {
        isReady,
        query: { plan },
    } = router;
    const [routing, setRouting] = useState(true);

    useEffect(() => {
        if (isReady) {
            setRouting(false);
        }
    }, [isReady]);

    const priceTier = typeof plan === 'string' ? (plan as ActiveSubscriptionTier) : 'discovery';

    return (
        <LoginSignupLayout
            leftBgColor="bg-primary-500"
            left={routing ? <></> : <PlanDetails priceTier={priceTier as ActiveSubscriptionTier} />}
            right={routing ? <></> : <AddPaymentsSection priceTier={priceTier as ActiveSubscriptionTier} />}
        />
    );
}

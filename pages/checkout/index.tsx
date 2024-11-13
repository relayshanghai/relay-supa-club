import { useRouter } from 'next/router';
import LoginSignupLayout from 'src/components/SignupLayout';
import { CheckoutPaymentsSection } from 'src/components/payments/checkout-payment-section';
import { TopUpBundleDetails } from 'src/components/topup/topup-bundle-details';
import { type TopUpSizes, useLocalSelectedTopupBundle } from 'src/hooks/use-topups';

export default function CheckoutPaymentPage() {
    const router = useRouter();
    const [selectedTopupBundle] = useLocalSelectedTopupBundle();
    const { isReady } = router;

    return (
        <LoginSignupLayout
            leftBgColor="bg-primary-500"
            left={isReady ? <TopUpBundleDetails topUpSize={selectedTopupBundle.topupPrice as TopUpSizes} /> : <></>}
            right={isReady ? <CheckoutPaymentsSection /> : <></>}
        />
    );
}

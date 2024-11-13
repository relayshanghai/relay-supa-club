import { useRouter } from 'next/router';
import LoginSignupLayout from 'src/components/SignupLayout';
import { AddPaymentsSection } from 'src/components/payments/add-payments-section';
import { ScreenshotsCarousel } from 'src/components/signup/screenshots-carousel';

export default function CheckoutPaymentPage() {
    const router = useRouter();
    const { isReady } = router;

    return (
        <LoginSignupLayout
            leftBgColor="bg-primary-500"
            left={isReady ? <ScreenshotsCarousel /> : <></>}
            right={isReady ? <AddPaymentsSection /> : <></>}
        />
    );
}

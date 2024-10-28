import { SubscriptionStatus } from 'src/backend/database/subcription/subscription-entity';
import { ScreenshotsCarousel } from 'src/components/signup/screenshots-carousel';
import LoginSignupLayout from 'src/components/SignupLayout';
import { PaymentIntroduction } from 'src/components/stripe/payment-introduction';
import { PaymentMethodPage } from 'src/components/stripe/payment-method-page';
import { useSubscription } from 'src/hooks/v2/use-subscription';

const PaymentMethodsPage = () => {
    const { subscription } = useSubscription();

    return (
        <LoginSignupLayout
            leftBgColor="boostbot-gradient"
            left={subscription?.status !== SubscriptionStatus.TRIAL ? <ScreenshotsCarousel /> : <PaymentIntroduction />}
            right={<PaymentMethodPage />}
        />
    );
};

export default PaymentMethodsPage;

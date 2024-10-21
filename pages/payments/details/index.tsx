import { ScreenshotsCarousel } from 'src/components/signup/screenshots-carousel';
import LoginSignupLayout from 'src/components/SignupLayout';
import { PaymentMethodPage } from 'src/components/stripe/payment-method-page';

const PaymentMethodsPage = () => {
    return (
        <LoginSignupLayout
            leftBgColor="boostbot-gradient"
            left={<ScreenshotsCarousel />}
            right={<PaymentMethodPage />}
        />
    );
};

export default PaymentMethodsPage;

import LoginSignupLayout from 'src/components/SignupLayout';
import { PaymentIntroduction } from 'src/components/stripe/payment-introduction';
import { PaymentMethodPage } from 'src/components/stripe/payment-method-page';

const PaymentMethodsPage = () => {
    return (
        <LoginSignupLayout
            leftBgColor="boostbot-gradient"
            left={<PaymentIntroduction />}
            right={<PaymentMethodPage />}
        />
    );
};

export default PaymentMethodsPage;

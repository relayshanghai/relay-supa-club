import { AddPaymentsSection } from 'src/components/payments/add-payments-section';
import { PlanDetails } from 'src/components/payments/plan-details';
import LoginSignupLayout from 'src/components/SignupLayout';

export default function PaymentPage() {
    //replace setPriceId with selected price id from pricing section page
    return <LoginSignupLayout left={<PlanDetails />} right={<AddPaymentsSection />} />;
}

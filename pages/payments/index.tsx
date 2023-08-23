import { AddPaymentsSection } from 'src/components/payments/add-payments-section';
import { PlanDetails } from 'src/components/payments/plan-details';
import LoginSignupLayout from 'src/components/SignupLayout';

export default function PaymentPage() {
    //pass the selected plan to PlanDetails
    return <LoginSignupLayout leftBgColor="bg-white" left={<PlanDetails />} right={<AddPaymentsSection />} />;
}

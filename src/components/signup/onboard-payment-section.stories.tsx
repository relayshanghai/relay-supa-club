import type { Meta } from '@storybook/react';
import { OnboardPaymentSection } from './onboard-payment-section';
import { UserAndCompanyTestWrapper } from 'src/utils/user-test-wrapper';

const meta: Meta<typeof OnboardPaymentSection> = {
    title: 'Onboarding/Payment Section',
    component: OnboardPaymentSection,
};
export default meta;
export const Default = () => (
    <UserAndCompanyTestWrapper>
        <OnboardPaymentSection priceId="123" />
    </UserAndCompanyTestWrapper>
);

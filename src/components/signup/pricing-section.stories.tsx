import type { Meta } from '@storybook/react';

import { UserAndCompanyTestWrapper } from 'src/utils/user-test-wrapper';
import { PricingSection } from './pricing-section';

const meta: Meta<typeof PricingSection> = {
    title: 'Signup/Prices Section',
    component: PricingSection,
};
export default meta;

export const Default = () => (
    <UserAndCompanyTestWrapper>
        <PricingSection setPriceId={() => null} />
    </UserAndCompanyTestWrapper>
);

import type { Meta } from '@storybook/react';

import { UserAndCompanyTestWrapper } from 'src/utils/user-test-wrapper';
import { LandingPage } from './landing-page';

const meta: Meta<typeof LandingPage> = {
    title: 'Signup/Landing Page',
    component: LandingPage,
};
export default meta;

export const Default = () => (
    <UserAndCompanyTestWrapper>
        <LandingPage />
    </UserAndCompanyTestWrapper>
);

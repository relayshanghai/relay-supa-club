import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import CreateCompanyButton from './create-company-button';
import RudderstackProvider from './rudderstack/rudderstack-provider';

type Story = StoryObj<typeof CreateCompanyButton>;

const meta: Meta<typeof CreateCompanyButton> = {
    title: 'Tracking/Create Company',
    component: CreateCompanyButton,
};

export default meta;

export const Default: Story = {
    args: {
        company: 'The Company',
        onClick: action('clicked create company'),
    },
    argTypes: {
        onClick: {
            type: 'function',
        },
    },
    render: ({ company, onClick }) => (
        <RudderstackProvider>
            <CreateCompanyButton company={company} onClick={onClick} />
        </RudderstackProvider>
    ),
};

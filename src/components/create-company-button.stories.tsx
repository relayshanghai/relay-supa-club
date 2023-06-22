import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import CreateCompanyButton, { CreateCompanyEvent } from './create-company-button';

type Story = StoryObj<typeof CreateCompanyButton>;

const meta: Meta<typeof CreateCompanyButton> = {
    title: 'Tracking/Create Company',
    component: CreateCompanyButton,
};

export default meta;

export const Default: Story = {
    args: {
        // @note: demo async function payload
        eventpayload: () => new Promise((resolve) => resolve({ company: 'The Company!' })),
        onClick: action('clicked create company'),
    },
    argTypes: {
        onClick: {
            type: 'function',
        },
    },
    render: ({ eventpayload, onClick }) => (
        <CreateCompanyButton event={CreateCompanyEvent} eventpayload={eventpayload} onClick={onClick}>
            Create Company
        </CreateCompanyButton>
    ),
};

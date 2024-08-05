import type { Meta, StoryObj } from '@storybook/react';

import { EmailStatusBadge } from './email-status-badge';
import type { EmailStatus } from './constants';
const options: EmailStatus[] = [
    'Opened',
    'Scheduled',
    'Bounced',
    'Delivered',
    'Unscheduled',
    'Replied',
    'Link Clicked',
    'Failed',
    'Ignored',
];

const meta: Meta<typeof EmailStatusBadge> = {
    tags: ['autodocs'],
    component: EmailStatusBadge,
    argTypes: {
        loading: {
            type: { name: 'boolean', required: true },
            control: {
                type: 'boolean',
            },
            description: 'Loading state',
            table: {
                type: { summary: 'boolean' },
                defaultValue: {
                    summary: 'false',
                },
            },
        },
        status: {
            type: { name: 'string', required: true },
            control: {
                type: 'select',
                options,
            },
            description: 'Status of email',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'EmailStatus type' },
            },
            mapping: {
                ...options,
            },
            options,
        },
    },
};

export default meta;
type Story = StoryObj<typeof EmailStatusBadge>;

export const Default: Story = {
    args: {
        loading: false,
        status: 'Scheduled',
    },
    parameters: {},
};

export const Delivered: Story = {
    name: 'components/input/Input',
    args: { loading: false, status: 'Delivered' },
};

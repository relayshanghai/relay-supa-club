// Button.stories.ts|tsx
import type { Meta, StoryObj } from '@storybook/react';

import TextInput from '../components/library/forms/text-input';
import { useForm } from 'react-hook-form';

const meta: Meta<typeof TextInput> = {
    /* 👇 The title prop is optional.
     * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
     * to learn how to generate automatic titles
     */
    title: 'Form/Text Input',
    tags: ['autodocs'],
    component: TextInput,
    argTypes: {
        variant: {
            type: { name: 'string', required: true },
            control: {
                type: 'text',
            },
            description: 'Type of input component',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'input-field' },
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof TextInput>;

export const Default: Story = {
    args: {
        variant: 'input-field',
    },
};

export const Input: Story = {
    name: 'components/input/Input',
    args: {
        variant: 'components-input',
        label: 'Demo',
        error: '',
        placeholder: '',
        note: '',
    },
};

export const TextInputUI: Story = {
    name: 'components/ui/TextInput',
    args: {
        variant: 'components-ui',
        fieldName: 'field_name',
        label: 'Demo',
        isRequired: false,
        placeHolder: '',
    },
    decorators: [
        (Story, ctx) => {
            const {
                register,
                formState: { errors },
            } = useForm();

            return (
                <div>
                    <Story args={{ ...ctx.args, register, errors }} />
                </div>
            );
        },
    ],
    argTypes: {
        fieldName: {
            name: 'Field Name',
            type: { name: 'string', required: true },
        },
        maximLength: {
            name: 'Max Characters',
            type: 'number',
        },
        minimLength: {
            name: 'Minimum Characters',
            type: 'number',
        },
    },
};

import { render } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { SequenceAccordion } from './sequence-accordion';
import { Accordion } from 'shadcn/components/ui/accordion';
import { type OutreachEmailTemplateEntity } from 'src/backend/database/sequence-email-template/sequence-email-template-entity';
import StoreProvider from 'src/store/Providers/StoreProvider';

vi.mock('src/backend/database/sequence-email-template/sequence-email-template-entity', () => ({
    Step: {
        OUTREACH: 'OUTREACH',
        FIRST_FOLLOW_UP: 'FIRST_FOLLOW_UP',
        SECOND_FOLLOW_UP: 'SECOND_FOLLOW_UP',
    },
}));

vi.mock('pages/api/outreach/email-templates/request', () => ({
    OutreachStepRequest: {
        OUTREACH: 'OUTREACH',
        FIRST_FOLLOW_UP: 'FIRST_FOLLOW_UP',
        SECOND_FOLLOW_UP: 'SECOND_FOLLOW_UP',
        THIRD_FOLLOW_UP: 'THIRD_FOLLOW_UP',
    },
    TemplateRequest: {
        name: '',
        description: '',
        subject: '',
        template: '',
        step: '',
        variableIds: [],
    },
}));

enum Step {
    OUTREACH = 'OUTREACH',
    FIRST_FOLLOW_UP = 'FIRST_FOLLOW_UP',
    SECOND_FOLLOW_UP = 'SECOND_FOLLOW_UP',
    THIRD_FOLLOW_UP = 'THIRD_FOLLOW_UP',
}

const MockComponent = ({ title, items, step }: { title: string; items: OutreachEmailTemplateEntity[]; step: Step }) => {
    return (
        <Accordion type="multiple" className="w-full" defaultValue={['outreach']}>
            <SequenceAccordion title={title} items={items} step={step} icon={<></>} />
        </Accordion>
    );
};

describe('SequenceAccordion', () => {
    test('renders the correct duration', () => {
        const title = 'Outreach';
        const items = [
            { id: 1, name: 'Item 1' },
            { id: 2, name: 'Item 2' },
            { id: 3, name: 'Item 3' },
        ] as unknown as OutreachEmailTemplateEntity[];
        const step = Step.OUTREACH;

        const { getByText } = render(
            <StoreProvider>
                <MockComponent title={title} items={items} step={step} />
            </StoreProvider>,
        );

        // Add your assertions here
        expect(getByText(title)).toBeDefined();
        expect(getByText(items[0].name)).toBeDefined();
        expect(getByText(items[1].name)).toBeDefined();
        expect(getByText(items[2].name)).toBeDefined();
    });
});

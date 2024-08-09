import { render } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { EmailTemplateModalStepOne } from './step-1';

vi.mock('src/hooks/v2/use-sequences-template', () => ({
    useSequenceEmailTemplates: () => ({
        sequenceEmailTemplates: [],
        refreshSequenceEmailTemplates: vi.fn(),
    }),
    useStagedSequenceEmailTemplateStore: () => ({
        stagedSequenceEmailTemplates: [
            {
                id: '1',
                name: 'Template 1',
                description: 'Template 1',
            },
            {
                id: '2',
                name: 'Template 2',
                description: 'Template 2',
            },
            {
                id: '3',
                name: 'Template 3',
                description: 'Template 3',
            },
        ],
        setStagedSequenceEmailTemplate: vi.fn(),
    }),
}));

vi.mock('src/backend/database/sequence-email-template/sequence-email-template-entity', () => ({
    Step: {
        OUTREACH: 'OUTREACH',
        FIRST_FOLLOW_UP: 'FIRST_FOLLOW_UP',
        SECOND_FOLLOW_UP: 'SECOND_FOLLOW_UP',
    },
}));

describe('CampaignModalStepOne', () => {
    test('component rendered', () => {
        const { getByTestId } = render(
            <EmailTemplateModalStepOne onNextStep={() => null} onPrevStep={() => null} setModalOpen={() => null} />,
        );
        const step1OutreachForm = getByTestId('step1-outreach-form');
        expect(step1OutreachForm).toBeDefined();
    });

    test('staged data rendered', () => {
        const { getAllByTestId } = render(
            <EmailTemplateModalStepOne onNextStep={() => null} onPrevStep={() => null} setModalOpen={() => null} />,
        );
        const data1 = getAllByTestId('test-id-1');
        const data2 = getAllByTestId('test-id-2');
        const data3 = getAllByTestId('test-id-3');
        expect(data1[0]).toBeDefined();
        expect(data2[0]).toBeDefined();
        expect(data3[0]).toBeDefined();
    });
});
